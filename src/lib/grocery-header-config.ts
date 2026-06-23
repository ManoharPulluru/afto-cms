import type { PropField } from '@/lib/registry'

export const GROCERY_NAV_KEYS = ['home', 'orders', 'rewards', 'coupons'] as const
export type GroceryNavKey = (typeof GROCERY_NAV_KEYS)[number]

export const GROCERY_NAV_KEY_ORDER: Record<GroceryNavKey, number> = {
  home: 0,
  orders: 1,
  rewards: 2,
  coupons: 3,
}

export const DEFAULT_GROCERY_NAV_LINKS: Record<
  GroceryNavKey,
  { label: string; href: string; icon: string }
> = {
  home: { label: 'Home', href: '/', icon: 'solar:home-2-linear' },
  orders: { label: 'Orders', href: '/orders', icon: 'solar:clipboard-list-linear' },
  rewards: { label: 'Rewards', href: '#rewards', icon: 'solar:medal-ribbon-linear' },
  coupons: { label: 'Coupons', href: '#coupons', icon: 'solar:ticket-linear' },
}

/** Child types shown under Grocery Nav Bar in the navigator. */
export const GROCERY_HEADER_CHILD_TYPES = [
  'logo',
  'search',
  'navLink',
  'account',
  'themeToggle',
  'cart',
  'groceryBarStyle',
] as const

export type GroceryHeaderChildType = (typeof GROCERY_HEADER_CHILD_TYPES)[number]

const GROCERY_FIELDS: Record<GroceryHeaderChildType, PropField[]> = {
  logo: [{ key: 'imageUrl', label: 'Logo URL', type: 'url' }],
  search: [
    { key: 'placeholder', label: 'Placeholder', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'borderColor', label: 'Border color', type: 'color' },
    { key: 'borderWidth', label: 'Border width (px)', type: 'number' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'placeholderColor', label: 'Placeholder color', type: 'color' },
    { key: 'icon', label: 'Search icon', type: 'icon' },
    { key: 'iconColor', label: 'Icon color', type: 'color' },
  ],
  navLink: [
    { key: 'label', label: 'Link text', type: 'text' },
    { key: 'href', label: 'Redirect URL', type: 'text' },
    { key: 'icon', label: 'Icon', type: 'icon' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'hoverColor', label: 'Hover color', type: 'color' },
    { key: 'iconColor', label: 'Icon color', type: 'color' },
    { key: 'fontSize', label: 'Font size (px)', type: 'number' },
    { key: 'visible', label: 'Visible', type: 'boolean' },
  ],
  account: [
    { key: 'isLoggedIn', label: 'Logged in', type: 'boolean' },
    { key: 'showAvatar', label: 'Show profile photo (DP)', type: 'boolean' },
    { key: 'userName', label: 'Display name', type: 'text' },
    { key: 'avatarUrl', label: 'Profile photo URL', type: 'url' },
    { key: 'avatarBg', label: 'Avatar background', type: 'color' },
    { key: 'avatarTextColor', label: 'Avatar initial color', type: 'color' },
    { key: 'nameColor', label: 'Name color', type: 'color' },
    { key: 'iconColor', label: 'Icon color (logged out)', type: 'color' },
    { key: 'loggedOutIcon', label: 'Logged-out icon', type: 'icon' },
    { key: 'hoverBg', label: 'Hover background', type: 'color' },
  ],
  themeToggle: [
    { key: 'backgroundColor', label: 'Track background', type: 'color' },
    { key: 'knobColor', label: 'Knob color', type: 'color' },
    { key: 'icon', label: 'Icon', type: 'icon' },
    { key: 'iconColor', label: 'Icon color', type: 'color' },
  ],
  cart: [
    { key: 'label', label: 'Button text', type: 'text' },
    { key: 'icon', label: 'Icon', type: 'icon' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'cartCount', label: 'Item count', type: 'number' },
    { key: 'cartTotal', label: 'Cart total', type: 'text' },
    { key: 'showCount', label: 'Show item badge', type: 'boolean' },
    { key: 'showTotal', label: 'Show total price', type: 'boolean' },
  ],
  groceryBarStyle: [
    { key: 'backgroundColor', label: 'Bar background', type: 'color' },
    { key: 'borderColor', label: 'Border color', type: 'color' },
    { key: 'mobileSearchBg', label: 'Mobile search strip bg', type: 'color' },
  ],
}

export function getGroceryHeaderFields(childType: string): PropField[] {
  return GROCERY_FIELDS[childType as GroceryHeaderChildType] ?? []
}

export function getGroceryHeaderFieldKeys(childType: string): string[] {
  return getGroceryHeaderFields(childType).map((f) => f.key)
}

export function getGroceryNavLinkLabel(navKey: string, fallback = 'Nav Link'): string {
  const defaults = DEFAULT_GROCERY_NAV_LINKS[navKey as GroceryNavKey]
  return defaults ? `Nav · ${defaults.label}` : fallback
}
