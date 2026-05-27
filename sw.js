const CACHE_NAME = "barbaros-menu-v7";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./src/css/propuesta-v4.css",
  "./src/js/propuesta-v4.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/brand/logo-horizontal-naranja.jpg",
  "./assets/brand/logo-horizontal-naranja-alt.jpg",
  "./assets/brand/logo-vertical-fondo-naranja.jpg",
  "./assets/brand/poster-vikingo-qr.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isDocument = event.request.mode === "navigate";
  const isApi = requestUrl.origin === self.location.origin && requestUrl.pathname.startsWith("/api/");
  const isAppShellAsset =
    requestUrl.origin === self.location.origin &&
    (
      requestUrl.pathname === "/" ||
      requestUrl.pathname === "/index.html" ||
      requestUrl.pathname === "/admin.html" ||
      requestUrl.pathname === "/manifest.webmanifest" ||
      requestUrl.pathname.startsWith("/src/")
    );

  if (isApi) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (isAppShellAsset) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  if (isDocument) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(event.request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        });
      })
    );
  }
});
