// public/service-worker.js
const VERSION = 'swr-8d45f4d';                         // ← bump this when you want to bust SW cache
const CACHE_NAME = `imgs-${VERSION}`;
const IMG_RE = /\.(?:png|webp|jpg|jpeg|svg|gif|avif)$/i;

// Limit SW caching to these folders under your own origin
const allowedPath = (pathname) =>
  /^\/blogs\//.test(pathname) ||
  /^\/logos\//.test(pathname) ||
  /^\/tech\//.test(pathname);                  // remove this line if you don't use /tech

self.addEventListener('install', (event) => {
  // Activate immediately after install
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clean up old caches when VERSION changes
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => k.startsWith('imgs-') && k !== CACHE_NAME)
        .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = self.location.origin === url.origin;

  // Only same-origin images under allowed folders
  if (!(isSameOrigin && IMG_RE.test(url.pathname) && allowedPath(url.pathname))) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // 1) Serve from cache if present
    const cached = await cache.match(request);
    if (cached) return cached;

    // 2) Else fetch once and store
    try {
      const resp = await fetch(request);
      // Cache only successful responses
      if (resp && resp.ok) {
        // clone before caching so body can be read twice
        cache.put(request, resp.clone());
      }
      return resp;
    } catch (err) {
      // Network failed and no cache—let it error out (or return a fallback if you have one)
      throw err;
    }
  })());
});