# Auditoría de Notificaciones Push

## Resumen

Esta auditoría revisa la implementación de notificaciones push que se agregó recientemente en el proyecto.

Se verificaron los puntos solicitados contra el código actual sin hacer cambios.

---

## 1. Obtención de usuarios en `/api/notifications/send`

- El endpoint `app/api/notifications/send/route.ts` usa `createServiceRoleSupabaseClient()` y llama a:
  - `supabaseService.auth.admin.listUsers({ limit: 500 })`
- Esto confirma que intenta usar la Supabase Admin API.

## 2. Mecanismo exacto utilizado

- Usa Supabase Auth Admin API a través de `supabase-js`.
- El cliente administrativo se crea con `createClient(supabaseUrl, supabaseServiceRoleKey, ...)` en `lib/supabase-server.ts`.
- El endpoint recurre a `auth.admin.listUsers()` para listar usuarios.

## 3. ¿Puede obtener todos los usuarios? ¿Por qué sí/no?

- No, no puede garantizar obtener todos los usuarios si hay más de 500.
- Razón: la llamada fija `limit: 500` y no implementa paginación / `nextPage`.
- Si la base de usuarios excede 500, usuarios adicionales serán ignorados.

## 4. Flujo de guardado de suscripción desde `NotificationPreferences.tsx`

Flujo completo:

1. En `components/NotificationPreferences.tsx` el usuario pulsa `enableNotifications()`.
2. Se registra el service worker con `navigator.serviceWorker.register('/sw.js')`.
3. Pide permiso con `Notification.requestPermission()` si es `default`.
4. Recupera la clave pública VAPID desde `/api/notifications/vapid`.
5. Llama a `registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })`.
6. Llama a `saveSubscription(subscription)`.
7. `saveSubscription` hace POST a `/api/notifications/subscribe` con `{ subscription }`.
8. El endpoint `/api/notifications/subscribe` llama a Supabase con `supabase.auth.updateUser({ data: { pushSubscription: subscription } })`.

Esto describe correctamente el flujo completo.

## 5. Persistencia en `user_metadata.pushSubscription`

- En `app/api/notifications/subscribe/route.ts`, el endpoint usa:
  - `supabase.auth.updateUser({ data: { pushSubscription: subscription } })`
- En Supabase Auth, `updateUser({ data })` actualiza `user_metadata`.
- Por lo tanto, el código intenta guardar la suscripción en `user_metadata.pushSubscription`.

## 6. Recuperación posterior para enviar notificaciones

- En `app/api/notifications/test/route.ts` y `app/api/notifications/send/route.ts`, el código lee:
  - `user.user_metadata?.pushSubscription`
- Luego usa `parseSubscription()` para interpretar el valor.
- Esto indica que el código sí está diseñado para recuperar la suscripción guardada.

## 7. Existencia de la lógica de detección de racha incompleta

- Sí existe.
- `app/api/notifications/send/route.ts` llama a `getStreakInfo(user.id, todayKey)`.
- `getStreakInfo()` consulta la tabla `StreakDay` y calcula si `todayFulfilled` existe.

## 8. Consulta exacta realizada

La consulta es esta:

```ts
const rows = await prisma.$queryRaw<Array<{ date: Date }>>`
  SELECT date
  FROM "StreakDay"
  WHERE "userId" = ${userId}
  ORDER BY date ASC
`;
```

## 9. Tablas utilizadas

- `StreakDay`
- No se usa ninguna otra tabla en la detección de racha.

## 10. Cómo determina que la racha del día está incompleta

- Calcula `todayKey` con la fecha UTC actual.
- Marca `todayFulfilled = dateKeys.includes(referenceDate)`.
- En `send` el reminder se envía si `streakInfo.todayFulfilled` es `false`.
- Es decir: la racha se considera incompleta si no existe un registro `StreakDay` para la fecha de hoy.

## 11. Si la lógica es incompleta

- La implementación existe y es consistente con la verificación de "hoy no está registrado".
- Sin embargo, no verifica otros criterios de racha más complejos; sólo evalúa la presencia del registro de hoy.
- Si la definición de "racha cumplida" incluye condiciones adicionales, entonces la lógica es simplista.

## 12. Compatibilidad con múltiples dispositivos

- No es compatible con múltiples dispositivos por usuario.
- El campo `pushSubscription` en `user_metadata` es único.
- Una nueva suscripción sobrescribe la anterior.

## 13. ¿Puede un usuario recibir notificaciones en múltiples dispositivos?

- No con el diseño actual.
- El modelo actual guarda un solo objeto `pushSubscription` por usuario, no un arreglo.
- Esto significa que sólo el último dispositivo registrado recibirá notificaciones.

