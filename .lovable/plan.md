# Plan: blindar el backend de IA para que SIEMPRE funcione al subir foto

## Diagnóstico verificado

Probé el backend `analyze-photo` directamente con curl y va perfecto:
- Petición sin foto → **200 OK**, devuelve perfil musical.
- Petición con foto real (1200×800 JPEG) → **200 OK en 1.5 s**, devuelve análisis válido (`mood`, `scene`, `energy`, etc.).
- Logs de la edge function: solo aparecen mis llamadas de prueba; **el cliente del usuario apenas está logrando invocar la función**, lo que confirma que el fallo está en el camino navegador → edge function, no en la edge function en sí.

### Causas reales del fallo en producción

1. **El cliente Supabase puede estar mal configurado en runtime.** Si `VITE_SUPABASE_URL` o `VITE_SUPABASE_PUBLISHABLE_KEY` no están en el bundle publicado, `supabase.functions.invoke()` falla antes de hacer fetch. El `try/catch` actual lo silencia con un toast genérico.
2. **No hay reintentos.** Un error de red transitorio (común en móvil) mata el análisis sin segunda oportunidad.
3. **No hay timeout claro.** Si la red se cuelga, el botón "Analizando…" se queda eterno.
4. **No se distinguen tipos de error** (red, validación, rate limit, IA caída): todo dice lo mismo.
5. **El insight a veces está vacío** (cuando `dominantColors=["neutral"]` y el resto sale por defecto) y parece que "no analizó nada" aunque sí lo hizo.
6. **El payload se envía con campos `selected*` vacíos** durante la subida (porque el usuario aún no ha elegido mood/momento). Esto no rompe la edge function, pero ensucia el `musicProfile` previo.

## Cambios al backend (edge function `analyze-photo`)

### 1. Reintentos internos al llamar al modelo de IA
Si la llamada a `ai.gateway.lovable.dev` falla o devuelve no-OK, reintentar hasta **3 veces** con backoff (300 ms, 800 ms, 1500 ms) antes de rendirse. Hoy un único 5xx puntual deja `photoAnalysis: null`.

### 2. Fallback de modelo
Si `google/gemini-2.5-flash` falla las 3 veces, intentar una vez más con `google/gemini-2.5-flash-lite` antes de devolver `null`. Así garantizamos respuesta visual incluso con saturación del modelo principal.

### 3. Timeout explícito en la llamada al modelo
Añadir `AbortController` con 20 s para la llamada al gateway de IA. Mejor un fallo claro que un cuelgue.

### 4. Respuesta de error estructurada
Cuando el análisis falle de verdad, devolver `200` con `{ success: true, photoAnalysis: null, musicProfile, warning: "ai_unavailable" }` en vez de `500`. El cliente nunca debe quedarse sin respuesta usable: el `musicProfile` por mood+momento ya basta para generar la playlist.

### 5. Logs más útiles
Imprimir el `status` y los primeros 200 caracteres de la respuesta del gateway cuando falle, para poder diagnosticar futuros incidentes desde la consola de la edge function.

## Cambios al cliente (`src/components/ExperienceForm.tsx`, `src/lib/api.ts`)

### A. Helper de invocación con reintentos + timeout
Crear `analyzePhotoWithRetry(payload)` en `src/lib/api.ts` que:
- Llama a `supabase.functions.invoke("analyze-photo", { body })`.
- Reintenta hasta **3 veces** con backoff exponencial (500 ms, 1500 ms, 3000 ms) ante errores de red, 429 y 5xx.
- Aborta cada intento a los **25 s** con `AbortController`.
- Devuelve `{ data, error, attempts }` para diagnóstico.

### B. Manejo de errores diferenciado
Mostrar al usuario un mensaje específico:
- Sin internet → "Sin conexión. Volveremos a intentarlo cuando haya señal."
- 429 → "Demasiados análisis seguidos. Espera 30 segundos y reintenta."
- 5xx tras todos los reintentos → "Nuestro analizador está saturado. Reintenta en unos segundos."
- Cualquier otro → "No pudimos analizar tu foto. Toca para reintentar."

### C. Botón "Reintentar análisis" en `PhotoUpload`
Cuando hay foto pero el análisis terminó sin `photoAnalysis`, mostrar un botón visible "Reintentar análisis con IA" que llama de nuevo a `analyzePhotoWithRetry` sin volver a subir el archivo.

### D. Validación temprana del cliente Supabase
Al iniciar `ExperienceForm`, verificar que el cliente Supabase está disponible. Si `VITE_SUPABASE_URL` falta, mostrar un banner discreto ("Conecta el backend para activar el análisis con IA") en vez de fallar silenciosamente al subir la foto.

### E. Insight nunca vacío
Mejorar `getPhotoInsight` para que **siempre** devuelva un texto humano, aunque el análisis traiga valores neutros (ej. "Detectamos un ambiente sereno"). Así el usuario ve confirmación visual de que el análisis ocurrió.

### F. Eliminar el reanálisis silencioso en `handleSubmit`
Como el análisis se hace al subir y se puede reintentar manualmente, quitar el bloque "si hay foto pero no análisis, intentar de nuevo en submit". El submit asume que el análisis ya está hecho.

## Validación post-cambios

1. **Backend con curl**: 5 llamadas seguidas con foto real → 5 × 200 OK con `photoAnalysis` poblado.
2. **Cliente en preview**: subir 3 fotos distintas → loader aparece, insight aparece bajo la foto.
3. **Simular fallo de red**: bloquear la edge function en DevTools → ver 3 reintentos en consola y mensaje claro al usuario; botón "Reintentar" funcional.
4. **Logs de edge function**: confirmar que cada intento queda registrado con status real.

## Detalles técnicos

- Sin migraciones de BD.
- Sin nuevos secrets (todos los necesarios — `LOVABLE_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — ya existen).
- Sin nuevas dependencias.
- Archivos editados:
  - `supabase/functions/analyze-photo/index.ts` (reintentos + fallback de modelo + timeout + warning)
  - `src/lib/api.ts` (helper `analyzePhotoWithRetry`)
  - `src/components/ExperienceForm.tsx` (usa helper, sin reanálisis silencioso, mensajes específicos)
  - `src/components/fryda/PhotoUpload.tsx` (botón "Reintentar análisis" + estado de fallo)
  - `src/lib/playlistGenerator.ts` (`getPhotoInsight` siempre devuelve texto)

## Lo que NO se toca en este plan
- Foto obligatoria/opcional → lo decidiremos después, primero garantizar que el análisis funcione.
- Solapamiento del botón de modo oscuro → se aborda en un plan separado tras aprobar éste.
- Copy del hero → sin cambios.
