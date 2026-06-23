import type { PageNode, StoreData } from '@/lib/types/store'
import { getDefaultNodeProps } from '@/lib/resolve-props'
import { getDefaultPropsForNode } from '@/lib/node-default-props'
import {
  DEFAULT_GROCERY_NAV_LINKS,
  GROCERY_HEADER_CHILD_TYPES,
  GROCERY_NAV_KEYS,
  getGroceryHeaderFieldKeys,
  getGroceryNavLinkLabel,
  type GroceryHeaderChildType,
  type GroceryNavKey,
} from '@/lib/grocery-header-config'
import {
  GLASS_HEADER_CHILD_TYPES,
  getGlassHeaderFieldKeys,
  sortGlassHeaderChildren,
  type GlassHeaderChildType,
} from '@/lib/glass-header-config'
import {
  BISTRO_HEADER_CHILD_TYPES,
  BISTRO_NAV_KEYS,
  DEFAULT_BISTRO_NAV_LINKS,
  getBistroHeaderFieldKeys,
  getBistroNavLinkLabel,
  sortBistroHeaderChildren,
  type BistroHeaderChildType,
  type BistroNavKey,
} from '@/lib/bistro-header-config'
import { filterHeroNodesForNavigator } from '@/lib/hero-children'
import { filterCartDrawerNodesForNavigator } from '@/lib/cart-drawer-children'

const GROCERY_ONLY_CHILD_TYPES = ['navLink', 'themeToggle', 'groceryBarStyle', 'menuButton', 'bistroBarStyle'] as const
const GLASS_ONLY_EXCLUDE = ['navLink', 'themeToggle', 'groceryBarStyle', 'menuButton', 'bistroBarStyle'] as const

export type EnsureHeaderOptions = {
  /** Replace child props with variant defaults (keeps logo URL, navKey, productId). */
  resetChildProps?: boolean
}

export const HEADER_CHILD_ORDER = [
  'logo',
  'storeName',
  'address',
  'search',
  'deals',
  'account',
  'cart',
  'headerStyle',
  'navLink',
  'themeToggle',
  'groceryBarStyle',
  'menuButton',
  'bistroBarStyle',
] as const

export type HeaderChildType = (typeof HEADER_CHILD_ORDER)[number]

export const HEADER_VARIANT_SLOTS: Record<string, readonly string[]> = {
  HeaderV1: GROCERY_HEADER_CHILD_TYPES,
  HeaderV2: GLASS_HEADER_CHILD_TYPES,
  HeaderV3: BISTRO_HEADER_CHILD_TYPES,
}

export function getHeaderChildPropFields(
  headerVariant: string,
  childType: string,
): readonly string[] | null {
  if (headerVariant === 'HeaderV1') {
    const keys = getGroceryHeaderFieldKeys(childType)
    return keys.length ? keys : null
  }
  if (headerVariant === 'HeaderV2') {
    const keys = getGlassHeaderFieldKeys(childType)
    return keys.length ? keys : null
  }
  if (headerVariant === 'HeaderV3') {
    const keys = getBistroHeaderFieldKeys(childType)
    return keys.length ? keys : null
  }
  return null
}

export function isHeaderChildPropVisible(
  headerVariant: string,
  childType: string,
  fieldKey: string,
): boolean {
  const fields = getHeaderChildPropFields(headerVariant, childType)
  if (!fields) return false
  return fields.includes(fieldKey)
}

export function getHeaderSlotsForVariant(headerVariant: string): readonly string[] {
  return HEADER_VARIANT_SLOTS[headerVariant] ?? HEADER_CHILD_ORDER
}