## 14. Zona horaria usada

- Se usa UTC.
- `formatDate(date: Date)` hace `date.toISOString().slice(0, 10)`.
- El endpoint `send` toma `new Date()` y lo formatea en UTC.

## 15. ¿Llegará a las 22:00 de Argentina?

- No se puede garantizar.
- El código se basa en la hora del servidor (`new Date()` en Vercel, que es UTC) y no usa zona horaria de Argentina.
- Si el cron se programa en horario local, la comparación interna podría usar una fecha distinta a la esperada.

## 16. Problemas relacionados con timezone

- Sí hay un problema potencial de timezone.
- Se usa UTC en lugar de hora local de Argentina.
- Si el scheduler ejecuta a las 22:00 AR pero Vercel lo interpreta en UTC, `todayKey` puede corresponder al día siguiente UTC.
- Además, `StreakDay.date` se compara en UTC, por lo que la fecha local del usuario no se considera.

## 17. Integración con Vercel Cron

- El informe actual documenta un ejemplo en `vercel.json`.
- No hay código en el repo que implemente la integración real de Vercel Cron.
- La implementación del endpoint es compatible con cron si el cron puede llamar `POST /api/notifications/send`.

## 18. Compatibilidad de headers personalizados con Vercel Cron

- En el código actual no hay manera de verificarlo desde el repo.
- El ejemplo documentado usa `headers` dentro de `vercel.json`.
- Ese formato no es estándar conocido de Vercel Cron y probablemente no sea válido.
- Por lo tanto, la compatibilidad con `x-notifications-secret` en `vercel.json` es dudosa.

## 19. Alternativa correcta si no es compatible

- Usar un secreto en la URL de cron, por ejemplo: `/api/notifications/send?secret=...`.
- O usar un servicio de cron externo que permita enviar un header secreto.
- La ruta actual ya acepta el header `x-notifications-secret`, pero no debe depender de un formato de `vercel.json` no garantizado.

## 20. Registro real del Service Worker

- `components/ServiceWorkerRegister.tsx` registra el service worker con:
  - `navigator.serviceWorker.register('/sw.js')`
- Es un registro real y no un borrado.

## 21. Montaje desde el layout principal

- `app/RootLayoutClient.tsx` importa `ServiceWorkerRegister` y lo monta dentro de `ThemeProvider`.
- Esto confirma que el SW se intenta registrar desde el layout principal.

## 22. `sw.js` recibe push y muestra notificaciones

- `public/sw.js` contiene:
  - `self.addEventListener('push', ...)`
  - `self.registration.showNotification(title, options)`
- También maneja `notificationclick`.
- Por tanto, el service worker sí puede procesar eventos push y mostrarlos.

## 23. Seguridad: registro de suscripción ajena

- `/api/notifications/subscribe` usa `createServerSupabaseClient()` y `supabase.auth.getUser()`.
- Si no hay usuario autenticado, devuelve `401 Unauthorized`.
- No hay forma directa de que un usuario no autenticado escriba la suscripción de otro usuario.

## 24. Protección del endpoint de envío masivo

- `/api/notifications/send` sólo bloquea si existe `NOTIFICATIONS_SECRET`.
- Si `NOTIFICATIONS_SECRET` no está definido, el endpoint queda abierto.
- Esto es un riesgo de seguridad.

## 25. Riesgos potenciales y abusos

- Si `NOTIFICATIONS_SECRET` no está configurado, cualquiera puede llamar a `/api/notifications/send`.
- `listUsers({ limit: 500 })` sin paginación puede ignorar usuarios y no es escalable.
- No hay validación fuerte de schema para `subscription` en `/api/notifications/subscribe`.
- Un objeto de suscripción inválido puede ser almacenado.
- El endpoint de envío realiza una consulta por usuario, lo que puede ser lento y costoso.

## 26. Errores de compilación y ejecución

- Se revisaron los archivos clave con `get_errors`.
- No se encontraron errores de importación, tipos o compilación en los archivos nuevos/modificados.

## 27. Imports rotos / Variables inexistentes

- No se detectaron imports rotos en los archivos auditados.
- No se detectaron variables inexistentes en los archivos nuevos.

## 28. Código muerto

- No hay evidencia clara de código muerto en los archivos auditados.
- El único potencial es la sucursal `if (notificationSecret && providedSecret !== notificationSecret)` que deja el endpoint abierto si no hay secreto.

## 29. Problemas de tipos

- No se identificaron problemas de tipos en los archivos auditados.
- `get_errors` no reportó fallas.

