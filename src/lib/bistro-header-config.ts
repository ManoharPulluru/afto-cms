import type { PropField } from '@/lib/registry'

export const BISTRO_NAV_KEYS = ['weeklyDeals', 'ourSpecials', 'rewardPoints', 'coupons'] as const
export type BistroNavKey = (typeof BISTRO_NAV_KEYS)[number]

export const BISTRO_NAV_SLOT: Record<BistroNavKey, 'left' | 'right'> = {
  weeklyDeals: 'left',
  ourSpecials: 'left',
  rewardPoints: 'right',
  coupons: 'right',
}

export const DEFAULT_BISTRO_NAV_LINKS: Record<
  BistroNavKey,
  { label: string; href: string }
> = {
  weeklyDeals: { label: 'Weekly Deals', href: '/collection/weekly-deals' },
  ourSpecials: { label: 'Our Specials', href: '/#our-specialties' },
  rewardPoints: { label: 'Reward Points', href: '/account/loyalty' },
  coupons: { label: 'Coupons', href: '/account/coupons' },
}

export const BISTRO_HEADER_CHILD_TYPES = [
  'logo',
  'storeName',
  'navLink',
  'menuButton',
  'search',
  'account',
  'cart',
  'bistroBarStyle',
] as const

export type BistroHeaderChildType = (typeof BISTRO_HEADER_CHILD_TYPES)[number]

export const BISTRO_DISPLAY_ORDER: Record<string, number> = {
  logo: 0,
  storeName: 1,
  navLink: 2,
  menuButton: 3,
  search: 4,
  account: 5,
  cart: 6,
  bistroBarStyle: 7,
}

const BISTRO_FIELDS: Record<string, PropField[]> = {
  logo: [
    { key: 'imageUrl', label: 'Logo URL', type: 'url' },
    { key: 'desktopSize', label: 'Desktop size (px)', type: 'number' },
    { key: 'mobileSize', label: 'Mobile size (px)', type: 'number' },
    { key: 'hoverScale', label: 'Hover scale (1 = none)', type: 'number' },
  ],
  storeName: [
    { key: 'text', label: 'Store name', type: 'text' },
    { key: 'tagline', label: 'Tagline (mobile)', type: 'text' },
    { key: 'nameColor', label: 'Name color', type: 'color' },
    { key: 'taglineColor', label: 'Tagline color', type: 'color' },
    { key: 'nameFontSize', label: 'Mobile name size (px)', type: 'number' },
    { key: 'taglineFontSize', label: 'Mobile tagline size (px)', type: 'number' },
    { key: 'letterSpacing', label: 'Letter spacing (em)', type: 'number' },
  ],
  navLink: [
    { key: 'label', label: 'Link text', type: 'text' },
    { key: 'href', label: 'Redirect URL', type: 'text' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'hoverColor', label: 'Hover text color', type: 'color' },
    { key: 'underlineColor', label: 'Underline color', type: 'color' },
    { key: 'fontSize', label: 'Font size min (px)', type: 'number' },
    { key: 'letterSpacing', label: 'Letter spacing (em)', type: 'number' },
    { key: 'visible', label: 'Visible', type: 'boolean' },
  ],
  menuButton: [
    { key: 'label', label: 'Desktop label', type: 'text' },
    { key: 'mobileLabel', label: 'Mobile label', type: 'text' },
    { key: 'href', label: 'Link URL', type: 'text' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'borderColor', label: 'Border color', type: 'color' },
    { key: 'visible', label: 'Visible', type: 'boolean' },
  ],
  search: [
    { key: 'icon', label: 'Search icon', type: 'icon' },
    { key: 'iconColor', label: 'Icon color', type: 'color' },
    { key: 'hoverColor', label: 'Hover color', type: 'color' },
    { key: 'iconSize', label: 'Desktop icon size (px)', type: 'number' },
    { key: 'mobileIconSize', label: 'Mobile icon size (px)', type: 'number' },
  ],
  account: [
    { key: 'icon', label: 'Profile icon', type: 'icon' },
    { key: 'iconColor', label: 'Icon color', type: 'color' },
    { key: 'hoverColor', label: 'Hover color', type: 'color' },
    { key: 'iconSize', label: 'Icon size (px)', type: 'number' },
  ],
  cart: [
    { key: 'cartTotal', label: 'Cart total', type: 'text' },
    { key: 'cartCount', label: 'Item count', type: 'number' },
    { key: 'showCount', label: 'Show count badge', type: 'boolean' },
    { key: 'showTotal', label: 'Show total price', type: 'boolean' },
    { key: 'icon', label: 'Cart icon', type: 'icon' },
    { key: 'textColor', label: 'Text / icon color', type: 'color' },
    { key: 'borderColor', label: 'Border color', type: 'color' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'badgeBg', label: 'Badge background', type: 'color' },
    { key: 'badgeTextColor', label: 'Badge text color', type: 'color' },
    { key: 'label', label: 'Fallback label', type: 'text' },
  ],
  bistroBarStyle: [
    { key: 'backgroundColor', label: 'Desktop bar background', type: 'color' },
    { key: 'backgroundOpacity', label: 'Desktop opacity (0–100)', type: 'number' },
    { key: 'borderColor', label: 'Desktop border color', type: 'color' },
    { key: 'accentColor', label: 'Accent color', type: 'color' },
    { key: 'minHeightDesktop', label: 'Desktop height (px)', type: 'number' },
    { key: 'minHeightMobile', label: 'Mobile height (px)', type: 'number' },
    { key: 'mobileBackgroundColor', label: 'Mobile background', type: 'color' },
    { key: 'mobileBorderColor', label: 'Mobile border color', type: 'color' },
    { key: 'rightNavPadding', label: 'Right nav padding (px)', type: 'number' },
    { key: 'dividerColor', label: 'Actions divider color', type: 'color' },
  ],
}

export function getBistroHeaderFields(childType: string): PropField[] {
  return BISTRO_FIELDS[childType] ?? []
}

export function getBistroHeaderFieldKeys(childType: string): string[] {
  return getBistroHeaderFields(childType).map((f) => f.key)
}

export function getBistroNavLinkLabel(navKey: string, fallback = 'Nav Link'): string {
  const defaults = DEFAULT_BISTRO_NAV_LINKS[navKey as BistroNavKey]
  return defaults ? `Nav · ${defaults.label}` : fallback
}

export function sortBistroHeaderChildren<T extends { type: string; props?: Record<string, unknown> }>(
  children: T[],
): T[] {
  return [...children].sort((a, b) => {
    const ao = BISTRO_DISPLAY_ORDER[a.type] ?? 99
    const bo = BISTRO_DISPLAY_ORDER[b.type] ?? 99
    if (ao !== bo) return ao - bo
    if (a.type === 'navLink' && b.type === 'navLink') {
      const ak = BISTRO_NAV_KEYS.indexOf(a.props?.navKey as BistroNavKey)
      const bk = BISTRO_NAV_KEYS.indexOf(b.props?.navKey as BistroNavKey)
      return ak - bk
    }
    return 0
  })
}

export function bistroNavSlot(navKey: string): 'left' | 'right' {
  return BISTRO_NAV_SLOT[navKey as BistroNavKey] ?? 'left'
}
