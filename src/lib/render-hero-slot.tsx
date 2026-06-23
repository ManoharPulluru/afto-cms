'use client'

import type { ReactNode } from 'react'
import type { PageNode } from '@/lib/types/store'
import type { VariantRenderContext } from '@/lib/registry/types'
import { getVariantComponent } from '@/lib/registry/render-map'
import { resolveNodeProps } from '@/lib/resolve-props'

export function renderHeroSlot(
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

  const props = {
    ...resolveNodeProps(node.type, node.props ?? {}, ctx.store, node),
    ...extraProps,
  }

  return <Component nodeId={node.id} props={props} ctx={ctx} />
}

export function renderHeroFeatureNodes(
  childNodes: PageNode[] | undefined,
  ctx: VariantRenderContext,
): Array<{ key: string; node: ReactNode }> {
  if (!childNodes?.length) return []

  return childNodes
    .filter((c) => c.type === 'heroFeature' && c.props?.visible !== false)
    .flatMap((node) => {
      const Component = getVariantComponent(node.variant)
      if (!Component) return []
      const props = resolveNodeProps(node.type, node.props ?? {}, ctx.store, node)
      return [{ key: node.id, node: <Component nodeId={node.id} props={props} ctx={ctx} /> }]
    })
}
