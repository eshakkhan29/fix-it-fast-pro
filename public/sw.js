const CACHE_NAME = 'fix-it-fast-v1';
const STATIC_CACHE = 'fix-it-fast-static-v1';
const DYNAMIC_CACHE = 'fix-it-fast-dynamic-v1';

// Enable service worker on all hosts including localhost
  const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/favicon.ico',
    '/logo/logo.png',
    '/icon-192.svg',
    '/icon-512.svg',
  ];

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
    );
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter((key) => ![CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE].includes(key))
            .map((key) => caches.delete(key))
        );
        await self.clients.claim();
      })()
    );
  });

  function shouldCache(request) {
    try {
      const url = new URL(request.url);
      if (url.origin !== self.location.origin) return false;
      if (url.pathname.startsWith('/api/')) return true; // dynamic API cache (network-first)
      if (url.pathname.startsWith('/_next/')) return true; // static assets
      if (url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('.svg') || url.pathname.endsWith('.ico')) return true;
      return true; // pages and other GETs
    } catch {
      return false;
    }
  }

  async function cacheFirst(request) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(request);
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
      return response;
    } catch (_err) {
      return cached || Response.error();
    }
  }

  async function networkFirst(request) {
    try {
      const response = await fetch(request);
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
      return response;
    } catch (_err) {
      const cached = await caches.match(request, { ignoreSearch: true });
      if (cached) return cached;
      return Response.error();
    }
  }

  self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET' || !shouldCache(request)) return;

    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(networkFirst(request));
      return;
    }

    if (url.pathname.startsWith('/_next/') || url.pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js)$/)) {
      event.respondWith(cacheFirst(request));
      return;
    }

    // pages and other
    event.respondWith(cacheFirst(request));
  });

  // Optional: push notifications placeholder
  self.addEventListener('push', (event) => {
    if (!event.data) return;
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title || 'Notification', {
        body: data.body,
        icon: '/logo/logo.png',
        data: data.url ? { url: data.url } : undefined,
      })
    );
  });

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification?.data?.url;
    if (!url) return;
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
        const hadWindow = clientsArr.some((client) => {
          if (client.url === url) {
            client.focus();
            return true;
          }
          return false;
        });
        if (!hadWindow && self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
    );
  });
