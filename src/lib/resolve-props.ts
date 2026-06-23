import type { PageNode, StoreData } from '@/lib/types/store'
import { formatPrice } from '@/lib/utils'
import {
  DEFAULT_GROCERY_NAV_LINKS,
  GROCERY_NAV_KEY_ORDER,
  type GroceryNavKey,
} from '@/lib/grocery-header-config'
import {
  DEFAULT_BISTRO_NAV_LINKS,
  BISTRO_NAV_KEYS,
  type BistroNavKey,
} from '@/lib/bistro-header-config'
import { resolveHeaderAppearanceProps } from '@/lib/header-variant-theme'
import {
  LOGIN_MODAL_SECTION_DEFAULTS,
  type LoginModalVariantId,
} from '@/lib/login-modal-config'
import {
  CART_DRAWER_CHILD_DEFAULTS,
  CART_DRAWER_SECTION_DEFAULTS,
  type CartDrawerVariantId,
} from '@/lib/cart-drawer-config'

function pickString(
  props: Record<string, unknown>,
  key: string,
  fallback: string,
): string {
  const v = props[key]
  if (typeof v === 'string' && v.trim()) return v
  return fallback
}

function pickNumber(props: Record<string, unknown>, key: string, fallback: number): number {
  const v = props[key]
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string' && v.trim() && !Number.isNaN(Number(v))) return Number(v)
  return fallback
}

export type ResolvedHeaderStyle = {
  backgroundColor: string
  backgroundOpacity: number
  borderColor: string
  blur: boolean
  accentColor: string
  boxShadow: string
}

export function resolveLogoProps(props: Record<string, unknown>, store: StoreData) {
  const info = store.store
  return {
    imageUrl: pickString(props, 'imageUrl', info.logo ?? ''),
    appearance: props.appearance as string | undefined,
    size: props.size as string | undefined,
  }
}

export function resolveStoreNameProps(props: Record<string, unknown>, store: StoreData) {
  return {
    text: pickString(props, 'text', store.store.name),
    textColor: pickString(props, 'textColor', '#0F1419'),
    fontSize: pickNumber(props, 'fontSize', 20),
    mobileFontSize: pickNumber(props, 'mobileFontSize', 11),
    appearance: props.appearance as string | undefined,
  }
}

export function resolveAddressProps(props: Record<string, unknown>, store: StoreData) {
  return {
    text: pickString(props, 'text', store.store.address ?? ''),
    textColor: pickString(props, 'textColor', '#1A1F2E'),
    mobileTextColor: pickString(props, 'mobileTextColor', '#1A1F2E'),
    fontSize: pickNumber(props, 'fontSize', 12),
    showIcon: props.showIcon !== false,
    icon: pickString(props, 'icon', 'solar:map-point-linear'),
    iconColor: pickString(props, 'iconColor', '#1A1F2E'),
    appearance: props.appearance as string | undefined,
  }
}

export function resolveLoginModalSectionProps(
  props: Record<string, unknown>,
  store: StoreData,
  variantId?: string,
) {
  const accent = store.store.primaryColor ?? '#F97316'
  return {
    enabled: props.enabled !== false,
    displayAsOverlay: props.displayAsOverlay !== false,
    variant: (variantId ?? 'LoginModalV1') as LoginModalVariantId,
    modalTitle: pickString(props, 'modalTitle', LOGIN_MODAL_SECTION_DEFAULTS.modalTitle),
    modalSubtitle: pickString(props, 'modalSubtitle', LOGIN_MODAL_SECTION_DEFAULTS.modalSubtitle),
    otpButtonLabel: pickString(props, 'otpButtonLabel', LOGIN_MODAL_SECTION_DEFAULTS.otpButtonLabel),
    mobilePlaceholder: pickString(
      props,
      'mobilePlaceholder',
      LOGIN_MODAL_SECTION_DEFAULTS.mobilePlaceholder,
    ),
    accentColor: accent,
  }
}

export function resolveCartDrawerSectionProps(
  props: Record<string, unknown>,
  _store: StoreData,
  variantId?: string,
) {
  return {
    enabled: props.enabled !== false,
    displayAsOverlay: props.displayAsOverlay !== false,
    variant: (variantId ?? 'CartDrawerV1') as CartDrawerVariantId,
    orderNumber: pickString(props, 'orderNumber', CART_DRAWER_SECTION_DEFAULTS.orderNumber),
  }
}

