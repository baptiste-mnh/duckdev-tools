const CACHE_NAME = "duckdev-tools-v1";
const STATIC_CACHE = "static-v1";
const DYNAMIC_CACHE = "dynamic-v1";

const urlsToCache = [
  "/duckdev-tools/",
  "/duckdev-tools/index.html",
  "/duckdev-tools/manifest.json",
  "/duckdev-tools/icons/logo_64x64.png",
  "/duckdev-tools/icons/logo_192x192.png",
  "/duckdev-tools/icons/logo_512x512.png",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("Opened static cache");
      return cache.addAll(urlsToCache);
    })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Fetch event - serve from cache if available
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match("/duckdev-tools/index.html");
      })
    );
    return;
  }

  // Handle static assets
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image"
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Default strategy: network first, fallback to cache
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});
