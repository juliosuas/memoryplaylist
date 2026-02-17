

# Plan: Foto Analizada por IA + Animacion de Carga Premium

## Resumen

Tres mejoras principales:
1. **Arreglar el analisis de foto** - La funcion backend devuelve valores `"undefined"` como texto y los headers CORS estan incompletos, lo que puede causar fallos silenciosos en el navegador.
2. **Comprimir imagenes antes de enviarlas** - Las fotos grandes (5-10MB) pueden fallar. Se comprimiran a ~300KB antes de enviar.
3. **Animacion de carga premium** - Pantalla completa con corazon animado, mensajes progresivos y barra de progreso mientras se genera la playlist.

---

## Cambios Detallados

### 1. Edge Function `analyze-photo` - Corregir backend

**Archivo:** `supabase/functions/analyze-photo/index.ts`

- Actualizar CORS headers para incluir todos los headers que envia el cliente web (actualmente faltan varios y puede causar bloqueos en el navegador)
- Normalizar la respuesta de la IA: 
  - Reemplazar valores `"undefined"` por valores por defecto (`"indoor"`, `"natural"`, etc.)
  - Forzar `dominantColors` a ser siempre un array
  - Clampear `energy` al rango 1-10
- Mejorar manejo de errores con mensajes claros

### 2. Frontend - Comprimir imagenes

**Archivo:** `src/components/ExperienceForm.tsx`

- Crear funcion `resizeImage()` que usa canvas para:
  - Redimensionar a maximo 1200px de ancho
  - Comprimir a JPEG calidad 0.7
  - Resultado: ~100-300KB en vez de 5-10MB
- Mostrar `toast.error()` cuando falla el analisis (actualmente falla en silencio)

### 3. Pantalla de carga animada con corazon

**Nuevo archivo:** `src/components/fryda/PlaylistLoader.tsx`

Componente de pantalla completa que aparece mientras se genera la playlist:
- Corazon animado con efecto de latido (pulse)
- Barra de progreso simulada que avanza gradualmente
- Mensajes rotativos con suspenso:
  - "Analizando tu foto..." (0-25%)
  - "Interpretando tus emociones..." (25-50%)
  - "Buscando las canciones perfectas..." (50-75%)
  - "Finalizando tu playlist..." (75-100%)
- Transicion suave al resultado final
- Fondo con gradiente y efecto blur premium

**Archivo:** `src/components/ExperienceForm.tsx` (actualizar)
- Agregar estado `generationPhase` para controlar las fases de la animacion
- Mostrar `PlaylistLoader` en vez del formulario cuando esta generando

**Archivo:** `src/pages/Index.tsx` (actualizar)
- Pasar estado de carga para que el loader pueda ocupar todo el area del contenido

### 4. Algoritmo robusto con foto

**Archivo:** `src/lib/playlistGenerator.ts`

- Hacer que `dominantColors` funcione tanto si viene como string o como array
- Ignorar valores `"undefined"` en el matching de escenas, moods y otros campos
- El algoritmo ya funciona bien para el scoring; solo necesita ser defensivo con datos parciales

---

## Flujo del usuario despues de los cambios

```text
1. Usuario sube foto
2. Foto se comprime automaticamente (~300KB)
3. Se envia al backend para analisis con IA
4. IA devuelve analisis (normalizado, sin "undefined")
5. Se muestra insight en la foto ("Vibes de playa detectadas")
6. Usuario selecciona mood, momento, artistas
7. Presiona "Generar Playlist"
8. ANIMACION DE CARGA:
   - Corazon latiendo con gradiente
   - Barra de progreso avanzando
   - Mensajes rotativos (3-4 segundos)
9. Transicion suave al resultado con la playlist
```

---

## Archivos que se crean/modifican

| Archivo | Accion |
|---|---|
| `supabase/functions/analyze-photo/index.ts` | Modificar - CORS + normalizar respuesta |
| `src/components/fryda/PlaylistLoader.tsx` | Crear - Animacion de carga |
| `src/components/ExperienceForm.tsx` | Modificar - Comprimir fotos + integrar loader |
| `src/lib/playlistGenerator.ts` | Modificar - Matching defensivo |
| `src/pages/Index.tsx` | Modificar - Integrar estado de carga |

