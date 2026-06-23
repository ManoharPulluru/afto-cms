'use client'

import { useCallback, useEffect, useState } from 'react'
import { StudioIcon } from '@/components/studio/builder/ui/StudioIcon'

const SUGGESTED_ICONS = [
  'solar:home-2-linear',
  'solar:clipboard-list-linear',
  'solar:medal-ribbon-linear',
  'solar:ticket-linear',
  'solar:magnifer-linear',
  'solar:cart-large-2-linear',
  'solar:bag-4-linear',
  'solar:user-circle-linear',
  'solar:sun-linear',
  'solar:moon-linear',
  'solar:heart-linear',
  'solar:star-linear',
  'solar:shop-linear',
  'solar:wallet-linear',
  'solar:gift-linear',
  'solar:bell-linear',
  'solar:settings-linear',
  'mdi:home-outline',
  'mdi:shopping-outline',
  'mdi:account-outline',
  'lucide:home',
  'lucide:shopping-cart',
  'lucide:user',
  'lucide:sun',
  'lucide:moon',
  'lucide:search',
]

type IconPickerModalProps = {
  open: boolean
  value: string
  onSelect: (icon: string) => void
  onClose: () => void
}

export function IconPickerModal({ open, value, onSelect, onClose }: IconPickerModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>(SUGGESTED_ICONS)
  const [loading, setLoading] = useState(false)

  const searchIcons = useCallback(async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) {
      setResults(SUGGESTED_ICONS)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(
        `https://api.iconify.design/search?query=${encodeURIComponent(trimmed)}&limit=60`,
      )
      if (!res.ok) throw new Error('search failed')
      const data = (await res.json()) as { icons?: string[] }
      setResults(data.icons?.length ? data.icons : SUGGESTED_ICONS)
    } catch {
      setResults(
        SUGGESTED_ICONS.filter((icon) => icon.toLowerCase().includes(trimmed.toLowerCase())),
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => searchIcons(query), 300)
    return () => clearTimeout(timer)
  }, [open, query, searchIcons])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close icon picker"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[min(640px,90vh)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl">
        <div className="border-b border-zinc-800 px-4 py-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-zinc-100">Choose Iconify icon</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-300"
            >
              <StudioIcon icon="solar:close-circle-linear" width={18} height={18} />
            </button>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons… e.g. home, cart, sun"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            autoFocus
          />
          {value && (
            <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
              <span>Selected:</span>
              <StudioIcon icon={value} width={16} height={16} className="text-teal-400" />
              <code className="truncate text-zinc-400">{value}</code>
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {loading ? (
            <p className="py-8 text-center text-sm text-zinc-500">Searching…</p>
          ) : (
            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
              {results.map((icon) => {
                const active = icon === value
                return (
                  <button
                    key={icon}
                    type="button"
                    title={icon}
                    onClick={() => {
                      onSelect(icon)
                      onClose()
                    }}
                    className={`flex aspect-square items-center justify-center rounded-lg border transition ${
                      active
                        ? 'border-teal-500/50 bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/30'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <StudioIcon icon={icon} width={22} height={22} />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
