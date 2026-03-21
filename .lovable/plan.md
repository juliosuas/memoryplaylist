
Objetivo: sacar la app del estado roto primero, incluso si eso implica volver a una versión estable y reintroducir cambios de forma segura.

## Diagnóstico probable

Encontré dos riesgos fuertes en el código actual:

1. `src/components/ui/sonner.tsx` usa `useTheme()` de `next-themes`, pero `src/App.tsx` no tiene ningún `ThemeProvider`.
   - Eso puede romper el montaje completo de React y dejar la pantalla en blanco.

2. El router solo tiene ruta `/`, pero tu preview actual está en `/index`.
   - Eso puede dejar la app en una ruta no contemplada o en un estado inconsistente según cómo se abra el preview.

También revisaré los cambios recientes en loader/resultados para asegurar que no haya otro crash silencioso al render inicial.

## Plan de arreglo

### 1. Cortar la causa más probable del blanco
Actualizar `src/components/ui/sonner.tsx` para que no dependa de `next-themes` sin provider.
- Opción preferida: hacerlo compatible con el sistema actual de tema que ya usa `ThemeToggle` con `document.documentElement`.
- Alternativa: envolver la app con `ThemeProvider` correctamente si conviene más.

Resultado esperado: la app vuelve a montar.

### 2. Corregir la navegación base
Actualizar `src/App.tsx` para soportar tanto:
- `/`
- `/index`

Así evitamos que el preview o enlaces internos caigan fuera de la ruta principal.

### 3. Revisar el render inicial de pantalla principal
Validar `src/pages/Index.tsx`, `src/components/SettingsDialog.tsx`, `src/components/fryda/PlaylistLoader.tsx` y `src/components/PlaylistResult.tsx` para eliminar cualquier render problemático que pueda seguir bloqueando la UI.
En especial:
- props opcionales mal usados
- referencias a APIs del navegador en momentos inseguros
- animaciones/overlays que cubran toda la pantalla sin contenido visible

### 4. Hacer una restauración mínima si sigue roto
Si después de corregir el crash principal la app sigue sin renderizar, haré rollback a la última versión estable desde el historial y luego reaplicaré solo los cambios seguros:
- botón del logo para volver al inicio
- loader atractivo
- mejoras visuales que no rompan el montaje

Importante: si hay que volver atrás, la forma correcta es restaurar una versión estable del historial, no “deshacer” archivos manualmente uno por uno.

## Validación después del fix

Voy a verificar estos puntos:
1. La landing carga correctamente
2. El formulario se ve en web y móvil
3. El logo regresa al inicio
4. El loader aparece al generar playlist
5. La pantalla de resultados renderiza sin blanco
6. La ruta `/` y `/index` funcionan

## Detalle técnico

Archivos más probables a tocar:
- `src/components/ui/sonner.tsx`
- `src/App.tsx`
- `src/pages/Index.tsx`
- `src/components/SettingsDialog.tsx`
- `src/components/fryda/PlaylistLoader.tsx`
- `src/components/PlaylistResult.tsx`

Causa principal más probable:
```text
useTheme() sin ThemeProvider
=> error de contexto / fallo de montaje
=> página en blanco
```

Plan de contingencia:
```text
1. Fix puntual del crash
2. Probar render base
3. Si aún falla: restaurar última versión estable
4. Reaplicar mejoras en pasos pequeños
```