export function isHeaderChildVisible(headerVariant: string, childType: string, child?: PageNode): boolean {
  if (childType === 'navLink' && child?.props?.navKey) {
    const key = child.props.navKey as string
    if (headerVariant === 'HeaderV1') {
      return GROCERY_NAV_KEYS.includes(key as GroceryNavKey)
    }
    if (headerVariant === 'HeaderV3') {
      return BISTRO_NAV_KEYS.includes(key as BistroNavKey)
    }
    return false
  }
  if (headerVariant === 'HeaderV1') {
    if (childType === 'navLink') return true
    return GROCERY_HEADER_CHILD_TYPES.includes(childType as GroceryHeaderChildType)
  }
  if (headerVariant === 'HeaderV2') {
    return GLASS_HEADER_CHILD_TYPES.includes(childType as GlassHeaderChildType)
  }
  if (headerVariant === 'HeaderV3') {
    if (childType === 'navLink') return true
    return BISTRO_HEADER_CHILD_TYPES.includes(childType as BistroHeaderChildType)
  }
  return getHeaderSlotsForVariant(headerVariant).includes(childType)
}

function filterHeaderChildren(headerVariant: string, children: PageNode[]): PageNode[] {
  return children.filter((c) => isHeaderChildVisible(headerVariant, c.type, c))
}

export function getHeaderPartLabels(headerVariant: string, children?: PageNode[]): string[] {
  if (headerVariant === 'HeaderV1' && children?.length) {
    return sortGroceryHeaderChildren(children).map((c) => {
      if (c.type === 'navLink') {
        return getGroceryNavLinkLabel(String(c.props?.navKey ?? ''), c.label ?? 'Nav Link')
      }
      return HEADER_CHILD_META[c.type as HeaderChildType]?.label ?? c.label ?? c.type
    })
  }
  if (headerVariant === 'HeaderV2' && children?.length) {
    return sortGlassHeaderChildren(
      children.filter((c) => GLASS_HEADER_CHILD_TYPES.includes(c.type as GlassHeaderChildType)),
    ).map((c) => HEADER_CHILD_META[c.type as HeaderChildType]?.label ?? c.label ?? c.type)
  }
  if (headerVariant === 'HeaderV3' && children?.length) {
    return sortBistroHeaderChildren(filterHeaderChildren('HeaderV3', children)).map((c) => {
      if (c.type === 'navLink') {
        return getBistroNavLinkLabel(String(c.props?.navKey ?? ''), c.label ?? 'Nav Link')
      }
      return HEADER_CHILD_META[c.type as HeaderChildType]?.label ?? c.label ?? c.type
    })
  }
  return getHeaderSlotsForVariant(headerVariant).map((type) => {
    if (type === 'navLink') return 'Page Navs'
    return HEADER_CHILD_META[type as HeaderChildType]?.label ?? type
  })
}

export function filterNodesForNavigator(nodes: PageNode[]): PageNode[] {
  return filterCartDrawerNodesForNavigator(
    filterHeroNodesForNavigator(
      nodes.map((node) => {
    if (node.type === 'header' && node.children?.length) {
      if (node.variant === 'HeaderV1') {
        return {
          ...node,
          children: sortGroceryHeaderChildren(filterHeaderChildren('HeaderV1', node.children)),
        }
      }
      if (node.variant === 'HeaderV2') {
        return {
          ...node,
          children: sortGlassHeaderChildren(
            node.children.filter((c) => isHeaderChildVisible('HeaderV2', c.type)),
          ),
        }
      }
      if (node.variant === 'HeaderV3') {
        return {
          ...node,
          children: sortBistroHeaderChildren(filterHeaderChildren('HeaderV3', node.children)),
        }
      }
      const slots = getHeaderSlotsForVariant(node.variant)
      return {
        ...node,
        children: node.children.filter((c) => slots.includes(c.type)),
      }
    }
    if (node.children?.length) {
      return { ...node, children: filterNodesForNavigator(node.children) }
    }
    return node
  }),
    ),
  )
}

const GROCERY_DISPLAY_ORDER: Record<string, number> = {
  logo: 0,
  search: 1,
  navLink: 2,
  account: 3,
  themeToggle: 4,
  cart: 5,
  groceryBarStyle: 6,
}

