const CACHE_NAME = 'goalyx-app-cache-v1';
const ASSETS = ['/', '/site.webmanifest', '/robots.txt'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
        return Promise.resolve();
      }))
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request))
  );
});

self.addEventListener('push', (event) => {
  const payload = event.data?.json() || {};
  const title = payload.title || 'Goalyx';
  const body = payload.body || 'Tu racha aún no está completa. ¡No te olvides de marcar hoy!';
  const options = {
    body,
    icon: '/icons/android-chrome-192x192.png',
    badge: '/icons/android-chrome-192x192.png',
    data: payload.data || {},
    vibrate: [200, 100, 200],
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const url = '/';
      const openClient = clientList.find((client) => client.url.includes(url) && 'focus' in client);
      if (openClient) {
        return openClient.focus();
      }
      return clients.openWindow(url);
    })
  );
});