function resolveCartDrawerChildProps(
  type: string,
  props: Record<string, unknown>,
): Record<string, unknown> {
  const defaults = CART_DRAWER_CHILD_DEFAULTS[type] ?? {}
  return { ...defaults, ...props }
}

export function resolveAccountProps(props: Record<string, unknown>, store: StoreData) {
  const user = store.users[0]
  const accent = store.store.primaryColor ?? '#F97316'
  return {
    isLoggedIn: Boolean(props.isLoggedIn),
    userName: pickString(props, 'userName', user?.name ?? ''),
    userEmail: pickString(props, 'userEmail', user?.email ?? ''),
    welcomeLabel: pickString(props, 'welcomeLabel', store.store.welcomeLabel ?? 'Welcome'),
    loginPrompt: pickString(props, 'loginPrompt', store.store.loginPrompt ?? 'Login or Sign Up'),
    backgroundColor: pickString(props, 'backgroundColor', 'rgba(248, 250, 249, 0.5)'),
    borderColor: pickString(props, 'borderColor', 'rgba(232, 245, 232, 0.25)'),
    avatarBg: pickString(props, 'avatarBg', accent),
    avatarTextColor: pickString(props, 'avatarTextColor', '#ffffff'),
    loggedOutIcon: pickString(props, 'loggedOutIcon', 'solar:user-circle-linear'),
    nameColor: pickString(props, 'nameColor', '#0F1419'),
    subtitleColor: pickString(props, 'subtitleColor', '#1A1F2E'),
    chevronColor: pickString(props, 'chevronColor', '#1A1F2E'),
    appearance: props.appearance as string | undefined,
    accentColor: accent,
  }
}

export function resolveDealsProps(props: Record<string, unknown>, store: StoreData) {
  const accent = store.store.primaryColor ?? '#F97316'
  return {
    label: pickString(props, 'label', store.store.dealsLabel ?? 'Deals'),
    visible: props.visible !== false,
    icon: pickString(props, 'icon', 'solar:star-fall-minimalistic-linear'),
    gradientStart: pickString(props, 'gradientStart', `${accent}dd`),
    gradientEnd: pickString(props, 'gradientEnd', accent),
    textColor: pickString(props, 'textColor', '#ffffff'),
    borderColor: pickString(props, 'borderColor', accent),
    appearance: props.appearance as string | undefined,
    accentColor: accent,
  }
}

export function resolveHeaderStyleProps(
  props: Record<string, unknown>,
  store: StoreData,
): ResolvedHeaderStyle {
  const info = store.store
  return {
    backgroundColor: pickString(props, 'backgroundColor', info.secondaryColor ?? '#FFFFFF'),
    backgroundOpacity: pickNumber(props, 'backgroundOpacity', 97),
    borderColor: pickString(props, 'borderColor', ''),
    blur: props.blur !== false,
    accentColor: pickString(props, 'accentColor', info.primaryColor ?? '#F97316'),
    boxShadow: pickString(props, 'boxShadow', '0 4px 20px rgba(0, 0, 0, 0.1)'),
  }
}

export function resolveSearchProps(props: Record<string, unknown>, store: StoreData) {
  const info = store.store
  const accent = info.primaryColor ?? '#F97316'
  return {
    placeholder: pickString(
      props,
      'placeholder',
      info.searchPlaceholder ?? `Search ${info.name}…`,
    ),
    backgroundColor: pickString(
      props,
      'backgroundColor',
      props.appearance === 'glass' || props.appearance === 'glass-mobile' ? '#f8faf9' : '#f4f6f0',
    ),
    borderColor: pickString(
      props,
      'borderColor',
      props.appearance === 'glass' || props.appearance === 'glass-mobile' ? '#e8f5e8' : '#e2eacc',
    ),
    borderWidth: pickNumber(props, 'borderWidth', 1),
    textColor: pickString(props, 'textColor', '#0f1419'),
    placeholderColor: pickString(props, 'placeholderColor', '#9ca3af'),
    icon: pickString(props, 'icon', 'solar:magnifer-linear'),
    iconColor: pickString(props, 'iconColor', '#1a1f2e'),
    mobileSearchIcon: pickString(props, 'mobileSearchIcon', 'solar:magnifer-linear'),
    mobileSearchIconColor: pickString(props, 'mobileSearchIconColor', '#0F1419'),
    appearance: props.appearance as string | undefined,
    accentColor: accent,
  }
}

