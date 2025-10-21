// Minimal no-cache Service Worker for installability without caching

self.addEventListener('install', (event) => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clear any existing caches from previous versions
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch {}
      // Take control of all clients
      await self.clients.claim();
    })()
  );
});

// Network-only, explicitly no-store for GET requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    (async () => {
      try {
        return await fetch(request, { cache: 'no-store' });
      } catch {
        // Fallback to normal fetch if needed
        return fetch(request);
      }
    })()
  );
});
