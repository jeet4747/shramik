const CACHE_NAME = 'shramik-v4'
const STATIC_EXTENSIONS = /\.(js|css|html|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|json)$/
const API_DOMAINS = ['supabase.co', 'supabase.in']

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  return self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Skip API calls — never cache Supabase or external API requests
  if (API_DOMAINS.some(d => url.hostname.includes(d))) {
    return
  }

  // Only cache static assets
  if (!STATIC_EXTENSIONS.test(url.pathname)) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request).then((response) => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        return response
      }).catch(() => caches.match(event.request))
    })
  )
})