export function resolveNavLinkProps(
  props: Record<string, unknown>,
  store: StoreData,
  navKey?: string,
) {
  const key = (navKey ?? props.navKey) as string | undefined
  if (key && BISTRO_NAV_KEYS.includes(key as BistroNavKey)) {
    return resolveBistroNavLinkProps(props, store, key as BistroNavKey)
  }
  const groceryKey = key as GroceryNavKey | undefined
  const defaults = groceryKey ? DEFAULT_GROCERY_NAV_LINKS[groceryKey] : undefined
  const accent = store.store.primaryColor ?? '#6bb252'
  return {
    navKey: groceryKey,
    label: pickString(props, 'label', defaults?.label ?? 'Link'),
    href: pickString(props, 'href', defaults?.href ?? '#'),
    icon: pickString(props, 'icon', defaults?.icon ?? 'solar:link-linear'),
    textColor: pickString(props, 'textColor', '#4b5563'),
    hoverColor: pickString(props, 'hoverColor', accent),
    iconColor: pickString(props, 'iconColor', '#4b5563'),
    fontSize: pickNumber(props, 'fontSize', 13),
    visible: props.visible !== false,
    accentColor: accent,
  }
}

export function resolveBistroNavLinkProps(
  props: Record<string, unknown>,
  store: StoreData,
  navKey?: BistroNavKey,
) {
  const key = (navKey ?? props.navKey) as BistroNavKey | undefined
  const defaults = key ? DEFAULT_BISTRO_NAV_LINKS[key] : undefined
  const accent = store.store.primaryColor ?? '#EFB21B'
  return {
    navKey: key,
    label: pickString(props, 'label', defaults?.label ?? 'Link'),
    href: pickString(props, 'href', defaults?.href ?? '#'),
    textColor: pickString(props, 'textColor', 'rgba(245, 240, 232, 0.6)'),
    hoverColor: pickString(props, 'hoverColor', '#f5f0e8'),
    underlineColor: pickString(props, 'underlineColor', accent),
    fontSize: pickNumber(props, 'fontSize', 10),
    letterSpacing: pickNumber(props, 'letterSpacing', 0.15),
    visible: props.visible !== false,
    accentColor: accent,
  }
}

export function resolveBistroStoreNameProps(props: Record<string, unknown>, store: StoreData) {
  const accent = store.store.primaryColor ?? '#EFB21B'
  return {
    text: pickString(props, 'text', store.store.name),
    tagline: pickString(props, 'tagline', store.store.tagline ?? ''),
    nameColor: pickString(props, 'nameColor', '#f5f0e8'),
    taglineColor: pickString(props, 'taglineColor', accent),
    nameFontSize: pickNumber(props, 'nameFontSize', 12),
    taglineFontSize: pickNumber(props, 'taglineFontSize', 8),
    letterSpacing: pickNumber(props, 'letterSpacing', 0.13),
    appearance: props.appearance as string | undefined,
    accentColor: accent,
  }
}

export function resolveBistroLogoProps(props: Record<string, unknown>, store: StoreData) {
  const accent = store.store.primaryColor ?? '#EFB21B'
  return {
    imageUrl: pickString(props, 'imageUrl', store.store.logo ?? ''),
    desktopSize: pickNumber(props, 'desktopSize', 68),
    mobileSize: pickNumber(props, 'mobileSize', 36),
    hoverScale: pickNumber(props, 'hoverScale', 1.05),
    appearance: props.appearance as string | undefined,
    accentColor: accent,
  }
}

export function resolveMenuButtonProps(props: Record<string, unknown>, _store: StoreData) {
  const accent = _store.store.primaryColor ?? '#EFB21B'
  return {
    label: pickString(props, 'label', 'View Menu'),
    mobileLabel: pickString(props, 'mobileLabel', 'Menu'),
    href: pickString(props, 'href', '#menu'),
    textColor: pickString(props, 'textColor', '#0c0c0c'),
    backgroundColor: pickString(props, 'backgroundColor', accent),
    borderColor: pickString(props, 'borderColor', accent),
    visible: props.visible !== false,
    appearance: props.appearance as string | undefined,
    accentColor: accent,
  }
}