export function sortGroceryHeaderChildren(children: PageNode[]): PageNode[] {
  return [...children].sort((a, b) => {
    const ao = GROCERY_DISPLAY_ORDER[a.type] ?? 99
    const bo = GROCERY_DISPLAY_ORDER[b.type] ?? 99
    if (ao !== bo) return ao - bo
    if (a.type === 'navLink' && b.type === 'navLink') {
      const ak = GROCERY_NAV_KEYS.indexOf(a.props?.navKey as (typeof GROCERY_NAV_KEYS)[number])
      const bk = GROCERY_NAV_KEYS.indexOf(b.props?.navKey as (typeof GROCERY_NAV_KEYS)[number])
      return ak - bk
    }
    return 0
  })
}

const HEADER_CHILD_META: Record<
  HeaderChildType,
  { variant: string; label: string }
> = {
  logo: { variant: 'LogoV1', label: 'Logo' },
  storeName: { variant: 'StoreNameV1', label: 'Store Name' },
  address: { variant: 'AddressV1', label: 'Address' },
  search: { variant: 'SearchV1', label: 'Search Bar' },
  deals: { variant: 'DealsV1', label: 'Deals Button' },
  account: { variant: 'AccountV1', label: 'Account / Login' },
  cart: { variant: 'CartV1', label: 'Cart Button' },
  headerStyle: { variant: 'HeaderStyleV1', label: 'Background & Style' },
  navLink: { variant: 'NavLinkV1', label: 'Nav Link' },
  themeToggle: { variant: 'ThemeToggleV1', label: 'Theme Toggle' },
  groceryBarStyle: { variant: 'GroceryBarStyleV1', label: 'Bar Style' },
  menuButton: { variant: 'MenuButtonV1', label: 'Menu Button' },
  bistroBarStyle: { variant: 'BistroBarStyleV1', label: 'Bar Style' },
}

const GROCERY_CHILD_META: Partial<Record<HeaderChildType, { variant: string; label: string }>> = {
  account: { variant: 'AccountGroceryV1', label: 'Profile Card' },
}

const BISTRO_CHILD_META: Partial<Record<HeaderChildType, { variant: string; label: string }>> = {
  logo: { variant: 'BistroLogoV1', label: 'Logo' },
  storeName: { variant: 'BistroStoreNameV1', label: 'Store Name' },
  navLink: { variant: 'BistroNavLinkV1', label: 'Nav Link' },
  search: { variant: 'BistroSearchBtnV1', label: 'Search' },
  account: { variant: 'BistroAccountV1', label: 'Profile' },
  cart: { variant: 'BistroCartV1', label: 'Cart Button' },
}

let childIdCounter = 0

function headerChildId(type: string): string {
  childIdCounter += 1
  return `${type}-${childIdCounter}`
}

export function createHeaderChild(type: HeaderChildType, store: StoreData, extra?: Partial<PageNode>): PageNode {
  const meta = HEADER_CHILD_META[type]
  return {
    id: headerChildId(type),
    type,
    variant: meta.variant,
    label: meta.label,
    props: getDefaultNodeProps(type, store),
    ...extra,
  }
}

function createGroceryNavLink(navKey: (typeof GROCERY_NAV_KEYS)[number], store: StoreData): PageNode {
  const defaults = DEFAULT_GROCERY_NAV_LINKS[navKey]
  return {
    id: headerChildId(`navLink-${navKey}`),
    type: 'navLink',
    variant: 'NavLinkV1',
    label: getGroceryNavLinkLabel(navKey),
    props: {
      navKey,
      ...getDefaultNodeProps('navLink', store),
      label: defaults.label,
      href: defaults.href,
      icon: defaults.icon,
    },
  }
}

