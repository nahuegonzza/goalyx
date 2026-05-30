# Implementación de Notificaciones Push para racha diaria

## Qué se ha implementado

1. Se agregó `web-push` como dependencia en `package.json`.
2. Se actualizó `components/ServiceWorkerRegister.tsx` para registrar el service worker en lugar de desinstalarlo.
3. Se mejoró `public/sw.js` para manejar eventos `push` y `notificationclick`.
4. Se creó `components/NotificationPreferences.tsx` para que el usuario pueda activar notificaciones y enviar una prueba.
5. Se integró el componente de notificaciones en `app/settings/page.tsx`.
6. Se implementaron endpoints API:
   - `GET /api/notifications/vapid` para obtener la clave pública VAPID.
   - `POST /api/notifications/subscribe` para guardar la suscripción del usuario.
   - `POST /api/notifications/test` para enviar una notificación de prueba al usuario conectado.
   - `POST /api/notifications/send` para enviar recordatorios a usuarios con racha incompleta.
7. Se creó la lógica de envío push en `lib/web-push.ts`.

## Cómo funciona la notificación de racha

- El service worker se registra desde el cliente para que la app sea capaz de recibir notificaciones push.
- El usuario puede activar la notificación desde la página de configuración.
- La suscripción se guarda en `user_metadata.pushSubscription` del usuario en Supabase Auth.
- El endpoint de envío (`/api/notifications/send`) verifica qué usuarios tienen la racha del día incompleta y envía los push correspondientes.

## Variables de entorno necesarias

- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` → clave pública VAPID que el cliente usará para suscribirse.
- `VAPID_PRIVATE_KEY` → clave privada VAPID usada por el servidor para firmar push.
- `VAPID_CONTACT_EMAIL` (opcional) → correo para `mailto:` en VAPID. Por defecto `mailto:no-reply@goalyx.app`.
- `NOTIFICATIONS_SECRET` (requerido en producción) → secreto HTTP para proteger el endpoint `/api/notifications/send`.

## Pasos pendientes fuera de código

1. Generar claves VAPID:
   - `npx web-push generate-vapid-keys`
   - Guardar la clave pública en `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - Guardar la clave privada en `VAPID_PRIVATE_KEY`
2. Configurar estas variables en Vercel para el despliegue.
3. Configurar un cron job en Vercel o un trigger externo para llamar a `POST /api/notifications/send` cerca de las 22:00.
   - El endpoint requiere que `NOTIFICATIONS_SECRET` esté configurado y válido.
   - Vercel Cron usa siempre UTC y no admite la configuración de headers personalizada dentro de `vercel.json`.
   - Si usas un scheduler externo que puede enviar headers, envía el secreto en `x-notifications-secret`.
   - Si usas un scheduler que sólo puede llamar a una URL, envía el secreto como query param `?secret=...`.
   - Ejemplo válido de `vercel.json` para Vercel Cron:
     ```json
     {
       "crons": [
         {
           "path": "/api/notifications/send",
           "schedule": "0 22 * * *"
         }
       ]
     }
     ```
4. Probar la suscripción de notificaciones desde la página de configuración y verificar la notificación de prueba.

## Nota importante

- Esta implementación usa la metadata de Supabase Auth para guardar la suscripción y evitar cambios de esquema de base de datos.
- Funciona mejor en Android/Chrome como PWA. En iOS web puede estar limitado o no soportar push web de manera consistente.
