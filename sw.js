const CACHE_NAME = 'dv-writing-assistant-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './language-tool.js',
  './citation.js',
  './paraphrase.js',
  './rewrite.js',
  './summarize.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  // Each file is cached on its own, so one missing file can never break the install.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(ASSETS_TO_CACHE.map((asset) => cache.add(asset)));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Offline-first strategy for local assets, network-first with graceful failure for APIs
  if (event.request.url.includes('api.languagetool.org') || 
      event.request.url.includes('crossref.org') || 
      event.request.url.includes('openlibrary.org') ||
      event.request.url.includes('huggingface.co')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'You are currently offline. Live cloud AI services are unavailable.' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
  } else if (new URL(event.request.url).origin !== location.origin) {
    return; // Other APIs (plugins): let the browser handle them directly.
  } else {
    // Plugins are cached the first time they load, so they never need to be listed here.
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((response) => {
          if (event.request.method === 'GET' && response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        });
      })
    );
  }
});
