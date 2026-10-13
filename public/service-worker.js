const CACHE = "v44-revert-to-first-dangnam2k4-1791445125909-chat-mobile-20261009071323-chat-mobile-20261009072136-chat-mobile-20261009072521-chat-mobile-20261009072814-chat-mobile-20261009072832-chat-mobile-20261009073602-chat-mobile-20261009073648-chat-mobile-20261009073910-chat-mobile-20261009074028-chat-mobile-20261009074046-chat-mobile-20261009074115-chat-mobile-20261009074227-chat-mobile-20261009074319-chat-mobile-20261009080012-chat-mobile-20261009080226-chat-mobile-20261009081401-chat-mobile-20261009082050-chat-mobile-20261009082501-chat-mobile-20261009082736-chat-mobile-20261009083033-chat-mobile-20261009083146-chat-mobile-20261009083257-chat-mobile-20261009083703-chat-mobile-20261009083731-chat-mobile-20261009083939-chat-mobile-20261009084331-chat-mobile-20261009084745-chat-mobile-20261009084928-chat-mobile-20261009085628-chat-mobile-20261009085936-chat-mobile-20261009090306-chat-mobile-20261009090934-chat-mobile-20261009092445";
const APP_SHELL = [
  "./",
  "./index.html",
  "./mobile.html",
  "./style.css",
  "./app.js",
  "./knowledge.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/hero-left.png",
  "./assets/hero-right.jpg",

  "./mobile-style.css",
  "./mobile-app.compiled.js",
  "./assets/chat-bg-moon-small-final.png",
];

// SYNAM_SW_SKIP_WAITING: allow the active page to promote an installed update.
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

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
