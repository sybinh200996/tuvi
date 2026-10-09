const CACHE = "synam-nam46-assistant-v4-ui-restored";
const APP_SHELL = [
  "./",
  "./index.html",
  "./mobile.html",
  "./style.css",
  "./mobile-style.css",
  "./app.js",
  "./mobile-app.js",
  "./mobile-app.compiled.js",
  "./knowledge.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/hero-left.png",
  "./assets/hero-right.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // HTML/JS/CSS phải ưu tiên mạng để bản nâng cấp không bị kẹt trong cache cũ.
  const isAppCode = /\.(?:html|js|css|json|webmanifest)$/.test(url.pathname) || url.pathname === "/";
  event.respondWith(
    isAppCode
      ? fetch(request, { cache: "no-store" })
          .then(response => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then(cache => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => caches.match(request).then(cached => cached || caches.match("./index.html")))
      : caches.match(request).then(cached => cached || fetch(request).then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
          }
          return response;
        }))
  );
});
