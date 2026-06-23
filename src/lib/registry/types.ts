import type { PageNode, StoreData } from '@/lib/types/store'
import type { ReactNode } from 'react'

import type { HeaderVariantTheme } from '@/lib/header-variant-theme'

export type VariantRenderContext = {
  store: StoreData
  builderMode?: boolean
  /** True when rendered inside studio preview iframe (use real fixed headers) */
  previewInFrame?: boolean
  selectedNodeId?: string | null
  hoveredNodeId?: string | null
  onSelectNode?: (nodeId: string) => void
  onHoverNode?: (nodeId: string | null) => void
  /** Resolved light/dark theme for header child parts */
  headerTheme?: HeaderVariantTheme
}

export type VariantComponentProps = {
  nodeId: string
  props: Record<string, unknown>
  children?: ReactNode
  childNodes?: PageNode[]
  ctx: VariantRenderContext
}