export function resolveBistroSearchProps(props: Record<string, unknown>, store: StoreData) {
  return {
    icon: pickString(props, 'icon', 'lucide:search'),
    iconColor: pickString(props, 'iconColor', 'rgba(245,240,232,0.65)'),
    hoverColor: pickString(props, 'hoverColor', '#f5f0e8'),
    iconSize: pickNumber(props, 'iconSize', 16),
    mobileIconSize: pickNumber(props, 'mobileIconSize', 18),
    appearance: props.appearance as string | undefined,
    accentColor: store.store.primaryColor ?? '#EFB21B',
  }
}

export function resolveBistroAccountProps(props: Record<string, unknown>, store: StoreData) {
  return {
    icon: pickString(props, 'icon', 'lucide:user'),
    iconColor: pickString(props, 'iconColor', 'rgba(245,240,232,0.65)'),
    hoverColor: pickString(props, 'hoverColor', '#f5f0e8'),
    iconSize: pickNumber(props, 'iconSize', 16),
    accentColor: store.store.primaryColor ?? '#EFB21B',
  }
}

export function resolveBistroBarStyleProps(props: Record<string, unknown>, store: StoreData) {
  const accent = store.store.primaryColor ?? '#EFB21B'
  return {
    backgroundColor: pickString(props, 'backgroundColor', '#000000'),
    backgroundOpacity: pickNumber(props, 'backgroundOpacity', 45),
    borderColor: pickString(props, 'borderColor', `${accent}14`),
    accentColor: pickString(props, 'accentColor', accent),
    minHeightDesktop: pickNumber(props, 'minHeightDesktop', 88),
    minHeightMobile: pickNumber(props, 'minHeightMobile', 58),
    mobileBackgroundColor: pickString(props, 'mobileBackgroundColor', '#0c0c0c'),
    mobileBorderColor: pickString(props, 'mobileBorderColor', `${accent}40`),
    rightNavPadding: pickNumber(props, 'rightNavPadding', 280),
    dividerColor: pickString(props, 'dividerColor', `${accent}40`),
  }
}

export function resolveBistroCartProps(props: Record<string, unknown>, store: StoreData) {
  const accent = store.store.primaryColor ?? '#EFB21B'
  return {
    cartTotal: pickString(props, 'cartTotal', formatPrice(0)),
    cartCount: pickNumber(props, 'cartCount', 0),
    showCount: props.showCount !== false,
    showTotal: props.showTotal !== false,
    icon: pickString(props, 'icon', 'lucide:shopping-cart'),
    textColor: pickString(props, 'textColor', accent),
    borderColor: pickString(props, 'borderColor', accent),
    backgroundColor: pickString(props, 'backgroundColor', 'transparent'),
    badgeBg: pickString(props, 'badgeBg', accent),
    badgeTextColor: pickString(props, 'badgeTextColor', '#0c0c0c'),
    label: pickString(props, 'label', 'Cart'),
    appearance: props.appearance as string | undefined,
    accentColor: accent,
  }
}

export function resolveGroceryAccountProps(props: Record<string, unknown>, store: StoreData) {
  const user = store.users[0]
  const accent = store.store.primaryColor ?? '#6bb252'
  return {
    isLoggedIn: Boolean(props.isLoggedIn),
    showAvatar: props.showAvatar !== false,
    userName: pickString(props, 'userName', user?.name ?? ''),
    avatarUrl: pickString(props, 'avatarUrl', ''),
    avatarBg: pickString(props, 'avatarBg', accent),
    avatarTextColor: pickString(props, 'avatarTextColor', '#ffffff'),
    nameColor: pickString(props, 'nameColor', '#374151'),
    iconColor: pickString(props, 'iconColor', '#6b7280'),
    hoverBg: pickString(props, 'hoverBg', 'rgba(0,0,0,0.04)'),
    loggedOutIcon: pickString(props, 'loggedOutIcon', 'solar:user-linear'),
    accentColor: accent,
  }
}

