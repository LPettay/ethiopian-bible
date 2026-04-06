// Service Worker for Ethiopian Bible — offline support
// Cache-first for data files, network-first for app shell with cache fallback

const CACHE_VERSION = 'ethiopian-bible-v1'
const APP_SHELL_CACHE = CACHE_VERSION + '-shell'
const DATA_CACHE = CACHE_VERSION + '-data'

// App shell resources cached on install
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/favicon.svg',
]

// --- Install: cache the app shell ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL_URLS)
    })
  )
  // Activate immediately without waiting for open tabs to close
  self.skipWaiting()
})

// --- Activate: clean up old caches ---
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== APP_SHELL_CACHE && key !== DATA_CACHE)
          .map((key) => caches.delete(key))
      )
    })
  )
  // Take control of all open clients immediately
  self.clients.claim()
})

// --- Fetch: strategy depends on request type ---
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return

  // Data files: books.json, chapter JSONs — cache-first
  if (isDataRequest(url)) {
    event.respondWith(cacheFirstWithRefresh(event.request, DATA_CACHE))
    return
  }

  // App shell (HTML, JS, CSS, SVG) — network-first with cache fallback
  if (isAppShellRequest(url)) {
    event.respondWith(networkFirstWithCache(event.request, APP_SHELL_CACHE))
    return
  }
})

/**
 * Determine if a URL is a data request (JSON files in /data/).
 */
function isDataRequest(url) {
  return url.pathname.startsWith('/data/') && url.pathname.endsWith('.json')
}

/**
 * Determine if a URL is an app shell request.
 */
function isAppShellRequest(url) {
  const path = url.pathname
  return (
    path === '/' ||
    path === '/index.html' ||
    path.endsWith('.js') ||
    path.endsWith('.css') ||
    path.endsWith('.svg') ||
    path.endsWith('.woff2') ||
    path.endsWith('.woff') ||
    // SPA navigation — serve index.html for HTML requests
    (url.pathname.startsWith('/read/') ||
     url.pathname.startsWith('/compare') ||
     url.pathname.startsWith('/bookmarks'))
  )
}

/**
 * Cache-first strategy: serve from cache, update in background.
 */
async function cacheFirstWithRefresh(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  // Refresh cache in background (stale-while-revalidate)
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => null)

  // Return cached response immediately, or wait for network
  if (cached) {
    // Fire-and-forget the background refresh
    fetchPromise.catch(() => {})
    return cached
  }

  // No cache hit — wait for network
  const networkResponse = await fetchPromise
  if (networkResponse) return networkResponse

  // Both failed
  return new Response('Offline — data not available', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' },
  })
}

/**
 * Network-first strategy: try network, fall back to cache.
 * For SPA routes, fall back to cached index.html.
 */
async function networkFirstWithCache(request, cacheName) {
  const cache = await caches.open(cacheName)

  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch {
    // Network failed — try cache
    const cached = await cache.match(request)
    if (cached) return cached

    // For navigation requests (SPA routes), serve cached index.html
    if (request.mode === 'navigate') {
      const indexCached = await cache.match('/index.html')
      if (indexCached) return indexCached
    }

    return new Response('Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}
