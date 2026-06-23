import type { PageNode, StoreData } from '@/lib/types/store'
import { getDefaultNodeProps } from '@/lib/resolve-props'
import {
  CART_DRAWER_CHILD_META,
  CART_DRAWER_CHILD_SLOTS,
  type CartDrawerChildType,
} from '@/lib/cart-drawer-children-config'
import { CART_DRAWER_SECTION_DEFAULTS } from '@/lib/cart-drawer-config'

const LEGACY_CART_PROP_KEYS = [
  'titlePrefix',
  'nextButtonLabel',
  'couponCode',
  'couponSavings',
] as const

let childIdCounter = 0

function cartChildId(type: string): string {
  childIdCounter += 1
  return `${type}-${childIdCounter}`
}

export function createCartDrawerChild(
  type: CartDrawerChildType,
  store: StoreData,
  overrides?: Partial<PageNode>,
): PageNode {
  return {
    id: overrides?.id ?? cartChildId(type),
    type,
    variant: overrides?.variant ?? 'CartDrawerPartV1',
    label: overrides?.label ?? CART_DRAWER_CHILD_META[type].label,
    props: {
      ...getDefaultNodeProps(type, store),
      ...overrides?.props,
    },
  }
}

export function childrenFromLegacyCartProps(
  props: Record<string, unknown>,
  store: StoreData,
): PageNode[] {
  childIdCounter = 0
  return CART_DRAWER_CHILD_SLOTS.map((type) => {
    const base = createCartDrawerChild(type, store)
    if (type === 'cartDrawerHeader') {
      return {
        ...base,
        props: {
          ...base.props,
          titlePrefix: props.titlePrefix ?? CART_DRAWER_SECTION_DEFAULTS.titlePrefix,
        },
      }
    }
    if (type === 'cartCta') {
      return {
        ...base,
        props: {
          ...base.props,
          cartButtonLabel: props.nextButtonLabel ?? CART_DRAWER_SECTION_DEFAULTS.nextButtonLabel,
        },
      }
    }
    if (type === 'cartCoupon') {
      return {
        ...base,
        props: {
          ...base.props,
          couponCode: props.couponCode ?? CART_DRAWER_SECTION_DEFAULTS.couponCode,
          couponSavings: props.couponSavings ?? CART_DRAWER_SECTION_DEFAULTS.couponSavings,
        },
      }
    }
    return base
  })
}

export function stripLegacyCartProps(props: Record<string, unknown>): Record<string, unknown> {
  const next = { ...props }
  for (const key of LEGACY_CART_PROP_KEYS) delete next[key]
  return next
}

export function switchCartDrawerVariantState(node: PageNode, variant: string): PageNode {
  const childrenByVariant = {
    ...((node.props?.childrenByVariant as Record<string, PageNode[]> | undefined) ?? {}),
    [node.variant]: node.children ?? [],
  }
  return {
    ...node,
    variant,
    props: { ...node.props, childrenByVariant },
    children: childrenByVariant[variant],
  }
}

export function ensureCartDrawerChildren(node: PageNode, store: StoreData): PageNode {
  if (node.type !== 'cartDrawer') return node

  const variant = ['CartDrawerV1', 'CartDrawerV2', 'CartDrawerV3'].includes(node.variant)
    ? node.variant
    : 'CartDrawerV1'
  const props = node.props ?? {}
  const hasLegacy = LEGACY_CART_PROP_KEYS.some((k) => props[k] !== undefined && props[k] !== '')
  let children = node.children ?? []

  if (children.length === 0 && hasLegacy) {
    children = childrenFromLegacyCartProps(props, store)
  }

  if (children.length === 0) {
    children = defaultCartDrawerChildren(store)
  }

  const byType = new Map<string, PageNode>()
  for (const child of children) {
    if (CART_DRAWER_CHILD_SLOTS.includes(child.type as CartDrawerChildType) && !byType.has(child.type)) {
      byType.set(child.type, child)
    }
  }

  const ordered = CART_DRAWER_CHILD_SLOTS.map((type) => {
    if (byType.has(type)) {
      const child = byType.get(type)!
      return {
        ...child,
        variant: 'CartDrawerPartV1',
        label: CART_DRAWER_CHILD_META[type].label,
        props: { ...getDefaultNodeProps(type, store), ...child.props },
      }
    }
    return createCartDrawerChild(type, store)
  })

  const withVariantDefaults = ordered.map((child) => {
    if (child.type === 'cartDrawerStyle') {
      return {
        ...child,
        props: {
          ...child.props,
          showTopAccentBar: variant === 'CartDrawerV1',
        },
      }
    }
    if (child.type === 'cartCoupon') {
      return {
        ...child,
        props: {
          ...child.props,
          showOnCartStepOnly: variant === 'CartDrawerV2',
        },
      }
    }
    if (child.type === 'cartLineItem' && variant === 'CartDrawerV2') {
      return {
        ...child,
        props: {
          ...child.props,
          imageRadius: child.props?.imageRadius ?? 8,
        },
      }
    }
    return child
  })

  return {
    ...node,
    variant,
    props: stripLegacyCartProps(props),
    children: withVariantDefaults,
  }
}

export function defaultCartDrawerChildren(store: StoreData): PageNode[] {
  childIdCounter = 0
  return CART_DRAWER_CHILD_SLOTS.map((type) => createCartDrawerChild(type, store))
}

export function filterCartDrawerNodesForNavigator(nodes: PageNode[]): PageNode[] {
  return nodes.map((node) => {
    if (node.type === 'cartDrawer' && node.children?.length) {
      const allowed = new Set<string>(CART_DRAWER_CHILD_SLOTS)
      return { ...node, children: node.children.filter((c) => allowed.has(c.type)) }
    }
    if (node.children?.length) {
      return { ...node, children: filterCartDrawerNodesForNavigator(node.children) }
    }
    return node
  })
}

export function getCartDrawerChildProps(
  childNodes: PageNode[] | undefined,
  type: CartDrawerChildType,
): Record<string, unknown> {
  return childNodes?.find((c) => c.type === type)?.props ?? {}
}
