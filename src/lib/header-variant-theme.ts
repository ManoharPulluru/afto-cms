import type { PropField } from '@/lib/registry'
import type { PageNode, StoreData } from '@/lib/types/store'

export type HeaderColorScheme = 'light' | 'dark'

export type HeaderVariantThemeBar = {
  backgroundColor: string
  backgroundOpacity: number
  borderColor: string
  accentColor: string
  blur?: boolean
  boxShadow?: string
  mobileBackgroundColor?: string
  mobileSearchBg?: string
  minHeightDesktop?: number
  minHeightMobile?: number
  rightNavPadding?: number
  dividerColor?: string
  mobileBorderColor?: string
}

export type HeaderVariantTheme = {
  colorScheme: HeaderColorScheme
  applySchemeToContent: boolean
  bar: HeaderVariantThemeBar
  content: Record<string, Record<string, unknown>>
}

const DEFAULT_SCHEME: Record<string, HeaderColorScheme> = {
  HeaderV1: 'light',
  HeaderV2: 'light',
  HeaderV3: 'dark',
}

/** Props overridden by color scheme when applySchemeToContent is on */
export const SCHEME_THEME_KEYS: Record<string, string[]> = {
  navLink: ['textColor', 'hoverColor', 'iconColor', 'underlineColor'],
  search: [
    'backgroundColor',
    'borderColor',
    'textColor',
    'placeholderColor',
    'iconColor',
    'mobileSearchIconColor',
    'hoverColor',
  ],
  account: ['iconColor', 'nameColor', 'hoverColor', 'nameColor', 'subtitleColor', 'chevronColor', 'hoverBg'],
  cart: ['textColor', 'backgroundColor', 'borderColor', 'mobileIconColor', 'badgeTextColor'],
  storeName: ['textColor', 'nameColor', 'taglineColor'],
  address: ['textColor', 'mobileTextColor', 'iconColor'],
  menuButton: ['textColor', 'backgroundColor', 'borderColor'],
  themeToggle: ['backgroundColor', 'knobColor', 'iconColor'],
}

const SHARED_FIELDS: PropField[] = [
  {
    key: 'colorScheme',
    label: 'Color scheme',
    type: 'select',
    options: [
      { value: 'light', label: 'Light bar · dark content' },
      { value: 'dark', label: 'Dark bar · light content' },
    ],
  },
  { key: 'applySchemeToContent', label: 'Sync part colors with scheme', type: 'boolean' },
  { key: 'backgroundColor', label: 'Bar background', type: 'color' },
  { key: 'backgroundOpacity', label: 'Bar opacity (0–100)', type: 'number' },
  { key: 'borderColor', label: 'Border color', type: 'color' },
  { key: 'accentColor', label: 'Accent color', type: 'color' },
]

export const HEADER_VARIANT_FIELDS: Record<string, PropField[]> = {
  HeaderV1: [
    ...SHARED_FIELDS,
    { key: 'mobileSearchBg', label: 'Mobile search strip bg', type: 'color' },
  ],
  HeaderV2: [
    ...SHARED_FIELDS,
    { key: 'blur', label: 'Backdrop blur', type: 'boolean' },
    { key: 'boxShadow', label: 'Box shadow', type: 'text' },
  ],
  HeaderV3: [
    ...SHARED_FIELDS,
    { key: 'mobileBackgroundColor', label: 'Mobile bar background', type: 'color' },
    { key: 'mobileBorderColor', label: 'Mobile border color', type: 'color' },
    { key: 'minHeightDesktop', label: 'Desktop height (px)', type: 'number' },
    { key: 'minHeightMobile', label: 'Mobile height (px)', type: 'number' },
    { key: 'rightNavPadding', label: 'Right nav padding (px)', type: 'number' },
    { key: 'dividerColor', label: 'Actions divider color', type: 'color' },
  ],
}

export function getHeaderVariantFields(variantId: string): PropField[] {
  return HEADER_VARIANT_FIELDS[variantId] ?? SHARED_FIELDS
}

