const CACHE_NAME = 'orbit-v2';
const APP_FILES = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './icon.ico', './icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});