function dedupeGroceryNavLinks(existing: PageNode[], store: StoreData): PageNode[] {
  const rest = existing.filter((c) => c.type !== 'navLink')
  const navLinks = existing.filter((c) => c.type === 'navLink')
  const byKey = new Map<GroceryNavKey, PageNode>()
  const unassigned: PageNode[] = []

  for (const link of navLinks) {
    const key = link.props?.navKey as GroceryNavKey | undefined
    if (key && GROCERY_NAV_KEYS.includes(key)) {
      if (!byKey.has(key)) byKey.set(key, link)
    } else {
      unassigned.push(link)
    }
  }

  for (const navKey of GROCERY_NAV_KEYS) {
    if (byKey.has(navKey)) continue
    const orphan = unassigned.shift()
    if (orphan) {
      const defaults = DEFAULT_GROCERY_NAV_LINKS[navKey]
      byKey.set(navKey, {
        ...orphan,
        label: getGroceryNavLinkLabel(navKey),
        props: {
          ...getDefaultNodeProps('navLink', store),
          ...orphan.props,
          navKey,
          label: (orphan.props?.label as string) || defaults.label,
          href: (orphan.props?.href as string) || defaults.href,
          icon: (orphan.props?.icon as string) || defaults.icon,
        },
      })
    }
  }

  const finalNavLinks = GROCERY_NAV_KEYS.map((navKey) => {
    if (byKey.has(navKey)) return byKey.get(navKey)!
    return createGroceryNavLink(navKey, store)
  })

  return [...rest, ...finalNavLinks]
}

function ensureGroceryHeaderChildren(
  node: PageNode,
  store: StoreData,
  options?: EnsureHeaderOptions,
): PageNode {
  const resetChildProps = options?.resetChildProps ?? false
  let existing = dedupeGroceryNavLinks(
    [...(node.children ?? [])].filter(
      (c) =>
        !['menuButton', 'bistroBarStyle', 'storeName', 'address', 'deals', 'headerStyle'].includes(c.type) &&
        !(c.type === 'navLink' && BISTRO_NAV_KEYS.includes(c.props?.navKey as BistroNavKey)),
    ),
    store,
  )

  existing = existing.map((child) => {
    if (child.type === 'navLink' && child.props?.navKey) {
      const navKey = child.props.navKey as GroceryNavKey
      const defaults = DEFAULT_GROCERY_NAV_LINKS[navKey]
      return {
        ...child,
        label: getGroceryNavLinkLabel(navKey, child.label),
        props: resetChildProps
          ? getDefaultPropsForNode(
              { ...child, variant: 'NavLinkV1', props: { navKey, label: defaults.label, href: defaults.href, icon: defaults.icon } },
              store,
            )
          : {
              ...getDefaultNodeProps('navLink', store),
              label: defaults.label,
              href: defaults.href,
              icon: defaults.icon,
              ...child.props,
              navKey,
            },
      }
    }
    if (child.type === 'account') {
      return { ...child, variant: 'AccountGroceryV1', label: 'Profile Card' }
    }
    return child
  })

  const requiredSingles: HeaderChildType[] = [
    'logo',
    'search',
    'account',
    'themeToggle',
    'cart',
    'groceryBarStyle',
  ]

  for (const type of requiredSingles) {
    if (!existing.some((c) => c.type === type)) {
      const groceryMeta = GROCERY_CHILD_META[type]
      existing.push(
        createHeaderChild(type, store, {
          variant: groceryMeta?.variant ?? HEADER_CHILD_META[type].variant,
          label: groceryMeta?.label ?? HEADER_CHILD_META[type].label,
        }),
      )
    }
  }

  const groceryChildren = sortGroceryHeaderChildren(
    existing.filter((c) => {
      if (c.type === 'navLink') return true
      return GROCERY_HEADER_CHILD_TYPES.includes(c.type as GroceryHeaderChildType)
    }),
  )

  return { ...node, children: groceryChildren }
}

