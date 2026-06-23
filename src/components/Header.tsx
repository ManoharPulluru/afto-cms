'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useStore } from '@/providers/ThemeProvider'
import { getImageUrl } from '@/lib/utils'
import { getContrastTextColor } from '@/lib/theme'

export function Header() {
  const { store, theme } = useStore()
  const { store: info } = store
  const logoUrl = getImageUrl(info.logo)
  const textColor = getContrastTextColor(theme.primaryColor)

  return (
    <header
      className="sticky top-0 z-50 border-b border-black/10 shadow-sm"
      style={{ backgroundColor: theme.primaryColor, color: textColor }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            <Image src={logoUrl} alt={info.name} width={40} height={40} className="rounded-md object-cover" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/20 text-lg font-bold">
              {info.name.charAt(0)}
            </span>
          )}
          <span className="text-xl font-bold">{info.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium opacity-90 transition hover:opacity-100">
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium opacity-90 transition hover:opacity-100">
            Products
          </Link>
          <Link href="/categories" className="text-sm font-medium opacity-90 transition hover:opacity-100">
            Categories
          </Link>
        </nav>
        <button
          type="button"
          className="rounded-lg px-4 py-2 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: theme.secondaryColor, color: getContrastTextColor(theme.secondaryColor) }}
        >
          Cart (0)
        </button>
      </div>
    </header>
  )
}
