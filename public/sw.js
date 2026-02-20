// Minimal service worker for PWA installability

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through for now, just needed for "installable" criteria
  event.respondWith(fetch(event.request));
});
