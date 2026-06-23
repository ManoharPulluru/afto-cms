'use client'

import { useStore } from '@/providers/ThemeProvider'
import { getContrastTextColor } from '@/lib/theme'

export function Footer() {
  const { store, theme } = useStore()
  const { store: info } = store
  const textColor = getContrastTextColor(theme.primaryColor)

  return (
    <footer
      className="mt-auto border-t border-black/10"
      style={{ backgroundColor: theme.primaryColor, color: textColor }}
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">{info.name}</h3>
            <p className="mt-2 text-sm opacity-80">Powered by Afto Storefront Platform</p>
          </div>
          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-2 space-y-1 text-sm opacity-80">
              <li>Home</li>
              <li>Products</li>
              <li>Categories</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Contact</h4>
            <p className="mt-2 text-sm opacity-80">support@{info.slug}.com</p>
            <p className="text-sm opacity-80">1-800-AFTO-SHOP</p>
          </div>
        </div>
        <div className="mt-8 border-t border-white/20 pt-6 text-center text-sm opacity-70">
          &copy; {new Date().getFullYear()} {info.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
