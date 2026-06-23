'use client'

import type { ReactNode } from 'react'
import type { PageNode } from '@/lib/types/store'
import type { VariantRenderContext } from '@/lib/registry/types'
import { getVariantComponent } from '@/lib/registry/render-map'
import { resolveNodeProps } from '@/lib/resolve-props'
import { mergeThemedHeaderChildProps } from '@/lib/header-variant-theme'

export function renderHeaderSlot(
  childNodes: PageNode[] | undefined,
  type: string,
  ctx: VariantRenderContext,
  fallback: ReactNode | null,
  extraProps?: Record<string, unknown>,
) {
  const node = childNodes?.find((c) => c.type === type)
  if (!node) return fallback ?? null
  if (node.props?.visible === false) return fallback ?? null

  const Component = getVariantComponent(node.variant)
  if (!Component) return fallback

  const props = mergeThemedHeaderChildProps(
    ctx.headerTheme,
    node.type,
    resolveNodeProps(node.type, node.props ?? {}, ctx.store, node),
    extraProps,
  )

  return <Component nodeId={node.id} props={props} ctx={ctx} />
}
