// SHADEN — Minimal service worker (v14)
// Required by Chrome/Edge/Android for the native "beforeinstallprompt" popup to
// become eligible, on top of a valid manifest + HTTPS. Upload this file to the
// SAME root folder as index.html on Firebase Hosting (i.e. alongside your app),
// so it is reachable at "/sw.js".
//
// It does the bare minimum: it activates immediately and passes all requests
// straight through to the network. It does NOT cache anything, so it will
// never serve stale content — safe to drop in without changing app behaviour.

const CACHE_NAME = 'shaden-shell-v14';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first passthrough (no offline caching) — keeps installability
// criteria satisfied without risking any stale-data bugs.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
