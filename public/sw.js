// Minimal, hand-written service worker for Styloé.
//
// Scope is intentionally narrow: it only cache-first serves same-origin
// static assets (Next.js build chunks, icons, fonts, images). It never
// intercepts HTML documents, API routes, or Supabase requests, so auth
// state and data are always fetched fresh — this SW exists purely to
// make the app installable and speed up repeat static-asset loads, not
// to change any app behavior.

const CACHE_NAME = "styloe-static-v1";

const STATIC_CACHE_PATTERNS = [
  /\/_next\/static\//,
  /\/icons\//,
  /\/manifest\.json$/,
  /\.(?:png|jpg|jpeg|svg|webp|ico|woff2?)$/,
];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isStaticAsset = STATIC_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname));
  if (!isStaticAsset) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    }),
  );
});
