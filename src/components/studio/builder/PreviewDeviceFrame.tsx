'use client'

import { StudioIcon } from '@/components/studio/builder/ui/StudioIcon'

type PreviewDeviceFrameProps = {
  label: string
  width: number
  height: number
  icon: string
  src: string
  iframeRef: (el: HTMLIFrameElement | null) => void
  scale: number
  hideLabel?: boolean
}

export function PreviewDeviceFrame({
  label,
  width,
  height,
  icon,
  src,
  iframeRef,
  scale,
  hideLabel,
}: PreviewDeviceFrameProps) {
  const scaledWidth = width * scale
  const scaledHeight = height * scale

  return (
    <div className="flex shrink-0 flex-col" style={{ width: scaledWidth + 2 }}>
      {!hideLabel && (
        <div className="mb-2 flex items-center justify-center gap-2 px-0.5">
          <StudioIcon icon={icon} width={14} height={14} className="text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-300">{label}</span>
          <span className="font-mono text-[10px] text-zinc-600">
            {width}×{height}
          </span>
        </div>
      )}

      <div
        className="overflow-hidden rounded-xl border border-zinc-700/80 bg-zinc-950 shadow-2xl shadow-black/50 ring-1 ring-zinc-800/60"
        style={{ width: scaledWidth, height: scaledHeight }}
      >
        <div className="origin-top-left overflow-hidden bg-white" style={{ width: scaledWidth, height: scaledHeight }}>
          <iframe
            ref={iframeRef}
            title={`${label} preview`}
            src={src}
            className="block border-0 bg-white"
            style={{
              width,
              height,
              transform: scale < 1 ? `scale(${scale})` : undefined,
              transformOrigin: 'top left',
            }}
          />
        </div>
      </div>
    </div>
  )
}

type PreviewDeviceTabsProps = {
  activeDevice: string
  onActiveDeviceChange: (id: string) => void
  presets: Array<{ id: string; label: string; icon: string; width: number; height: number }>
}

export function PreviewDeviceTabs({ activeDevice, onActiveDeviceChange, presets }: PreviewDeviceTabsProps) {
  return (
    <div className="flex shrink-0 border-b border-zinc-800/60 bg-zinc-900/60 px-4">
      {presets.map((p) => {
        const active = activeDevice === p.id
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onActiveDeviceChange(p.id)}
            className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 transition ${
              active
                ? 'border-violet-400 text-violet-300'
                : 'border-transparent text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            <StudioIcon icon={p.icon} width={14} height={14} />
            <span className="text-xs font-medium">{p.label}</span>
            <span className={`font-mono text-[10px] ${active ? 'text-violet-400/70' : 'text-zinc-600'}`}>
              {p.width}×{p.height}
            </span>
          </button>
        )
      })}
    </div>
  )
}

type PreviewZoomControlsProps = {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onFit: () => void
}

export function PreviewZoomControls({ zoom, onZoomIn, onZoomOut, onZoomReset, onFit }: PreviewZoomControlsProps) {
  const pct = Math.round(zoom * 100)
  return (
    <div className="flex shrink-0 items-center gap-1">
      <div className="flex items-center gap-0.5 rounded-lg border border-zinc-800 bg-zinc-950/80 p-0.5">
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoom <= 0.25}
          aria-label="Zoom out"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <StudioIcon icon="solar:minimalistic-magnifer-zoom-out-linear" width={16} height={16} />
        </button>
        <button
          type="button"
          onClick={onZoomReset}
          className="min-w-[44px] px-1 text-center font-mono text-[11px] text-zinc-400 hover:text-zinc-200"
          title="Reset zoom to 100%"
        >
          {pct}%
        </button>
        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoom >= 1}
          aria-label="Zoom in"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <StudioIcon icon="solar:minimalistic-magnifer-zoom-in-linear" width={16} height={16} />
        </button>
      </div>
      <button
        type="button"
        onClick={onFit}
        title="Fit preview to panel"
        className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[11px] font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
      >
        Fit
      </button>
    </div>
  )
}