export function resolveThemeToggleProps(props: Record<string, unknown>, store: StoreData) {
  const accent = store.store.primaryColor ?? '#6bb252'
  return {
    backgroundColor: pickString(props, 'backgroundColor', accent),
    knobColor: pickString(props, 'knobColor', '#ffffff'),
    icon: pickString(props, 'icon', 'solar:sun-linear'),
    iconColor: pickString(props, 'iconColor', accent),
    accentColor: accent,
  }
}

export function resolveGroceryBarStyleProps(props: Record<string, unknown>, _store: StoreData) {
  return {
    backgroundColor: pickString(props, 'backgroundColor', '#f7faf5'),
    borderColor: pickString(props, 'borderColor', '#e5ebe0'),
    mobileSearchBg: pickString(props, 'mobileSearchBg', '#f0f4ec'),
  }
}

export function resolveCartProps(props: Record<string, unknown>, store: StoreData) {
  const accent = store.store.primaryColor ?? '#F97316'
  return {
    cartTotal: pickString(props, 'cartTotal', formatPrice(0)),
    cartCount: pickNumber(props, 'cartCount', 0),
    appearance: props.appearance as string | undefined,
    label: pickString(props, 'label', 'Cart'),
    icon: pickString(props, 'icon', 'solar:cart-large-2-linear'),
    backgroundColor: pickString(props, 'backgroundColor', accent),
    textColor: pickString(props, 'textColor', '#ffffff'),
    borderColor: pickString(props, 'borderColor', `${accent}30`),
    mobileIconColor: pickString(props, 'mobileIconColor', '#0F1419'),
    showCount: props.showCount !== false,
    showTotal: props.showTotal === true,
    accentColor: accent,
  }
}

export function resolveHeroProps(props: Record<string, unknown>, store: StoreData) {
  const info = store.store
  return {
    heightMode: pickString(props, 'heightMode', 'below-nav'),
    navOffsetDesktop: Number(props.navOffsetDesktop ?? 88),
    navOffsetMobile: Number(props.navOffsetMobile ?? 58),
    customHeightDesktop: Number(props.customHeightDesktop ?? 600),
    customHeightMobile: Number(props.customHeightMobile ?? 480),
    featureDividerColor: pickString(props, 'featureDividerColor', 'rgba(245, 240, 232, 0.18)'),
    title: pickString(props, 'title', `Welcome to ${info.name}`),
    subtitle: pickString(props, 'subtitle', info.tagline ?? ''),
    buttonText: pickString(props, 'buttonText', 'Shop Now'),
    buttonLink: pickString(props, 'buttonLink', '/products'),
    backgroundImage: (props.backgroundImage as string | undefined) ?? info.heroImage,
    videoUrl: props.videoUrl as string | undefined,
  }
}

export function resolveHeroMediaProps(props: Record<string, unknown>, store: StoreData) {
  const info = store.store
  const hasVideo = Boolean(props.videoUrl)
  return {
    mediaType: pickString(props, 'mediaType', hasVideo ? 'video' : 'image'),
    imageUrl: (props.imageUrl as string | undefined) ?? info.heroImage,
    videoUrl: props.videoUrl as string | undefined,
    alt: pickString(props, 'alt', info.name),
    objectFit: pickString(props, 'objectFit', 'cover'),
  }
}

export function resolveHeroOverlayProps(props: Record<string, unknown>, _store: StoreData) {
  return {
    overlayColor: pickString(props, 'overlayColor', '#000000'),
    overlayOpacity: Number(props.overlayOpacity ?? 35),
    enableGradient: props.enableGradient !== false,
    gradientColor: pickString(props, 'gradientColor', '#000000'),
  }
}

export function resolveHeroTitleProps(props: Record<string, unknown>, store: StoreData) {
  return {
    text: pickString(props, 'text', `Welcome to ${store.store.name}`),
    visible: props.visible !== false,
    textColor: pickString(props, 'textColor', '#ffffff'),
    fontSize: Number(props.fontSize ?? 48),
    fontSizeMobile: Number(props.fontSizeMobile ?? 32),
    fontSizeDesktop: Number(props.fontSizeDesktop ?? 128),
    fontWeight: Number(props.fontWeight ?? 700),
    fontFamily: pickString(props, 'fontFamily', 'Georgia, "Times New Roman", serif'),
    letterSpacing: Number(props.letterSpacing ?? -0.01),
    lineHeight: Number(props.lineHeight ?? 1),
    textShadow: pickString(props, 'textShadow', ''),
    maxWidth: Number(props.maxWidth ?? 720),
  }
}