function createBistroNavLink(navKey: BistroNavKey, store: StoreData): PageNode {
  const defaults = DEFAULT_BISTRO_NAV_LINKS[navKey]
  return {
    id: headerChildId(`navLink-${navKey}`),
    type: 'navLink',
    variant: 'BistroNavLinkV1',
    label: getBistroNavLinkLabel(navKey),
    props: {
      navKey,
      label: defaults.label,
      href: defaults.href,
    },
  }
}

function dedupeBistroNavLinks(existing: PageNode[], store: StoreData): PageNode[] {
  const rest = existing.filter((c) => c.type !== 'navLink' || !BISTRO_NAV_KEYS.includes(c.props?.navKey as BistroNavKey))
  const navLinks = existing.filter((c) => c.type === 'navLink' && BISTRO_NAV_KEYS.includes(c.props?.navKey as BistroNavKey))
  const byKey = new Map<BistroNavKey, PageNode>()
  const unassigned: PageNode[] = []

  for (const link of navLinks) {
    const key = link.props?.navKey as BistroNavKey
    if (key && BISTRO_NAV_KEYS.includes(key)) {
      if (!byKey.has(key)) byKey.set(key, link)
    } else {
      unassigned.push(link)
    }
  }

  for (const navKey of BISTRO_NAV_KEYS) {
    if (byKey.has(navKey)) continue
    const orphan = unassigned.shift()
    if (orphan) {
      const defaults = DEFAULT_BISTRO_NAV_LINKS[navKey]
      byKey.set(navKey, {
        ...orphan,
        variant: 'BistroNavLinkV1',
        label: getBistroNavLinkLabel(navKey),
        props: { ...orphan.props, navKey, label: defaults.label, href: defaults.href },
      })
    }
  }

  const finalNavLinks = BISTRO_NAV_KEYS.map((navKey) => byKey.get(navKey) ?? createBistroNavLink(navKey, store))
  return [...rest, ...finalNavLinks]
}

function ensureBistroHeaderChildren(
  node: PageNode,
  store: StoreData,
  options?: EnsureHeaderOptions,
): PageNode {
  const resetChildProps = options?.resetChildProps ?? false
  let existing = dedupeBistroNavLinks(
    [...(node.children ?? [])].filter(
      (c) =>
        !['themeToggle', 'groceryBarStyle', 'address', 'deals', 'headerStyle'].includes(c.type) &&
        !(c.type === 'navLink' && GROCERY_NAV_KEYS.includes(c.props?.navKey as GroceryNavKey)),
    ),
    store,
  )

  existing = existing.map((child) => {
    const bistroMeta = BISTRO_CHILD_META[child.type as HeaderChildType]
    if (child.type === 'navLink' && child.props?.navKey) {
      const navKey = child.props.navKey as BistroNavKey
      const defaults = DEFAULT_BISTRO_NAV_LINKS[navKey]
      return {
        ...child,
        variant: 'BistroNavLinkV1',
        label: getBistroNavLinkLabel(navKey, child.label),
        props: resetChildProps
          ? getDefaultPropsForNode(
              { ...child, variant: 'BistroNavLinkV1', props: { navKey, label: defaults.label, href: defaults.href } },
              store,
            )
          : { label: defaults.label, href: defaults.href, ...child.props, navKey },
      }
    }
    if (bistroMeta) {
      return {
        ...child,
        variant: bistroMeta.variant,
        label: bistroMeta.label,
        props: resetChildProps
          ? getDefaultPropsForNode({ ...child, variant: bistroMeta.variant }, store)
          : { ...getDefaultNodeProps(child.type, store), ...child.props },
      }
    }
    return child
  })

  const requiredSingles: HeaderChildType[] = [
    'logo',
    'storeName',
    'search',
    'account',
    'menuButton',
    'cart',
    'bistroBarStyle',
  ]

  for (const type of requiredSingles) {
    if (!existing.some((c) => c.type === type)) {
      const bistroMeta = BISTRO_CHILD_META[type]
      existing.push(
        createHeaderChild(type, store, {
          variant: bistroMeta?.variant ?? HEADER_CHILD_META[type].variant,
          label: bistroMeta?.label ?? HEADER_CHILD_META[type].label,
        }),
      )
    }
  }

  const bistroChildren = sortBistroHeaderChildren(
    existing.filter((c) => {
      if (c.type === 'navLink') return BISTRO_NAV_KEYS.includes(c.props?.navKey as BistroNavKey)
      return BISTRO_HEADER_CHILD_TYPES.includes(c.type as BistroHeaderChildType)
    }),
  )

  return { ...node, children: bistroChildren }
}

