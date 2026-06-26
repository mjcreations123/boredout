const CACHE = 'boredout-v3';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './icons/icon.svg'];

self.addEventListener('install', e => {
  // Pre-cache, but DON'T skipWaiting: let the new worker stay 'waiting' so it never
  // takes over (and force-reloads) an open session mid-use. It activates on next load.
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  if (url.origin !== location.origin) {
    // Runtime cache-first for the Tabler icon font (CDN) so icons render offline.
    if (url.hostname.indexOf('jsdelivr.net') !== -1) {
      e.respondWith(
        caches.open(CACHE).then(c => c.match(e.request).then(cached => {
          const fresh = fetch(e.request).then(res => {
            if (res && (res.ok || res.type === 'opaque')) c.put(e.request, res.clone());
            return res;
          }).catch(() => cached);
          return cached || fresh;
        }))
      );
    }
    return;
  }

  // Network-first for HTML / navigations so fresh deploys show up immediately.
  const isHTML = e.request.mode === 'navigate' ||
    (e.request.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res && res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(e.request).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  // Cache-first with background refresh for static assets.
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        if (res && res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
