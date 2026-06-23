import type { PageNode, StoreData } from '@/lib/types/store'
import { getVariantConfig } from '@/lib/registry'
import { resolveNodeProps } from '@/lib/resolve-props'
import { getDefaultHeaderVariantProps } from '@/lib/header-variant-theme'

/** Default props for the selected node's current variant (preserves identity keys like navKey, productId). */
export function getDefaultPropsForNode(node: PageNode, store: StoreData): Record<string, unknown> {
  if (node.type === 'header') {
    const defaults = getDefaultHeaderVariantProps(node.variant, store)
    const appearanceByVariant = {
      ...((node.props?.appearanceByVariant as Record<string, Record<string, unknown>> | undefined) ?? {}),
      [node.variant]: defaults,
    }
    return {
      ...defaults,
      appearanceByVariant,
      childrenByVariant: node.props?.childrenByVariant,
    }
  }

  const seed: Record<string, unknown> = {}
  if (node.type === 'navLink' && node.props?.navKey) {
    seed.navKey = node.props.navKey
  }

  const resolved = resolveNodeProps(node.type, seed, store, node)
  const variantDefaults = getVariantConfig(node.type, node.variant)?.defaultProps ?? {}

  const next: Record<string, unknown> = {
    ...resolved,
    ...variantDefaults,
    ...seed,
  }

  if (node.type === 'productCard' && node.props?.productId) {
    next.productId = node.props.productId
  }

  return next
}
