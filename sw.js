/* BARBER PRO DZ — Service Worker */
const CACHE = 'barberprodz-v1';
const FICHIERS_ESSENTIELS = [
  './',
  './index.html',
  './admin.html',
  './css/style.css',
  './css/admin.css',
  './js/db.js',
  './js/app.js',
  './js/admin.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(FICHIERS_ESSENTIELS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((noms) => Promise.all(noms.filter(n => n !== CACHE).map(n => caches.delete(n))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((reponse) => {
      return reponse || fetch(event.request).then((reseau) => {
        // Ne met en cache que les requêtes vers notre propre origine
        if (event.request.url.startsWith(self.location.origin)) {
          const clone = reseau.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        }
        return reseau;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
