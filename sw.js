/**
 * sw.js — Gnoke Attendance
 * Service worker for offline-first PWA support.
 *
 * HOW TO DEPLOY:
 * Bump CACHE_NAME version string on every deploy (v1 → v2 → v3…).
 * The activate event clears all old caches automatically.
 *
 * UPDATE FLOW (used by the About page "Update" button):
 * The page posts { type: 'SKIP_WAITING' } to trigger immediate activation
 * of a waiting service worker, then reloads. This is the standard force-refresh.
 */

const CACHE_NAME = 'gnoke-attendance-v1';   /* ← bump on every deploy */

const ASSETS = [
  /* Root splash */
  './',
  './index.html',
  './manifest.json',
  './global.png',

  /* Sub-app shells */
  './attendance1/',
  './attendance1/index.html',
  './attendance2/',
  './attendance2/index.html',
  './attendance3/',
  './attendance3/index.html',
  './attendance4/',
  './attendance4/index.html',
  './about/',
  './about/index.html',

  /* Shared JS */
  './hmenu.js',

  /* Google Fonts — cached on first fetch via network fallback below */
];

/* ── Install: cache core assets ── */
self.addEventListener('install', e => {
  /* Do NOT call skipWaiting() here.
     We want the new SW to WAIT until the About page triggers the update.
     This lets the user see the "Update available" badge before anything changes. */
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

/* ── Activate: clear old caches, then take control ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(k => k !== CACHE_NAME)
            .map(k => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())   /* take control of all open pages */
  );
});

/* ── Message: handle SKIP_WAITING from the About page update button ── */
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/* ── Fetch: cache-first, network fallback ── */
self.addEventListener('fetch', e => {
  /* Only handle GET requests */
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(response => {
        /* Cache successful responses for same-origin + fonts */
        if (
          response.ok &&
          (e.request.url.startsWith(self.location.origin) ||
           e.request.url.includes('fonts.googleapis.com') ||
           e.request.url.includes('fonts.gstatic.com'))
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    })
  );
});
