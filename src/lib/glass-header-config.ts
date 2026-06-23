import type { PropField } from '@/lib/registry'

/** Child types shown under Glass Storefront in the navigator. */
export const GLASS_HEADER_CHILD_TYPES = [
  'logo',
  'storeName',
  'address',
  'search',
  'deals',
  'account',
  'cart',
  'headerStyle',
] as const

export type GlassHeaderChildType = (typeof GLASS_HEADER_CHILD_TYPES)[number]

export const GLASS_DISPLAY_ORDER: Record<GlassHeaderChildType, number> = {
  logo: 0,
  storeName: 1,
  address: 2,
  search: 3,
  deals: 4,
  account: 5,
  cart: 6,
  headerStyle: 7,
}

const GLASS_FIELDS: Record<GlassHeaderChildType, PropField[]> = {
  logo: [{ key: 'imageUrl', label: 'Logo URL', type: 'url' }],
  storeName: [
    { key: 'text', label: 'Store name', type: 'text' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'fontSize', label: 'Font size desktop (px)', type: 'number' },
    { key: 'mobileFontSize', label: 'Font size mobile (px)', type: 'number' },
  ],
  address: [
    { key: 'text', label: 'Address / subtitle', type: 'textarea' },
    { key: 'icon', label: 'Location icon', type: 'icon' },
    { key: 'iconColor', label: 'Icon color', type: 'color' },
    { key: 'showIcon', label: 'Show location icon', type: 'boolean' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'mobileTextColor', label: 'Mobile text color', type: 'color' },
    { key: 'fontSize', label: 'Font size (px)', type: 'number' },
  ],
  search: [
    { key: 'placeholder', label: 'Placeholder', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'borderColor', label: 'Border color', type: 'color' },
    { key: 'borderWidth', label: 'Border width (px)', type: 'number' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'placeholderColor', label: 'Placeholder color', type: 'color' },
    { key: 'icon', label: 'Search icon', type: 'icon' },
    { key: 'iconColor', label: 'Icon color', type: 'color' },
    { key: 'mobileSearchIcon', label: 'Mobile bar search icon', type: 'icon' },
    { key: 'mobileSearchIconColor', label: 'Mobile search icon color', type: 'color' },
  ],
  deals: [
    { key: 'label', label: 'Button label', type: 'text' },
    { key: 'visible', label: 'Visible', type: 'boolean' },
    { key: 'icon', label: 'Icon', type: 'icon' },
    { key: 'gradientStart', label: 'Gradient start', type: 'color' },
    { key: 'gradientEnd', label: 'Gradient end', type: 'color' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'borderColor', label: 'Border color', type: 'color' },
  ],
  account: [
    { key: 'isLoggedIn', label: 'Logged in', type: 'boolean' },
    { key: 'userName', label: 'Account name', type: 'text' },
    { key: 'userEmail', label: 'Account email', type: 'text' },
    { key: 'welcomeLabel', label: 'Welcome label (logged out)', type: 'text' },
    { key: 'loginPrompt', label: 'Login prompt (logged out)', type: 'text' },
    { key: 'backgroundColor', label: 'Card background', type: 'color' },
    { key: 'borderColor', label: 'Card border', type: 'color' },
    { key: 'avatarBg', label: 'Avatar background', type: 'color' },
    { key: 'avatarTextColor', label: 'Avatar text color', type: 'color' },
    { key: 'loggedOutIcon', label: 'Logged-out icon', type: 'icon' },
    { key: 'nameColor', label: 'Name color', type: 'color' },
    { key: 'subtitleColor', label: 'Subtitle color', type: 'color' },
    { key: 'chevronColor', label: 'Chevron color', type: 'color' },
  ],
  cart: [
    { key: 'cartTotal', label: 'Cart total', type: 'text' },
    { key: 'cartCount', label: 'Item count', type: 'number' },
    { key: 'showCount', label: 'Show count badge', type: 'boolean' },
    { key: 'icon', label: 'Cart icon', type: 'icon' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'borderColor', label: 'Border color', type: 'color' },
    { key: 'mobileIconColor', label: 'Mobile icon color', type: 'color' },
  ],
  headerStyle: [
    { key: 'backgroundColor', label: 'Bar background', type: 'color' },
    { key: 'backgroundOpacity', label: 'Background opacity (0–100)', type: 'number' },
    { key: 'borderColor', label: 'Border color', type: 'color' },
    { key: 'accentColor', label: 'Accent color', type: 'color' },
    { key: 'blur', label: 'Backdrop blur', type: 'boolean' },
    { key: 'boxShadow', label: 'Box shadow', type: 'text' },
  ],
}

export function getGlassHeaderFields(childType: string): PropField[] {
  return GLASS_FIELDS[childType as GlassHeaderChildType] ?? []
}

export function getGlassHeaderFieldKeys(childType: string): string[] {
  return getGlassHeaderFields(childType).map((f) => f.key)
}

export function sortGlassHeaderChildren<T extends { type: string }>(children: T[]): T[] {
  return [...children].sort((a, b) => {
    const ao = GLASS_DISPLAY_ORDER[a.type as GlassHeaderChildType] ?? 99
    const bo = GLASS_DISPLAY_ORDER[b.type as GlassHeaderChildType] ?? 99
    return ao - bo
  })
}