export function resolveHeroSubtitleProps(props: Record<string, unknown>, store: StoreData) {
  return {
    text: pickString(props, 'text', store.store.tagline ?? ''),
    visible: props.visible !== false,
    textColor: pickString(props, 'textColor', 'rgba(255,255,255,0.88)'),
    fontSize: Number(props.fontSize ?? 18),
    fontSizeMobile: Number(props.fontSizeMobile ?? 16),
    maxWidth: Number(props.maxWidth ?? 560),
  }
}

export function resolveHeroButtonProps(props: Record<string, unknown>, store: StoreData) {
  const accent = store.store.primaryColor || '#0D9488'
  return {
    label: pickString(props, 'label', 'Shop Now'),
    href: pickString(props, 'href', '/products'),
    visible: props.visible !== false,
    backgroundColor: pickString(props, 'backgroundColor', accent),
    textColor: pickString(props, 'textColor', '#ffffff'),
    borderColor: props.borderColor as string | undefined,
    borderRadius: Number(props.borderRadius ?? 8),
    fontSize: Number(props.fontSize ?? 16),
    fontSizeMobile: Number(props.fontSizeMobile ?? 15),
    paddingX: Number(props.paddingX ?? 24),
    paddingY: Number(props.paddingY ?? 12),
    letterSpacing: Number(props.letterSpacing ?? 0),
    uppercase: props.uppercase === true,
    marginBottom: Number(props.marginBottom ?? 32),
    marginBottomMobile: Number(props.marginBottomMobile ?? 24),
    marginSide: Number(props.marginSide ?? 32),
    marginSideMobile: Number(props.marginSideMobile ?? 20),
  }
}

export function resolveHeroLogoProps(props: Record<string, unknown>, store: StoreData) {
  return {
    imageUrl: (props.imageUrl as string | undefined) ?? store.store.logo,
    alt: pickString(props, 'alt', store.store.name),
    visible: props.visible !== false,
    widthMin: Number(props.widthMin ?? 100),
    widthMax: Number(props.widthMax ?? 180),
    widthVw: Number(props.widthVw ?? 18),
    marginBottom: Number(props.marginBottom ?? 1.5),
    dropShadow: pickString(
      props,
      'dropShadow',
      'drop-shadow(0 14px 14px rgba(0,0,0,0.95)) drop-shadow(0 0 20px rgba(239,178,27,0.5))',
    ),
    brightness: Number(props.brightness ?? 1.1),
  }
}

export function resolveHeroEyebrowProps(props: Record<string, unknown>, store: StoreData) {
  const accent = store.store.primaryColor || '#EFB21B'
  return {
    text: pickString(props, 'text', 'FOOD · DRINKS · DINING'),
    visible: props.visible !== false,
    textColor: pickString(props, 'textColor', accent),
    lineColor: pickString(props, 'lineColor', accent),
    letterSpacing: Number(props.letterSpacing ?? 0.4),
    fontSize: Number(props.fontSize ?? 9),
    fontSizeDesktop: Number(props.fontSizeDesktop ?? 11),
    lineWidthMobile: Number(props.lineWidthMobile ?? 40),
    lineWidthDesktop: Number(props.lineWidthDesktop ?? 64),
    marginBottom: Number(props.marginBottom ?? 1.25),
    textShadow: pickString(props, 'textShadow', '0 2px 16px rgba(0,0,0,0.9)'),
  }
}

export function resolveHeroFeatureProps(props: Record<string, unknown>, store: StoreData) {
  const accent = store.store.primaryColor || '#EFB21B'
  return {
    featureKey: props.featureKey as string | undefined,
    label: pickString(props, 'label', 'Feature'),
    visible: props.visible !== false,
    icon: pickString(props, 'icon', 'solar:star-bold'),
    iconColor: pickString(props, 'iconColor', accent),
    ringColor: pickString(props, 'ringColor', `${accent}73`),
    ringBackground: pickString(props, 'ringBackground', `${accent}1f`),
    textColor: pickString(props, 'textColor', 'rgba(245,240,232,0.82)'),
    letterSpacing: Number(props.letterSpacing ?? 0.18),
    fontSize: Number(props.fontSize ?? 10),
    fontSizeDesktop: Number(props.fontSizeDesktop ?? 11),
    textShadow: pickString(props, 'textShadow', '0 1px 8px rgba(0,0,0,0.9)'),
    href: props.href as string | undefined,
  }
}

