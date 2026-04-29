/**
 * Service worker — minimal offline cache.
 *
 * Strategy:
 *   - On install: cache the home shell (/, /work, /about) so the
 *     site is browsable offline after the first visit.
 *   - On fetch:
 *       · Navigate requests (HTML pages): network-first, fall back
 *         to cache. Keeps content fresh online; offline still works.
 *       · Static assets (JS, CSS, fonts, images): cache-first.
 *         Cuts load time + works offline.
 *
 * No background sync, push notifications, or SW-specific tricks —
 * this is a portfolio, not a chat app. Keeping the SW minimal avoids
 * the classic "old version stuck in cache" debugging hell.
 *
 * Cache name includes a version. Bumping it invalidates everything,
 * which is the cleanest way to push a new release to returning users.
 */

const CACHE_VERSION = "v1";
const CACHE_NAME = `ali-flagship-${CACHE_VERSION}`;

// Pages we want available offline after first visit. These get
// pre-cached on install so even a cold offline open works.
const PRECACHE_URLS = ["/", "/work", "/about"];

/* ── install: pre-cache the app shell ────────────────────────── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  // Activate this SW immediately on install — replaces the old one
  // without forcing the user to close every tab first.
  self.skipWaiting();
});

/* ── activate: clear old cache versions ──────────────────────── */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("ali-flagship-") && k !== CACHE_NAME)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* ── fetch: network-first for pages, cache-first for assets ─── */
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GETs.
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip cross-origin and Next.js dev/HMR endpoints (they don't
  // benefit from caching and break HMR if intercepted).
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/_next/webpack-hmr") ||
    url.pathname.startsWith("/__next") ||
    url.pathname.startsWith("/api")
  ) {
    return;
  }

  // Navigation requests (HTML pages): network-first.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cacheCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  // Static assets: cache-first.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Only cache successful, basic-type responses.
        if (
          !response ||
          response.status !== 200 ||
          response.type !== "basic"
        ) {
          return response;
        }
        const cacheCopy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
        return response;
      });
    })
  );
});
