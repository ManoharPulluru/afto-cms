'use client'

import { useEffect } from 'react'

/**
 * Removes stale service workers left over from previous localhost:3000 apps.
 * Those workers cache old asset paths (e.g. app/layout.css) and break Next.js.
 */
export function UnregisterServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        void registration.unregister()
      })
    })

    // Clear SW-controlled caches from old apps
    if ('caches' in window) {
      void caches.keys().then((keys) => {
        keys.forEach((key) => {
          void caches.delete(key)
        })
      })
    }
  }, [])

  return null
}