export function resolveCategoriesProps(props: Record<string, unknown>, store: StoreData) {
  const ids = props.categoryIds
  const categoryIds =
    Array.isArray(ids) && ids.length > 0
      ? (ids as string[])
      : store.categories.map((c) => c.id)

  return {
    title: pickString(props, 'title', 'Shop by Category'),
    categoryIds,
  }
}

export function resolveOffersProps(props: Record<string, unknown>, store: StoreData) {
  const slides = props.slides
  return {
    title: pickString(props, 'title', 'Special Offers'),
    slides: Array.isArray(slides) ? slides : store.offers ?? [],
  }
}

export function resolveTestimonialsProps(props: Record<string, unknown>, store: StoreData) {
  const items = props.items
  return {
    title: pickString(props, 'title', 'What Our Customers Say'),
    items: Array.isArray(items) ? items : store.testimonials ?? [],
  }
}

export function resolveProductSectionProps(props: Record<string, unknown>, _store: StoreData) {
  return {
    title: pickString(props, 'title', ''),
    productCardVariant: pickString(props, 'productCardVariant', 'ProductCardV4'),
    templateId: pickString(props, 'templateId', ''),
    templateName: pickString(props, 'templateName', ''),
  }
}

export function resolveTemplateSectionProps(props: Record<string, unknown>, _store: StoreData) {
  return {
    title: pickString(props, 'title', ''),
    sectionId: pickString(props, 'sectionId', ''),
    productCardVariant: pickString(props, 'productCardVariant', 'ProductCardV4'),
  }
}

export function resolveOrdersProps(props: Record<string, unknown>, _store: StoreData) {
  return {
    title: pickString(props, 'title', 'Your Orders'),
  }
}

export function resolveProductCardProps(props: Record<string, unknown>, _store: StoreData) {
  return {
    productId: props.productId as string | undefined,
    compareAtPrice: props.compareAtPrice as number | undefined,
    categoryLabel: pickString(props, 'categoryLabel', ''),
  }
}

/** Header wrapper — variant theme + appearance props */
export function resolveHeaderProps(
  props: Record<string, unknown>,
  store: StoreData,
  variant?: string,
) {
  return resolveHeaderAppearanceProps(props, variant ?? 'HeaderV1', store)
}

export function getHeaderStyleFromChildren(
  childNodes: PageNode[] | undefined,
  store: StoreData,
): ResolvedHeaderStyle {
  const node = childNodes?.find((c) => c.type === 'headerStyle')
  return resolveHeaderStyleProps(node?.props ?? {}, store)
}

export function getGroceryBarStyleFromChildren(
  childNodes: PageNode[] | undefined,
  store: StoreData,
) {
  const node = childNodes?.find((c) => c.type === 'groceryBarStyle')
  return resolveGroceryBarStyleProps(node?.props ?? {}, store)
}

export function getBistroBarStyleFromChildren(
  childNodes: PageNode[] | undefined,
  store: StoreData,
) {
  const node = childNodes?.find((c) => c.type === 'bistroBarStyle')
  return resolveBistroBarStyleProps(node?.props ?? {}, store)
}

export function getBistroNavLinksFromChildren(
  childNodes: PageNode[] | undefined,
  store: StoreData,
) {
  return (childNodes ?? [])
    .filter((c) => c.type === 'navLink' && BISTRO_NAV_KEYS.includes(c.props?.navKey as BistroNavKey))
    .map((node) => ({
      node,
      props: resolveBistroNavLinkProps(node.props ?? {}, store, node.props?.navKey as BistroNavKey),
    }))
    .sort((a, b) => {
      const ak = BISTRO_NAV_KEYS.indexOf(a.props.navKey as BistroNavKey)
      const bk = BISTRO_NAV_KEYS.indexOf(b.props.navKey as BistroNavKey)
      return ak - bk
    })
}

