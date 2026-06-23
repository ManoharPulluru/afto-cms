'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { StoreData } from '@/lib/types/store'
import { findPageById } from '@/lib/tree-utils'
import { StudioIcon } from '@/components/studio/builder/ui/StudioIcon'
import { EmptyState } from '@/components/studio/builder/ui/PanelChrome'
import {
  PreviewDeviceFrame,
  PreviewDeviceTabs,
  PreviewZoomControls,
} from '@/components/studio/builder/PreviewDeviceFrame'
import { usePreviewSync } from '@/components/studio/builder/usePreviewSync'
import {
  ALL_DEVICE_IDS,
  DEVICE_PRESETS,
  type AllDeviceId,
} from '@/components/studio/builder/preview-viewports'

const ZOOM_MIN = 0.25
const ZOOM_MAX = 1
const ZOOM_STEP = 0.1
const PREVIEW_PADDING = 32

function clampZoom(scale: number): number {
  return Math.round(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, scale)) * 10) / 10
}

function fitZoomForPanel(
  panel: HTMLDivElement,
  frameWidth: number,
  frameHeight: number,
): number {
  const availableW = panel.clientWidth - PREVIEW_PADDING
  const availableH = panel.clientHeight - PREVIEW_PADDING
  if (availableW <= 0 || availableH <= 0) return 1
  return clampZoom(Math.min(availableW / frameWidth, availableH / frameHeight))
}

type PreviewPanelProps = {
  draftStore: StoreData
  pageId: string
  selectedNodeId: string | null
  hoveredNodeId: string | null
  onSelectNode: (nodeId: string) => void
  onHoverNode: (nodeId: string | null) => void
}

function pagePathFromStore(store: StoreData, pageId: string): string {
  const page = findPageById(store.pages, pageId)
  const slug = page?.slug ?? '/'
  return slug === '/' ? '/' : slug.startsWith('/') ? slug : `/${slug}`
}

function previewSrc(pagePath: string, pageId: string): string {
  const q = new URLSearchParams({ builder: '1', pageId })
  return pagePath === '/' ? `/?${q}` : `${pagePath}?${q}`
}

export function PreviewPanel({
  draftStore,
  pageId,
  selectedNodeId,
  onSelectNode,
  onHoverNode,
}: PreviewPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const userAdjustedZoom = useRef(false)
  const [activeDevice, setActiveDevice] = useState<AllDeviceId>('desktop')
  const [zoom, setZoom] = useState(1)

  const page = findPageById(draftStore.pages, pageId)
  const pagePath = pagePathFromStore(draftStore, pageId)
  const previewUrl = `localhost:3000${pagePath === '/' ? '' : pagePath}`

  const { registerIframe } = usePreviewSync({
    draftStore,
    pageId,
    selectedNodeId,
    onSelectNode,
    onHoverNode,
  })

  const presetList = useMemo(
    () => ALL_DEVICE_IDS.map((id) => DEVICE_PRESETS[id]),
    [],
  )

  const activeFrame = useMemo(() => {
    const p = DEVICE_PRESETS[activeDevice]
    return {
      key: p.id,
      label: p.label,
      width: p.width,
      height: p.height,
      icon: p.icon,
      src: previewSrc(pagePath, pageId),
    }
  }, [activeDevice, pageId, pagePath])

  const applyFitZoom = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setZoom(fitZoomForPanel(el, activeFrame.width, activeFrame.height))
  }, [activeFrame.height, activeFrame.width])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || !page?.tree?.length) return

    function recalc() {
      if (userAdjustedZoom.current) return
      setZoom(fitZoomForPanel(el!, activeFrame.width, activeFrame.height))
    }

    recalc()
    const ro = new ResizeObserver(recalc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [activeFrame.height, activeFrame.width, activeDevice, page?.tree?.length])

  function handleDeviceChange(id: string) {
    userAdjustedZoom.current = false
    setActiveDevice(id as AllDeviceId)
  }

  function handleFitZoom() {
    userAdjustedZoom.current = false
    applyFitZoom()
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-zinc-950">
      <div className="flex shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-zinc-900/40 px-4 py-3 backdrop-blur-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/80 text-violet-400 ring-1 ring-zinc-700/50">
          <StudioIcon icon="solar:monitor-smartphone-bold-duotone" width={16} height={16} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold tracking-tight text-zinc-100">Preview</h2>
          <p className="truncate text-xs text-zinc-500">Live draft · not published</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          Draft
        </span>
      </div>

      <PreviewDeviceTabs
        activeDevice={activeDevice}
        onActiveDeviceChange={handleDeviceChange}
        presets={presetList}
      />

      <div className="flex shrink-0 items-center gap-2 border-b border-zinc-800/60 bg-zinc-900/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-1.5">
          <StudioIcon icon="solar:lock-keyhole-minimalistic-bold" width={12} height={12} className="shrink-0 text-zinc-600" />
          <span className="truncate font-mono text-[11px] text-zinc-500">{previewUrl}</span>
        </div>
        <PreviewZoomControls
          zoom={zoom}
          onZoomOut={() => {
            userAdjustedZoom.current = true
            setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 10) / 10))
          }}
          onZoomIn={() => {
            userAdjustedZoom.current = true
            setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 10) / 10))
          }}
          onZoomReset={() => {
            userAdjustedZoom.current = true
            setZoom(1)
          }}
          onFit={handleFitZoom}
        />
      </div>

      <div ref={scrollRef} className="preview-scroll-area min-h-0 flex-1 overflow-auto bg-zinc-900/40 p-4">
        {!page?.tree?.length ? (
          <EmptyState
            icon="solar:document-add-bold-duotone"
            title="Empty page"
            description="Add sections from the navigator to start building this page."
          />
        ) : (
          <div className="flex min-h-full items-start justify-center">
            <PreviewDeviceFrame
              key={activeFrame.key}
              label={activeFrame.label}
              width={activeFrame.width}
              height={activeFrame.height}
              icon={activeFrame.icon}
              src={activeFrame.src}
              scale={zoom}
              hideLabel
              iframeRef={(el) => registerIframe(activeFrame.key, el)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
