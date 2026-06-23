'use client'

import type { ReactNode } from 'react'

type StudioCartPartOutlineProps = {
  part: string
  highlightPart?: string
  className?: string
  children: ReactNode
}

/** Studio-only outline when a cart drawer child part is selected in the layer tree. */
export function StudioCartPartOutline({
  part,
  highlightPart,
  className = '',
  children,
}: StudioCartPartOutlineProps) {
  const active = Boolean(highlightPart && highlightPart === part)

  if (!active) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 z-30 rounded-lg ring-2 ring-teal-400/90 ring-offset-2 ring-offset-transparent"
        aria-hidden
      />
      {children}
    </div>
  )
}