export function getGroceryNavLinksFromChildren(
  childNodes: PageNode[] | undefined,
  store: StoreData,
) {
  return (childNodes ?? [])
    .filter(
      (c) =>
        c.type === 'navLink' &&
        c.props?.navKey &&
        (DEFAULT_GROCERY_NAV_LINKS as Record<string, unknown>)[c.props.navKey as string],
    )
    .map((node) => ({
      node,
      props: resolveNavLinkProps(node.props ?? {}, store, node.props?.navKey as string),
    }))
    .sort((a, b) => {
      const ak = GROCERY_NAV_KEY_ORDER[a.props.navKey as GroceryNavKey] ?? 99
      const bk = GROCERY_NAV_KEY_ORDER[b.props.navKey as GroceryNavKey] ?? 99
      return ak - bk
    })
}

/** Merge node props with live store data. Node props override store defaults when set. */
export function resolveNodeProps(
  type: string,
  props: Record<string, unknown>,
  store: StoreData,
  _node?: PageNode,
): Record<string, unknown> {
  switch (type) {
    case 'header':
      return resolveHeaderProps(props, store, _node?.variant)
    case 'logo':
      if (_node?.variant === 'BistroLogoV1') return resolveBistroLogoProps(props, store)
      return resolveLogoProps(props, store)
    case 'storeName':
      if (_node?.variant === 'BistroStoreNameV1') return resolveBistroStoreNameProps(props, store)
      return resolveStoreNameProps(props, store)
    case 'address':
      return resolveAddressProps(props, store)
    case 'account':
      if (_node?.variant === 'BistroAccountV1') return resolveBistroAccountProps(props, store)
      if (_node?.variant === 'AccountGroceryV1') {
        return resolveGroceryAccountProps(props, store)
      }
      return resolveAccountProps(props, store)
    case 'deals':
      return resolveDealsProps(props, store)
    case 'headerStyle':
      return resolveHeaderStyleProps(props, store)
    case 'groceryBarStyle':
      return resolveGroceryBarStyleProps(props, store)
    case 'bistroBarStyle':
      return resolveBistroBarStyleProps(props, store)
    case 'menuButton':
      return resolveMenuButtonProps(props, store)
    case 'navLink':
      return resolveNavLinkProps(props, store, props.navKey as string)
    case 'themeToggle':
      return resolveThemeToggleProps(props, store)
    case 'search':
      if (_node?.variant === 'BistroSearchBtnV1') return resolveBistroSearchProps(props, store)
      return resolveSearchProps(props, store)
    case 'cart':
      if (_node?.variant === 'BistroCartV1' || props.variantStyle === 'bistro') {
        return resolveBistroCartProps(props, store)
      }
      return resolveCartProps(props, store)
    case 'hero':
      return resolveHeroProps(props, store)
    case 'heroMedia':
      return resolveHeroMediaProps(props, store)
    case 'heroOverlay':
      return resolveHeroOverlayProps(props, store)
    case 'heroTitle':
      return resolveHeroTitleProps(props, store)
    case 'heroSubtitle':
      return resolveHeroSubtitleProps(props, store)
    case 'heroButton':
      return resolveHeroButtonProps(props, store)
    case 'heroLogo':
      return resolveHeroLogoProps(props, store)
    case 'heroEyebrow':
      return resolveHeroEyebrowProps(props, store)
    case 'heroFeature':
      return resolveHeroFeatureProps(props, store)
    case 'categories':
      return resolveCategoriesProps(props, store)
    case 'offers':
      return resolveOffersProps(props, store)
    case 'testimonials':
      return resolveTestimonialsProps(props, store)
    case 'productSection':
      return resolveProductSectionProps(props, store)
    case 'templateSection':
      return resolveTemplateSectionProps(props, store)
    case 'orders':
      return resolveOrdersProps(props, store)
    case 'loginModal':
      return resolveLoginModalSectionProps(props, store, _node?.variant)
    case 'cartDrawer':
      return resolveCartDrawerSectionProps(props, store, _node?.variant)
    case 'cartDrawerHeader':
    case 'cartStepNav':
    case 'cartLineItem':
    case 'cartBill':
    case 'cartCta':
    case 'cartCoupon':
    case 'cartDrawerStyle':
      return resolveCartDrawerChildProps(type, props)
    case 'productCard':
      return resolveProductCardProps(props, store)
    default:
      return { ...props }
  }
}

export function getDefaultNodeProps(type: string, store: StoreData): Record<string, unknown> {
  return resolveNodeProps(type, {}, store)
}
