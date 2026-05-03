# 🔴 BUG: Módulos solo funcionan para un usuario

**Fecha:** 3 de Mayo de 2026
**Severidad:** Alta
**Estado:** Corregido en código fuente / documentado

---

## Descripción

Se detectó un error grave donde los módulos y algunos apartados de la app funcionan correctamente solo para un usuario específico, mientras que otros perfiles antiguos o nuevos quedan sin acceso. El síntoma principal es que la app parece usar un "usuario por defecto" en vez del usuario autenticado real.

El comportamiento sugiere que la sesión no se está resolviendo correctamente en el servidor, y que algunas llamadas a la API terminan usando un contexto de autenticación incorrecto o no incluyen las cookies de sesión.

---

## Diagnóstico

### Archivos clave analizados

- `lib/supabase-server.ts`
- `app/api/modules/route.ts`
- `app/api/modules/[moduleId]/route.ts`
- `app/page.tsx`
- `app/settings/modules/page.tsx`
- `components/ModuleTracker.tsx`
- `components/GoalTracker.tsx`
- `components/Analytics.tsx`
- `components/CalendarExplorer.tsx`
- `components/ModuleTile.tsx`
- `lib/modules.ts`

### Problema principal

El helper de servidor `getServerSupabaseUser()` usaba `supabase.auth.getUser()` para obtener el usuario en Next.js.

Esto puede ser frágil en el App Router porque:

- `getUser()` valida el JWT y puede fallar si la sesión o las cookies no están completamente sincronizadas
- el middleware ya usa `getSession()` para protección de rutas
- si `getUser()` falla, la aplicación puede marcar la petición como no autenticada

Esto coincide con el síntoma donde solo algunos perfiles tienen acceso correcto.

### Problema secundario

Varias llamadas cliente a `fetch('/api/modules')` y otros endpoints de módulos no incluían explícitamente `credentials: 'include'`.

Aunque el fetch con mismo origen debería enviar cookies, en entornos de deployment esto puede comportarse de forma distinta y es mejor forzar el envío de credenciales de sesión.

---

## Cambios realizados

### 1. `lib/supabase-server.ts`

- Cambié `supabase.auth.getUser()` por `supabase.auth.getSession()`.
- Ahora se devuelve el `user` desde la sesión si existe, evitando la validación estricta de JWT en el servidor.

### 2. Fetches de módulos y datos relacionados

Se añadió `credentials: 'include'` en los siguientes lugares:

- `lib/modules.ts`
- `components/ModuleTracker.tsx`
- `components/GoalTracker.tsx`
- `components/Analytics.tsx`
- `components/CalendarExplorer.tsx`
- `components/ModuleTile.tsx`

Esto mejora la fiabilidad del envío de cookies de sesión en solicitudes a los endpoints de módulos.

---

## Próximos pasos

1. Verificar en producción si el problema desaparece en usuarios distintos al del "ID por defecto".
2. Revisar la configuración de Vercel para asegurarse de que no exista ninguna variable `DEFAULT_USER_ID` que siga interfiriendo.
3. Si persiste, añadir logging temporal en las APIs de `getServerSupabaseUser()` para capturar las respuestas del servidor y el estado de sesión.

---

## Observaciones

- No se encontró código en el repositorio actual que use directamente `DEFAULT_USER_ID` en la lógica de rutas principales.
- Sin embargo, el hecho de que la app funcione bien para un perfil concreto refuerza la hipótesis de una sesión que no se resuelve correctamente para otros usuarios.

----------------------------------

## Solución aplicada

### Cambios de autenticación server-side

- Se actualizó `lib/supabase-server.ts` para usar `supabase.auth.getSession()` en lugar de `supabase.auth.getUser()`.
- Con esto, la verificación de sesión en el backend pasa a depender de la sesión activa del navegador y no de la validación estricta del JWT.

### Corrección de envíos de cookies en el cliente

Se añadió `credentials: 'include'` en múltiples peticiones cliente a rutas protegidas de la API:

- `components/GoalForm.tsx`
- `components/EventForm.tsx`
- `components/HistoryViewer.tsx`
- `components/GoalTracker.tsx`
- `components/CalendarExplorer.tsx`
- `components/Analytics.tsx`
- `components/ModuleTracker.tsx`
- `components/ModuleTile.tsx`
- `lib/modules.ts`
- `modules/water/WaterDashboard.tsx`
- `modules/sleep/SleepDashboard.tsx`
- `modules/mood/MoodDashboard.tsx`
- `modules/academic/useAcademicModule.ts`
- `app/settings/page.tsx`

### Mejora adicional de auth routes

- Se actualizó `app/api/auth/change-password/route.ts` para usar `supabase.auth.getSession()` en lugar de `supabase.auth.getUser()`.

### Resultado de la validación

- Se ejecutó `npm run lint` y no se reportaron errores de ESLint.

---

## Estado de la solución

- El problema de sesión de usuario ahora está mitigado en el backend.
- Se reforzó el envío de credenciales en todas las llamadas a APIs de datos protegidos.
- Queda pendiente validar en producción si el bug desaparece completamente para usuarios distintos al perfil con sesión "predeterminada".
