const CACHE_VERSION = "cfo-drill-v1";
const BASE = new URL("./", self.location.href);
const CORE_FILES = [
  "",
  "index.html",
  "offline.html",
  "icon.svg",
  "pwa-192x192.png",
  "pwa-512x512.png",
  "manifest.webmanifest",
];

const toUrl = (path) => new URL(path, BASE).href;

const discoverAssets = async () => {
  const response = await fetch(toUrl("index.html"), { cache: "no-cache" });
  if (!response.ok) throw new Error("index fetch failed");
  const html = await response.clone().text();
  const matches = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
  const assets = matches
    .map((path) => new URL(path, BASE))
    .filter((url) => url.origin === self.location.origin && !url.hash)
    .map((url) => url.href);
  return [response, [...new Set([...CORE_FILES.map(toUrl), ...assets])]];
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      try {
        const [indexResponse, urls] = await discoverAssets();
        await cache.put(toUrl("index.html"), indexResponse);
        await Promise.all(
          urls
            .filter((url) => url !== toUrl("index.html"))
            .map(async (url) => {
              const response = await fetch(url, { cache: "no-cache" });
              if (response.ok) await cache.put(url, response);
            }),
        );
      } catch {
        await cache.addAll(CORE_FILES.map(toUrl));
      }
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          void caches.open(CACHE_VERSION).then((cache) => cache.put(toUrl("index.html"), copy));
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_VERSION);
          return (await cache.match(toUrl("index.html"))) ?? (await cache.match(toUrl("offline.html")));
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ??
        fetch(event.request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            void caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
          }
          return response;
        }),
    ),
  );
});