function pickString(props: Record<string, unknown>, key: string, fallback: string): string {
  const v = props[key]
  return typeof v === 'string' && v.trim() ? v : fallback
}

function pickNumber(props: Record<string, unknown>, key: string, fallback: number): number {
  const v = props[key]
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string' && v.trim() !== '') {
    const n = parseFloat(v)
    if (!Number.isNaN(n)) return n
  }
  return fallback
}

export function hexWithOpacity(hex: string, opacityPct: number): string {
  const clean = hex.replace('#', '').slice(0, 6)
  if (clean.length !== 6) return hex
  const alpha = Math.round(Math.min(100, Math.max(0, opacityPct)) * 2.55)
    .toString(16)
    .padStart(2, '0')
  return `#${clean}${alpha}`
}

export function opacityForScheme(scheme: HeaderColorScheme): number {
  return scheme === 'light' ? 100 : 0
}

export function getSchemePreset(variant: string, scheme: HeaderColorScheme): SchemePreset {
  return PRESETS[variant]?.[scheme] ?? PRESETS.HeaderV1.light
}

/** Bar background: opacity 0 uses backgroundColor as-is (rgba); otherwise apply hex alpha. */
export function resolveBarBackgroundColor(bar: HeaderVariantThemeBar): string {
  const { backgroundColor, backgroundOpacity } = bar
  if (backgroundOpacity <= 0) return backgroundColor
  if (backgroundOpacity >= 100) {
    if (backgroundColor.startsWith('rgba') || backgroundColor.startsWith('rgb')) {
      return backgroundColor
    }
    return backgroundColor
  }
  return hexWithOpacity(backgroundColor, backgroundOpacity)
}

/** Appearance props when switching color scheme (does not merge prior variant fields). */
export function getHeaderPropsForScheme(
  variant: string,
  scheme: HeaderColorScheme,
  store: StoreData,
): Record<string, unknown> {
  const preset = getSchemePreset(variant, scheme)
  const accent = store.store.primaryColor ?? (variant === 'HeaderV3' ? '#EFB21B' : variant === 'HeaderV1' ? '#6bb252' : '#F97316')
  return {
    colorScheme: scheme,
    applySchemeToContent: true,
    backgroundColor: preset.bar.backgroundColor ?? '#ffffff',
    backgroundOpacity: opacityForScheme(scheme),
    borderColor: preset.bar.borderColor ?? '#e5e7eb',
    accentColor: accent,
    blur: preset.bar.blur ?? true,
    boxShadow: preset.bar.boxShadow ?? '0 4px 20px rgba(0, 0, 0, 0.1)',
    mobileSearchBg: preset.bar.mobileSearchBg,
    mobileBackgroundColor: preset.bar.mobileBackgroundColor,
    mobileBorderColor: preset.bar.mobileBorderColor,
    minHeightDesktop: preset.bar.minHeightDesktop ?? 88,
    minHeightMobile: preset.bar.minHeightMobile ?? 58,
    rightNavPadding: preset.bar.rightNavPadding ?? 280,
    dividerColor: preset.bar.dividerColor,
  }
}

type SchemePreset = {
  bar: Partial<HeaderVariantThemeBar>
  content: Record<string, Record<string, unknown>>
}

