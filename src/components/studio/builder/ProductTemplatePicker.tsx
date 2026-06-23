'use client'

import { useCallback, useEffect, useState } from 'react'
import type { WhatsAppTemplateListItem } from '@/lib/types/product-template'
import { fetchProductTemplatesList } from '@/lib/product-template-api'
import { RemoteImage } from '@/components/ui/RemoteImage'
import { StudioIcon } from '@/components/studio/builder/ui/StudioIcon'

const inputClass =
  'w-full rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition focus:border-teal-500/50 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20'

type ProductTemplatePickerProps = {
  linkedTemplateId?: string
  linkedTemplateName?: string
  onLink: (template: WhatsAppTemplateListItem | null) => void
}

export function ProductTemplatePicker({
  linkedTemplateId,
  linkedTemplateName,
  onLink,
}: ProductTemplatePickerProps) {
  const [templates, setTemplates] = useState<WhatsAppTemplateListItem[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTemplates = useCallback(async (nextPage: number, query: string, append: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProductTemplatesList({ page: nextPage, limit: 20, search: query })
      setTemplates((prev) => (append ? [...prev, ...data.templates] : data.templates))
      setHasMore(data.pagination.hasMore)
      setPage(data.pagination.currentPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadTemplates(1, search, false)
    }, 250)
    return () => window.clearTimeout(timer)
  }, [search, loadTemplates])

  const linked = templates.find((t) => t.id === linkedTemplateId)

  return (
    <div className="space-y-3">
      {linkedTemplateId ? (
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-3">
          <div className="flex items-start gap-3">
            {(linked?.thumbnailUrl || linkedTemplateName) && (
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                {linked?.thumbnailUrl && (
                  <RemoteImage
                    src={linked.thumbnailUrl}
                    alt={linkedTemplateName ?? 'Template'}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-teal-300/80">
                Linked template
              </p>
              <p className="truncate text-sm font-semibold text-teal-100">
                {linkedTemplateName ?? linked?.name ?? linkedTemplateId}
              </p>
              {linked && (
                <p className="mt-0.5 text-[11px] text-teal-200/60">
                  {linked.totalItemsCount} items · {linked.status}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onLink(null)}
              className="shrink-0 rounded-lg border border-zinc-700/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
            >
              Unlink
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs leading-relaxed text-zinc-500">
          Link a WhatsApp product template. Items appear only after a template is connected.
        </p>
      )}

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search templates…"
        className={inputClass}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="max-h-64 space-y-1.5 overflow-y-auto pr-0.5">
        {templates.map((template) => {
          const isActive = linkedTemplateId === template.id
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onLink(template)}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                isActive
                  ? 'border-teal-500/50 bg-teal-500/10 ring-1 ring-teal-500/30'
                  : 'border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-800/40'
              }`}
            >
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                {template.thumbnailUrl ? (
                  <RemoteImage
                    src={template.thumbnailUrl}
                    alt={template.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-600">
                    <StudioIcon icon="solar:bag-4-bold-duotone" width={18} height={18} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-medium ${isActive ? 'text-teal-200' : 'text-zinc-200'}`}>
                  {template.name}
                </p>
                <p className="truncate text-[11px] text-zinc-500">
                  {template.headerText || template.whatsappMainMenu}
                </p>
                <p className="text-[10px] text-zinc-600">
                  {template.totalItemsCount} items · #{template.serialNumber}
                </p>
              </div>
              {isActive && (
                <StudioIcon icon="solar:check-circle-bold" width={16} height={16} className="text-teal-400" />
              )}
            </button>
          )
        })}

        {!loading && templates.length === 0 && !error && (
          <p className="py-4 text-center text-xs text-zinc-600">No templates found</p>
        )}
      </div>

      {hasMore && (
        <button
          type="button"
          disabled={loading}
          onClick={() => loadTemplates(page + 1, search, true)}
          className="w-full rounded-lg border border-zinc-700/80 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-50"
        >
          {loading ? 'Loading…' : 'Load more templates'}
        </button>
      )}
    </div>
  )
}