## 30. Problemas de ejecución en Vercel

- El código no muestra incompatibilidades obvias con Vercel.
- El mayor riesgo es la configuración de cron y el uso de Vercel Cron con headers personalizados.
- También hay riesgo de timeout si el endpoint `send` itera muchos usuarios y hace un query por cada usuario.

---

## Conclusiones por categoría

### Lo que está correcto

- Uso de Supabase Admin API para listar usuarios.
- Registro real del service worker desde `RootLayoutClient.tsx`.
- `sw.js` maneja `push` y `notificationclick`.
- El flujo de guardado de la suscripción va desde el navegador a `/api/notifications/subscribe`.
- La suscripción se recupera de `user.user_metadata.pushSubscription`.
- Existe la lógica de detección de racha basada en la tabla `StreakDay`.

### Lo que es dudoso

- El ejemplo de `vercel.json` con headers personalizados probablemente no es válido.
- La protección del endpoint masivo depende de `NOTIFICATIONS_SECRET` estando configurado.
- La lógica horaria usa UTC y puede no coincidir con 22:00 Argentina.

### Lo que está roto o incompleto

- `listUsers({ limit: 500 })` no obtiene todos los usuarios si hay más de 500.
- La implementación no soporta múltiples dispositivos por usuario; sobrescribe la suscripción anterior.
- El endpoint de envío no está protegido cuando `NOTIFICATIONS_SECRET` está ausente.
- La lógica de fecha usa UTC y no garantiza 22:00 hora de Argentina.

### Riesgos potenciales

- Abuso de `/api/notifications/send` si el secreto no está configurado.
- Envío incompleto de recordatorios en bases de usuarios >500.
- Pérdida de notificaciones en múltiples dispositivos.
- Posible mismatch de fecha al ejecutar cron en otra zona horaria.
- Carga alta / timeout en `send` por una consulta por usuario.

### Cambios recomendados

1. Implementar paginación completa para `listUsers`.
2. Guardar múltiples suscripciones por usuario en lugar de una sola.
3. Asegurar siempre `NOTIFICATIONS_SECRET` o usar otro mecanismo de protección.
4. No depender de headers de `vercel.json`; usar un secreto en URL o un scheduler externo.
5. Ajustar la lógica de fecha para zona horaria de Argentina si se quiere 22:00 local.
6. Mejorar validación del objeto `subscription` en `/api/notifications/subscribe`.
7. Optimizar `send` para evitar query por cada usuario.

### Nivel de confianza

- Alta confianza en las cuestiones de código identificadas: 1-6, 12-14, 20-22, 23-24, 26-29.
- Moderada confianza en la interpretación de Vercel Cron y headers personalizados: 17-19.
- Moderada a alta confianza en el riesgo de timezone para 22:00 Argentina: 14-16.

---

## Correcciones aplicadas

Estas correcciones se aplicaron en el código actual:

- La ruta `/api/notifications/send` ahora falla si `NOTIFICATIONS_SECRET` no está configurado.
- El endpoint devuelve un error explícito `500` cuando falta la configuración de `NOTIFICATIONS_SECRET`.
- El endpoint devuelve un error `401` cuando el secreto proporcionado es inválido o está ausente.
- El cálculo del día actual para el envío de notificaciones usa la zona horaria de Argentina (`America/Argentina/Buenos_Aires`).
- La lógica de evaluación de la racha usa el día local de Argentina para determinar si el usuario ya marcó el día.
- Se agregó soporte adicional para recibir el secreto mediante query param `secret` cuando no pueda enviarse en headers.
- La documentación de cron se actualizó para reflejar que Vercel Cron usa UTC y no puede configurar headers personalizados en `vercel.json`.

## Deuda técnica futura

Quedan abiertas las siguientes mejoras que no se resolvieron en esta entrega:

- paginación de usuarios de Supabase (`listUsers` sigue usando `limit: 500`);
- soporte para múltiples dispositivos por usuario (`user_metadata.pushSubscription` sigue siendo único);
- validación más estricta del objeto de suscripción antes de guardarlo;
- optimización del envío para evitar consultas individuales por usuario.

Estas decisiones se dejaron sin resolver porque no forman parte del alcance de la corrección actual y cambiarían la arquitectura general de la implementación de notificaciones.

## Recomendación inmediata

Antes de desplegar esta función como notificación diaria:

- asegurar que `NOTIFICATIONS_SECRET` esté definido,
- comprobar la paginación de usuarios si hay más de 500 usuarios,
- revisar la forma en que Vercel Cron envía credenciales/headers,
- y considerar guardar una lista de `pushSubscription` en lugar de un único objeto.