const PRESETS: Record<string, Record<HeaderColorScheme, SchemePreset>> = {
  HeaderV1: {
    light: {
      bar: {
        backgroundColor: '#ffffff',
        borderColor: '#e5ebe0',
        mobileSearchBg: '#f0f4ec',
      },
      content: {
        navLink: { textColor: '#4b5563', hoverColor: '#6bb252', iconColor: '#4b5563' },
        search: {
          backgroundColor: '#f4f6f0',
          borderColor: '#e2eacc',
          textColor: '#0f1419',
          placeholderColor: '#9ca3af',
          iconColor: '#1a1f2e',
          mobileSearchIconColor: '#0f1419',
        },
        account: { nameColor: '#374151', iconColor: '#6b7280', hoverBg: 'rgba(0,0,0,0.04)' },
        cart: { backgroundColor: '#6bb252', textColor: '#ffffff', borderColor: '#6bb25230' },
      },
    },
    dark: {
      bar: {
        backgroundColor: 'rgba(18, 18, 18, 1)',
        borderColor: '#2a2a2a',
        mobileSearchBg: '#1a1a1a',
      },
      content: {
        navLink: { textColor: 'rgba(245, 240, 232, 0.72)', hoverColor: '#f5f0e8', iconColor: 'rgba(245, 240, 232, 0.72)' },
        search: {
          backgroundColor: '#1f1f1f',
          borderColor: '#333333',
          textColor: '#f5f0e8',
          placeholderColor: '#888888',
          iconColor: 'rgba(245,240,232,0.65)',
          mobileSearchIconColor: 'rgba(245,240,232,0.65)',
        },
        account: { nameColor: '#f5f0e8', iconColor: 'rgba(245,240,232,0.65)', hoverBg: 'rgba(255,255,255,0.06)' },
        cart: { backgroundColor: '#6bb252', textColor: '#ffffff', borderColor: '#6bb25250' },
      },
    },
  },
  HeaderV2: {
    light: {
      bar: {
        backgroundColor: '#ffffff',
        borderColor: '',
        blur: true,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
      content: {
        storeName: { textColor: '#0F1419' },
        address: { textColor: '#1A1F2E', mobileTextColor: '#1A1F2E', iconColor: '#1A1F2E' },
        search: {
          backgroundColor: '#f8faf9',
          borderColor: '#e8f5e8',
          textColor: '#0f1419',
          placeholderColor: '#9ca3af',
          iconColor: '#1a1f2e',
          mobileSearchIconColor: '#1A1F2E',
        },
        account: {
          nameColor: '#0F1419',
          subtitleColor: '#1A1F2E',
          chevronColor: '#1A1F2E',
          backgroundColor: 'rgba(248, 250, 249, 0.5)',
          borderColor: 'rgba(232, 245, 232, 0.25)',
        },
        cart: { backgroundColor: '#F97316', textColor: '#ffffff', mobileIconColor: '#0F1419' },
      },
    },
    dark: {
      bar: {
        backgroundColor: 'rgba(12, 12, 12, 0.88)',
        borderColor: '',
        blur: true,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.45)',
      },
      content: {
        storeName: { textColor: '#f5f0e8' },
        address: { textColor: 'rgba(245,240,232,0.75)', mobileTextColor: 'rgba(245,240,232,0.75)', iconColor: 'rgba(245,240,232,0.65)' },
        search: {
          backgroundColor: '#1a1a1a',
          borderColor: '#333333',
          textColor: '#f5f0e8',
          placeholderColor: '#888888',
          iconColor: 'rgba(245,240,232,0.65)',
          mobileSearchIconColor: 'rgba(245,240,232,0.65)',
        },
        account: {
          nameColor: '#f5f0e8',
          subtitleColor: 'rgba(245,240,232,0.65)',
          chevronColor: 'rgba(245,240,232,0.65)',
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderColor: 'rgba(255,255,255,0.1)',
        },
        cart: { backgroundColor: '#F97316', textColor: '#ffffff', mobileIconColor: 'rgba(245,240,232,0.75)' },
      },
    },
  },
  HeaderV3: {
    light: {
      bar: {
        backgroundColor: '#ffffff',
        borderColor: 'rgba(0,0,0,0.08)',
        mobileBackgroundColor: '#f7f7f7',
        mobileBorderColor: 'rgba(0,0,0,0.12)',
        dividerColor: 'rgba(0,0,0,0.12)',
      },
      content: {
        navLink: { textColor: 'rgba(12, 12, 12, 0.65)', hoverColor: '#0c0c0c', underlineColor: '#EFB21B' },
        storeName: { nameColor: '#0c0c0c', taglineColor: '#b45309' },
        search: { iconColor: 'rgba(12,12,12,0.55)', hoverColor: '#0c0c0c' },
        account: { iconColor: 'rgba(12,12,12,0.55)', hoverColor: '#0c0c0c' },
        menuButton: { textColor: '#0c0c0c', backgroundColor: '#EFB21B', borderColor: '#EFB21B' },
        cart: { textColor: '#EFB21B', borderColor: '#EFB21B', backgroundColor: 'transparent', badgeTextColor: '#0c0c0c' },
      },
    },
    dark: {
      bar: {
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        borderColor: 'rgba(239,178,27,0.08)',
        mobileBackgroundColor: '#0c0c0c',
        mobileBorderColor: 'rgba(239,178,27,0.25)',
        dividerColor: 'rgba(239,178,27,0.25)',
      },
      content: {
        navLink: { textColor: 'rgba(245, 240, 232, 0.6)', hoverColor: '#f5f0e8', underlineColor: '#EFB21B' },
        storeName: { nameColor: '#f5f0e8', taglineColor: '#EFB21B' },
        search: { iconColor: 'rgba(245,240,232,0.65)', hoverColor: '#f5f0e8' },
        account: { iconColor: 'rgba(245,240,232,0.65)', hoverColor: '#f5f0e8' },
        menuButton: { textColor: '#0c0c0c', backgroundColor: '#EFB21B', borderColor: '#EFB21B' },
        cart: { textColor: '#EFB21B', borderColor: '#EFB21B', backgroundColor: 'transparent', badgeTextColor: '#0c0c0c' },
      },
    },
  },
}

