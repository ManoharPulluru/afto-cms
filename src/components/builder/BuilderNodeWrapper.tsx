'use client'

import type { ReactNode } from 'react'
import { getNodeLabel } from '@/lib/tree-utils'
import type { PageNode } from '@/lib/types/store'

type BuilderNodeWrapperProps = {
  node: PageNode
  builderMode?: boolean
  selectedNodeId?: string | null
  hoveredNodeId?: string | null
  onSelect?: (nodeId: string) => void
  onHover?: (nodeId: string | null) => void
  children: ReactNode
}

export function BuilderNodeWrapper({
  node,
  builderMode,
  selectedNodeId,
  hoveredNodeId,
  onSelect,
  onHover,
  children,
}: BuilderNodeWrapperProps) {
  if (!builderMode) return <>{children}</>

  const isSelected = selectedNodeId === node.id
  const isHovered = hoveredNodeId === node.id

  return (
    <div
      data-builder-id={node.id}
      data-builder-type={node.type}
      data-builder-label={getNodeLabel(node)}
      className="relative transition-shadow duration-150"
      style={{
        outline: isSelected
          ? '2px solid rgb(20 184 166)'
          : isHovered
            ? '2px dashed rgb(94 234 212 / 0.7)'
            : undefined,
        outlineOffset: isSelected || isHovered ? 3 : undefined,
        boxShadow: isSelected ? '0 0 0 4px rgb(20 184 166 / 0.15)' : undefined,
        borderRadius: isSelected || isHovered ? 4 : undefined,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.(node.id)
      }}
      onMouseEnter={() => onHover?.(node.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {(isSelected || isHovered) && (
        <span className="pointer-events-none absolute left-3 top-3 z-50 inline-flex items-center gap-1.5 rounded-lg bg-zinc-900/95 px-2.5 py-1 text-xs font-medium text-teal-300 shadow-lg ring-1 ring-teal-500/30 backdrop-blur-sm">
          {getNodeLabel(node)}
        </span>
      )}
      {children}
    </div>
  )
}