function ensureGlassHeaderChildren(
  node: PageNode,
  store: StoreData,
  options?: EnsureHeaderOptions,
): PageNode {
  const resetChildProps = options?.resetChildProps ?? false
  let existing = [...(node.children ?? [])].filter(
    (c) => !GLASS_ONLY_EXCLUDE.includes(c.type as (typeof GLASS_ONLY_EXCLUDE)[number]),
  )

  const logoIdx = existing.findIndex((c) => c.type === 'logo')
  if (logoIdx >= 0) {
    const logo = existing[logoIdx]
    const legacyName = logo.props?.storeName
    if (typeof legacyName === 'string' && legacyName.trim() && !existing.some((c) => c.type === 'storeName')) {
      existing.splice(logoIdx + 1, 0, {
        id: headerChildId('storeName'),
        type: 'storeName',
        variant: 'StoreNameV1',
        label: 'Store Name',
        props: { text: legacyName },
      })
    }
    if (logo.props && 'storeName' in logo.props) {
      const { storeName: _removed, ...rest } = logo.props as Record<string, unknown>
      existing[logoIdx] = { ...logo, label: 'Logo', props: rest }
    }
  }

  existing = existing.map((child) => {
    if (child.type === 'account') {
      return { ...child, variant: 'AccountV1', label: 'Account / Login' }
    }
    return child
  })

  const glassTypes = GLASS_HEADER_CHILD_TYPES
  const byType = new Map<string, PageNode>()
  for (const child of existing) {
    if (glassTypes.includes(child.type as GlassHeaderChildType) && !byType.has(child.type)) {
      byType.set(child.type, child)
    }
  }

  const ordered: PageNode[] = glassTypes.map((type) => {
    if (byType.has(type)) {
      const child = byType.get(type)!
      return {
        ...child,
        label: HEADER_CHILD_META[type as HeaderChildType]?.label ?? child.label,
        props: resetChildProps
          ? getDefaultNodeProps(type, store)
          : { ...getDefaultNodeProps(type, store), ...child.props },
      }
    }
    return createHeaderChild(type as HeaderChildType, store)
  })

  let next: PageNode = { ...node, children: ordered }

  if (node.props && 'isLoggedIn' in node.props) {
    const legacyLoggedIn = Boolean(node.props.isLoggedIn)
    next = {
      ...next,
      children: next.children?.map((child) =>
        child.type === 'account'
          ? { ...child, props: { ...child.props, isLoggedIn: legacyLoggedIn } }
          : child,
      ),
    }
    const { isLoggedIn: _removed, ...rest } = node.props as Record<string, unknown>
    next = { ...next, props: Object.keys(rest).length > 0 ? rest : {} }
  }

  return next
}

export function ensureHeaderChildren(
  node: PageNode,
  store: StoreData,
  options?: EnsureHeaderOptions,
): PageNode {
  if (node.type !== 'header') return node
  if (node.variant === 'HeaderV1') return ensureGroceryHeaderChildren(node, store, options)
  if (node.variant === 'HeaderV3') return ensureBistroHeaderChildren(node, store, options)
  return ensureGlassHeaderChildren(node, store, options)
}

export function defaultHeaderChildren(store: StoreData): PageNode[] {
  return HEADER_CHILD_ORDER.map((type) => createHeaderChild(type, store))
}