export function getDefaultHeaderVariantProps(variant: string, store: StoreData): Record<string, unknown> {
  const scheme = DEFAULT_SCHEME[variant] ?? 'light'
  return getHeaderPropsForScheme(variant, scheme, store)
}

export const HEADER_META_KEYS = ['appearanceByVariant', 'childrenByVariant'] as const

export type HeaderAppearanceByVariant = Record<string, Record<string, unknown>>
export type HeaderChildrenByVariant = Record<string, PageNode[]>

/** Strip internal per-variant storage from header props. */
export function stripHeaderMeta(props: Record<string, unknown>): Record<string, unknown> {
  const next = { ...props }
  for (const key of HEADER_META_KEYS) delete next[key]
  return next
}

/** Active appearance props for a header variant (flat props used by the renderer). */
export function resolveHeaderAppearanceProps(
  props: Record<string, unknown>,
  variant: string,
  store: StoreData,
): Record<string, unknown> {
  const defaults = getDefaultHeaderVariantProps(variant, store)
  const byVariant = props.appearanceByVariant as HeaderAppearanceByVariant | undefined
  const saved = byVariant?.[variant]
  const accent = store.store.primaryColor ?? (defaults.accentColor as string)
  return {
    ...defaults,
    ...saved,
    accentColor:
      typeof saved?.accentColor === 'string' && saved.accentColor.trim()
        ? saved.accentColor
        : typeof props.accentColor === 'string' && props.accentColor.trim() && !saved
          ? props.accentColor
          : accent,
  }
}

export function snapshotHeaderAppearance(
  props: Record<string, unknown>,
  variant: string,
): HeaderAppearanceByVariant {
  const existing = (props.appearanceByVariant as HeaderAppearanceByVariant | undefined) ?? {}
  return { ...existing, [variant]: stripHeaderMeta(props) }
}

export function switchHeaderVariantState(
  node: PageNode,
  nextVariant: string,
  store: StoreData,
): Pick<PageNode, 'props' | 'children'> {
  const currentVariant = node.variant
  const props = node.props ?? {}
  const appearanceByVariant = snapshotHeaderAppearance(props, currentVariant)
  const childrenByVariant: HeaderChildrenByVariant = {
    ...((props.childrenByVariant as HeaderChildrenByVariant | undefined) ?? {}),
    [currentVariant]: node.children ?? [],
  }

  const savedAppearance = appearanceByVariant[nextVariant]
  const savedChildren = childrenByVariant[nextVariant]
  const nextAppearance = savedAppearance ?? getDefaultHeaderVariantProps(nextVariant, store)

  return {
    props: {
      ...nextAppearance,
      appearanceByVariant,
      childrenByVariant,
    },
    children: savedChildren,
  }
}

