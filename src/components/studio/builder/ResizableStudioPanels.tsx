'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'afto_studio_panel_widths'

const DEFAULT_LEFT = 280
const DEFAULT_RIGHT = 320
const MIN_LEFT = 200
const MIN_RIGHT = 240
const MIN_CENTER = 360
const HANDLE_WIDTH = 6

type PanelWidths = {
  left: number
  right: number
}

function loadWidths(): PanelWidths {
  if (typeof window === 'undefined') {
    return { left: DEFAULT_LEFT, right: DEFAULT_RIGHT }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { left: DEFAULT_LEFT, right: DEFAULT_RIGHT }
    const parsed = JSON.parse(raw) as Partial<PanelWidths>
    return {
      left: clamp(parsed.left ?? DEFAULT_LEFT, MIN_LEFT, 600),
      right: clamp(parsed.right ?? DEFAULT_RIGHT, MIN_RIGHT, 600),
    }
  } catch {
    return { left: DEFAULT_LEFT, right: DEFAULT_RIGHT }
  }
}

function saveWidths(widths: PanelWidths) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widths))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

type ResizeHandleProps = {
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void
  active: boolean
}

function ResizeHandle({ onPointerDown, active }: ResizeHandleProps) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panel"
      onPointerDown={onPointerDown}
      className={`group relative z-20 hidden shrink-0 cursor-col-resize select-none lg:block ${active ? 'bg-teal-500/30' : ''}`}
      style={{ width: HANDLE_WIDTH }}
    >
      <div
        className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 transition-colors ${
          active ? 'bg-teal-400' : 'bg-zinc-800 group-hover:bg-teal-500/60'
        }`}
      />
      <div className="absolute inset-y-0 -left-1 -right-1" />
    </div>
  )
}

type ResizableStudioPanelsProps = {
  left: ReactNode
  center: ReactNode
  right: ReactNode
}

export function ResizableStudioPanels({ left, center, right }: ResizableStudioPanelsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [widths, setWidths] = useState<PanelWidths>(() => loadWidths())
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null)
  const dragRef = useRef<{
    edge: 'left' | 'right'
    startX: number
    startLeft: number
    startRight: number
    containerWidth: number
  } | null>(null)

  const getLimits = useCallback((containerWidth: number, leftW: number, rightW: number) => {
    const chrome = HANDLE_WIDTH * 2
    const maxLeft = containerWidth - rightW - MIN_CENTER - chrome
    const maxRight = containerWidth - leftW - MIN_CENTER - chrome
    return {
      maxLeft: Math.max(MIN_LEFT, maxLeft),
      maxRight: Math.max(MIN_RIGHT, maxRight),
    }
  }, [])

  useEffect(() => {
    function onResize() {
      setWidths((current) => {
        const containerWidth = containerRef.current?.clientWidth ?? 0
        if (!containerWidth) return current
        const { maxLeft, maxRight } = getLimits(containerWidth, current.left, current.right)
        return {
          left: clamp(current.left, MIN_LEFT, maxLeft),
          right: clamp(current.right, MIN_RIGHT, maxRight),
        }
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [getLimits])

  useEffect(() => {
    if (!dragging) return

    function onPointerMove(e: globalThis.PointerEvent) {
      const drag = dragRef.current
      if (!drag) return
      const dx = e.clientX - drag.startX

      if (drag.edge === 'left') {
        const { maxLeft } = getLimits(drag.containerWidth, drag.startLeft, drag.startRight)
        const nextLeft = clamp(drag.startLeft + dx, MIN_LEFT, maxLeft)
        setWidths((w) => ({ ...w, left: nextLeft }))
        return
      }

      const { maxRight } = getLimits(drag.containerWidth, drag.startLeft, drag.startRight)
      const nextRight = clamp(drag.startRight - dx, MIN_RIGHT, maxRight)
      setWidths((w) => ({ ...w, right: nextRight }))
    }

    function onPointerUp() {
      setDragging(null)
      dragRef.current = null
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      setWidths((w) => {
        saveWidths(w)
        return w
      })
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [dragging, getLimits])

  function startDrag(edge: 'left' | 'right', e: ReactPointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    e.preventDefault()
    const containerWidth = containerRef.current?.clientWidth ?? 0
    dragRef.current = {
      edge,
      startX: e.clientX,
      startLeft: widths.left,
      startRight: widths.right,
      containerWidth,
    }
    setDragging(edge)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  return (
    <div ref={containerRef} className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
      {/* Mobile / tablet: stacked */}
      <div className="min-h-0 flex-1 overflow-hidden lg:hidden">
        <div className="flex h-full flex-col">
          <div className="max-h-[40vh] min-h-[200px] shrink-0 overflow-hidden border-b border-zinc-800/80">
            {left}
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">{center}</div>
          <div className="max-h-[40vh] min-h-[200px] shrink-0 overflow-hidden border-t border-zinc-800/80">
            {right}
          </div>
        </div>
      </div>

      {/* Desktop: resizable columns */}
      <div className="hidden min-h-0 w-full flex-1 lg:flex">
        <div className="min-h-0 shrink-0 overflow-hidden" style={{ width: widths.left }}>
          {left}
        </div>

        <ResizeHandle active={dragging === 'left'} onPointerDown={(e) => startDrag('left', e)} />

        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{center}</div>

        <ResizeHandle active={dragging === 'right'} onPointerDown={(e) => startDrag('right', e)} />

        <div className="min-h-0 shrink-0 overflow-hidden" style={{ width: widths.right }}>
          {right}
        </div>
      </div>
    </div>
  )
}
