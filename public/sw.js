const CACHE_NAME = 'shramik-v5'
const STATIC_EXTENSIONS = /\.(js|css|html|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|json)$/
const API_DOMAINS = ['supabase.co', 'supabase.in']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/', '/manifest.json', '/Shramik-Logo.png'])
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name)
        })
      )
    })
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return
  if (API_DOMAINS.some(d => url.hostname.includes(d))) return
  if (!STATIC_EXTENSIONS.test(url.pathname)) return

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
