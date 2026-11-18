'use strict';

const NOMBRE_CACHE = 'pwa-camara-instalable-v2';
const ARCHIVOS_PRECACHEADOS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(NOMBRE_CACHE)
      .then((cache) => cache.addAll(ARCHIVOS_PRECACHEADOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(
        claves
          .filter((clave) => clave !== NOMBRE_CACHE)
          .map((clave) => caches.delete(clave))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((respuestaCacheada) => {
        if (respuestaCacheada) {
          return respuestaCacheada;
        }

        return fetch(event.request)
          .then((respuestaRed) => {
            if (respuestaRed && respuestaRed.status === 200) {
              caches.open(NOMBRE_CACHE).then((cache) => {
                cache.put(event.request, respuestaRed.clone());
              });
            }
            return respuestaRed;
          })
          .catch(() => caches.match('./index.html'));
      })
  );
});
