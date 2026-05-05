# Arreglo de generación, mejor algoritmo de canciones y nuevo LLM de imagen

## Resumen
1. **Bug**: el botón "Generar Playlist" a veces no avanza a la pantalla de resultado.
2. **Algoritmo**: la selección de canciones se siente poco afinada con el mood/foto.
3. **LLM de imagen**: cambiar de `google/gemini-2.5-flash` a un modelo más preciso para que el análisis aporte realmente al algoritmo.

---

## 1. Por qué no se genera la playlist al dar click

Revisé `ExperienceForm.handleSubmit` y `Index.tsx`. El flujo está correcto pero hay tres puntos frágiles que explican el bloqueo que ves:

- **El botón se queda como "Creando tu playlist…" si algo falla antes del `setLoading(false)`** porque hoy hay un único `try/catch` muy ancho. Si `generateSmartPlaylist` devuelve `[]` (puede pasar cuando el mood no matchea nada y el catálogo no completa), igual sigue, pero si `localStorage` revienta por cuota dentro del bloque `try`, se traga el error sin notificar y el `await new Promise(r => setTimeout(r, 8000))` igual corre, dando sensación de "no pasa nada".
- **El `setTimeout` de 8s para "suspense"** ocurre **después** de guardar todo. Si el usuario dio click y tu navegador estaba en otra pestaña o el dispositivo se durmió, el timer se pausa y parece que nunca llega al resultado.
- **El `PlaylistLoader` solo se renderiza cuando `loading=true`**, pero si la generación falla muy rápido por un error de tipos en el catálogo (ej. `t.youtubeId` undefined en una pista), el `catch` muestra el toast de error pero el loader desaparece sin navegar.

### Fix
- Validar que `playlistTracks.length >= 10` antes de avanzar; si no, generar un fallback garantizado (top 25 por mood + random) y nunca quedar en cero.
- Mover la pausa dramática **antes** de los `setItem` y reducirla a 4s (hoy son 8s y el `PlaylistLoader` ya tiene su propio ciclo visual).
- Envolver cada `localStorage.setItem` en su propio try/catch ya con limpieza, y aunque falle el storage **siempre** llamar a `onPlaylistGenerated(playlistId)`. La playlist debe abrirse aunque no se haya podido persistir todo.
- Añadir `console.log` y un toast de diagnóstico cuando `playlistTracks.length === 0` para no quedarnos a ciegas.
- Asegurar que `setLoading(false)` se llama también justo antes de `onPlaylistGenerated` para que al volver al formulario no quede el spinner.

## 2. Mejorar el algoritmo de selección de canciones

Lo que hay hoy en `playlistGenerator.ts` puntúa bien pero tiene tres debilidades:
1. **El score por mood pesa 5 y por tag pesa 45–60**, así que cuando el usuario no selecciona artistas la playlist queda dominada por azar (todas las pistas con mood matcheado terminan en empate).
2. **No respeta el `energyRange` del `MusicProfile`** que ya construye la edge function (lo ignoramos en el cliente, lo único que usamos es `secondaryMoods` y `genreHints`).
3. **No diversifica por artista**: pueden salir 4 canciones del mismo artista seguidas.

### Cambios propuestos en `src/lib/playlistGenerator.ts`
- **Reescalado de scores** para que mood + momento + foto compitan mejor cuando no hay tags:
  - Mood primario: +10 (antes 5)
  - Mood secundario del perfil: +3 cada match (antes 1)
  - Momento: +6 (antes 3)
  - Coincidencia escena↔momento: +4 (antes 2)
  - Coincidencia foto-mood: +5 (antes 2)
  - Energía dentro del `energyRange` del perfil: +4 si está en rango, +2 si está a 1 de distancia.
  - Géneros del perfil: +1.5 por match (antes 0.5).
- **Penalización suave por repetir artista**: tras ordenar, recorrer y bajar -3 por cada pista del mismo artista ya elegida en los primeros 10 slots.
- **Diversidad**: limitar a máximo 2 pistas del mismo artista en la playlist final (excepto si el usuario lo pinneó como tag).
- **Respeto al `DiscoverySlider`**: hoy si `newMusicPercentage` es 0 y no hay tags, `selectedKnown` queda vacío y todo viene de `selectedNew`. Cambiar para que el "known pool" cuando no hay tags se llene con pistas de mood+momento del usuario (sus "favoritos predichos") y "new" sea el resto del catálogo.
- **Bonus por moodAtmosphere**: añadir score +2 si `track.tags` contiene alguna `atmosphereKeywords` del perfil.
- **Determinismo parcial**: usar un seed basado en `Date.now()` para la mezcla, así re-generar da playlist distinta cada vez (ya lo hace, lo confirmamos).

### Cambios en la edge function
- Devolver el `musicProfile` con `energyRange` ya tunado por la foto para que el cliente lo use de verdad.

## 3. Cambio de LLM para análisis de foto

Hoy: `google/gemini-2.5-flash` con fallback a `gemini-2.5-flash-lite`.

Recomendación: subir a **`google/gemini-2.5-pro`** como modelo principal y dejar `gemini-2.5-flash` como fallback rápido.

Por qué:
- `gemini-2.5-pro` es mejor en imágenes complejas (escenas con varias personas, iluminaciones mixtas, ambigüedad emocional), que es exactamente nuestro caso.
- El coste por análisis es mayor pero el análisis de foto es **una sola llamada por playlist**, no un chat continuo, así que el impacto es bajo.
- El fallback a `flash` mantiene velocidad si Pro está saturado o tarda más de 20s.

Cambios en `supabase/functions/analyze-photo/index.ts`:
- `primaryModel = "google/gemini-2.5-pro"`
- `fallbackModel = "google/gemini-2.5-flash"`
- Subir el timeout del intento Pro de 20s a 30s (Pro suele tardar más).
- Reducir reintentos del primario de 3 a 2 (Pro falla menos pero es más caro reintentar).
- Mantener todo lo demás igual (rate limit, normalización, warning codes).

### Alternativas si prefieres
- **`google/gemini-3-flash-preview`** (default actual de Lovable AI) — más nuevo, balance velocidad/precisión, gratis dentro del cupo. Buena opción si quieres equilibrio.
- **`openai/gpt-5-mini`** — excelente comprensión visual, multimodal sólido, coste medio.

Si no me dices preferencia, voy con **`gemini-2.5-pro` + fallback `gemini-2.5-flash`** porque maximiza calidad del análisis (que es la queja del algoritmo).

---

## Archivos editados

- `src/components/ExperienceForm.tsx` — fix de bloqueo en submit, fallback de pista vacía, reducción de pausa dramática, mejor manejo de cuota de storage.
- `src/lib/playlistGenerator.ts` — nuevo scoring, diversidad por artista, uso de `energyRange` y `atmosphereKeywords`.
- `supabase/functions/analyze-photo/index.ts` — cambio de modelo a `gemini-2.5-pro`, timeout 30s, devolución completa del `musicProfile`.

## Lo que NO cambia
- UI del formulario, copy ni branding.
- Catálogo de pistas (`src/data/tracks.ts`).
- Storage local (sigue siendo localStorage, sin BD).
- Foto sigue siendo opcional pero recomendada (no la hacemos obligatoria todavía — eso fue plan separado).