export function resolveHeaderVariantTheme(
  variant: string,
  headerProps: Record<string, unknown>,
  store: StoreData,
  _childNodes?: PageNode[],
): HeaderVariantTheme {
  const flatProps = stripHeaderMeta(headerProps)
  const colorScheme = (flatProps.colorScheme as HeaderColorScheme) || DEFAULT_SCHEME[variant] || 'light'
  const preset = PRESETS[variant]?.[colorScheme] ?? PRESETS.HeaderV1.light
  const applySchemeToContent = flatProps.applySchemeToContent !== false
  const accentFallback =
    store.store.primaryColor ?? (variant === 'HeaderV3' ? '#EFB21B' : variant === 'HeaderV1' ? '#6bb252' : '#F97316')

  const accent = pickString(flatProps, 'accentColor', accentFallback)
  const borderFallback =
    preset.bar.borderColor ||
    (variant === 'HeaderV2' ? `${accent}20` : variant === 'HeaderV3' ? `${accent}14` : '#e5e7eb')

  const bar: HeaderVariantThemeBar = {
    backgroundColor: pickString(flatProps, 'backgroundColor', preset.bar.backgroundColor ?? '#ffffff'),
    backgroundOpacity: pickNumber(flatProps, 'backgroundOpacity', opacityForScheme(colorScheme)),
    borderColor: pickString(flatProps, 'borderColor', borderFallback),
    accentColor: accent,
    blur: flatProps.blur !== undefined ? flatProps.blur !== false : (preset.bar.blur ?? true),
    boxShadow: pickString(flatProps, 'boxShadow', preset.bar.boxShadow ?? ''),
    mobileSearchBg: pickString(flatProps, 'mobileSearchBg', preset.bar.mobileSearchBg ?? '#f0f4ec'),
    mobileBackgroundColor: pickString(
      flatProps,
      'mobileBackgroundColor',
      preset.bar.mobileBackgroundColor ?? '#0c0c0c',
    ),
    mobileBorderColor: pickString(
      flatProps,
      'mobileBorderColor',
      preset.bar.mobileBorderColor ?? `${accent}40`,
    ),
    minHeightDesktop: pickNumber(flatProps, 'minHeightDesktop', preset.bar.minHeightDesktop ?? 88),
    minHeightMobile: pickNumber(flatProps, 'minHeightMobile', preset.bar.minHeightMobile ?? 58),
    rightNavPadding: pickNumber(flatProps, 'rightNavPadding', preset.bar.rightNavPadding ?? 280),
    dividerColor: pickString(flatProps, 'dividerColor', preset.bar.dividerColor ?? `${accent}40`),
  }

  const content: Record<string, Record<string, unknown>> = {}
  for (const [childType, values] of Object.entries(preset.content)) {
    content[childType] = { ...values, accentColor: accent }
  }

  return { colorScheme, applySchemeToContent, bar, content }
}

export function mergeThemedHeaderChildProps(
  theme: HeaderVariantTheme | undefined,
  childType: string,
  nodeProps: Record<string, unknown>,
  extra?: Record<string, unknown>,
): Record<string, unknown> {
  const merged = { ...nodeProps, ...extra }
  if (!theme?.applySchemeToContent) return merged

  const schemeDefaults = theme.content[childType]
  if (!schemeDefaults) return merged

  const keys = SCHEME_THEME_KEYS[childType] ?? Object.keys(schemeDefaults)
  for (const key of keys) {
    if (schemeDefaults[key] !== undefined) {
      merged[key] = schemeDefaults[key]
    }
  }
  if (theme.bar.accentColor) {
    merged.accentColor = theme.bar.accentColor
  }
  return merged
}
