// Replacement service worker: unregisters itself and clears old caches.
// Browsers that still check /service-worker.js will pick this up and stop intercepting requests.

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: 'window' })
      clients.forEach((client) => {
        if ('navigate' in client) {
          client.navigate(client.url)
        }
      })
    })(),
  )
})

self.addEventListener('fetch', () => {
  // Do not intercept — let requests go to the network.
})
