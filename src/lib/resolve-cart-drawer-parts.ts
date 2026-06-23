import type { CartDrawerConfig, CartDrawerTheme } from '@/components/cart/types'
import type { CartDrawerVariantId } from '@/lib/cart-drawer-config'
import { CART_DRAWER_SECTION_DEFAULTS } from '@/lib/cart-drawer-config'
import { getCartDrawerChildProps } from '@/lib/cart-drawer-children'
import {
  getDarkCartTheme,
  getMinimalCartTheme,
  getWarmCartTheme,
} from '@/components/cart/cart-drawer-themes'
import type { PageNode, StoreData } from '@/lib/types/store'

function pickString(props: Record<string, unknown>, key: string, fallback: string): string {
  const v = props[key]
  return typeof v === 'string' && v.trim() ? v : fallback
}

function pickBool(props: Record<string, unknown>, key: string, fallback: boolean): boolean {
  const v = props[key]
  return typeof v === 'boolean' ? v : fallback
}

function pickNumber(props: Record<string, unknown>, key: string, fallback: number): number {
  const v = props[key]
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() && !Number.isNaN(Number(v))) return Number(v)
  return fallback
}

function baseTheme(variantId: CartDrawerVariantId, accent: string): CartDrawerTheme {
  if (variantId === 'CartDrawerV2') return getDarkCartTheme(accent)
  if (variantId === 'CartDrawerV3') return getMinimalCartTheme(accent)
  return getWarmCartTheme(accent)
}

export function buildCartDrawerConfig(
  variantId: CartDrawerVariantId,
  rootProps: Record<string, unknown>,
  childNodes: PageNode[] | undefined,
  store: StoreData,
): CartDrawerConfig {
  const header = getCartDrawerChildProps(childNodes, 'cartDrawerHeader')
  const steps = getCartDrawerChildProps(childNodes, 'cartStepNav')
  const lineItem = getCartDrawerChildProps(childNodes, 'cartLineItem')
  const bill = getCartDrawerChildProps(childNodes, 'cartBill')
  const cta = getCartDrawerChildProps(childNodes, 'cartCta')
  const coupon = getCartDrawerChildProps(childNodes, 'cartCoupon')
  const style = getCartDrawerChildProps(childNodes, 'cartDrawerStyle')

  const storeAccent = store.store.primaryColor ?? '#F97316'
  const accent =
    pickString(style, 'accentColor', '') ||
    pickString(steps, 'accentColor', '') ||
    pickString(rootProps, 'accentColor', storeAccent) ||
    storeAccent

  const theme = applyThemeOverrides(baseTheme(variantId, accent), style)

  const titlePrefix =
    pickString(header, 'titlePrefix', '') ||
    pickString(rootProps, 'titlePrefix', CART_DRAWER_SECTION_DEFAULTS.titlePrefix)

  const nextButtonLabel =
    pickString(cta, 'cartButtonLabel', '') ||
    pickString(rootProps, 'nextButtonLabel', CART_DRAWER_SECTION_DEFAULTS.nextButtonLabel)

  const couponCode =
    pickString(coupon, 'couponCode', '') ||
    pickString(rootProps, 'couponCode', CART_DRAWER_SECTION_DEFAULTS.couponCode)

  const couponSavings =
    pickString(coupon, 'couponSavings', '') ||
    pickString(rootProps, 'couponSavings', CART_DRAWER_SECTION_DEFAULTS.couponSavings)

  return {
    variant: variantId,
    orderNumber: pickString(rootProps, 'orderNumber', CART_DRAWER_SECTION_DEFAULTS.orderNumber),
    titlePrefix,
    accentColor: accent,
    nextButtonLabel,
    couponCode,
    couponSavings,
    steps: [
      { id: 'cart', label: pickString(steps, 'step1Label', 'Cart') },
      { id: 'details', label: pickString(steps, 'step2Label', 'Details') },
      { id: 'delivery', label: pickString(steps, 'step3Label', 'Delivery') },
      { id: 'payment', label: pickString(steps, 'step4Label', 'Payment') },
    ],
    items: [],
    subtotal: 0,
    subtotalAfterDiscount: 0,
    tax: 0,
    total: 0,
    storeAddress: store.store.address ?? '',
    theme,
    parts: {
      header: {
        visible: pickBool(header, 'visible', true),
        eyebrow: pickString(header, 'eyebrow', 'Your shopping bag'),
        titlePrefix,
        detailsTitle: pickString(header, 'detailsTitle', 'Your Details'),
        deliveryTitle: pickString(header, 'deliveryTitle', 'How to Get It'),
        paymentTitle: pickString(header, 'paymentTitle', 'Complete Payment'),
        showOrderBadge: pickBool(header, 'showOrderBadge', true),
        orderBadgePrefix: pickString(header, 'orderBadgePrefix', 'Order #'),
        itemCountSuffix: pickString(header, 'itemCountSuffix', 'items'),
      },
      stepNav: {
        visible: pickBool(steps, 'visible', true),
        accentColor: pickString(steps, 'accentColor', accent),
      },
      lineItem: {
        visible: pickBool(lineItem, 'visible', true),
        showUnitPrice: pickBool(lineItem, 'showUnitPrice', true),
        showRemove: pickBool(lineItem, 'showRemove', true),
        emptyMessage: pickString(lineItem, 'emptyMessage', 'Your cart is empty'),
        loadingMessage: pickString(lineItem, 'loadingMessage', 'Loading cart…'),
        imageRadius: pickNumber(lineItem, 'imageRadius', variantId === 'CartDrawerV2' ? 8 : 12),
      },
      bill: {
        visible: pickBool(bill, 'visible', true),
        subtotalLabel: pickString(bill, 'subtotalLabel', 'Subtotal'),
        taxLabel: pickString(bill, 'taxLabel', 'Tax'),
        deliveryLabel: pickString(bill, 'deliveryLabel', 'Delivery'),
        totalLabel: pickString(bill, 'totalLabel', 'Total'),
        pickupLabel: pickString(bill, 'pickupLabel', 'Free pickup'),
        discountLabel: pickString(bill, 'discountLabel', 'Discount'),
      },
      cta: {
        visible: pickBool(cta, 'visible', true),
        cartButtonLabel: nextButtonLabel,
        detailsButtonLabel: pickString(cta, 'detailsButtonLabel', 'Choose Delivery'),
        deliveryButtonLabel: pickString(cta, 'deliveryButtonLabel', 'Proceed to Payment'),
        savingLabel: pickString(cta, 'savingLabel', 'Saving…'),
        backgroundColor: pickString(cta, 'backgroundColor', accent),
        textColor: pickString(cta, 'textColor', '#ffffff'),
      },
      coupon: {
        visible: pickBool(coupon, 'visible', true),
        couponCode,
        couponSavings,
        showOnCartStepOnly: pickBool(coupon, 'showOnCartStepOnly', variantId === 'CartDrawerV2'),
      },
      style: {
        showTopAccentBar: pickBool(style, 'showTopAccentBar', variantId === 'CartDrawerV1'),
      },
    },
  }
}

function applyThemeOverrides(theme: CartDrawerTheme, style: Record<string, unknown>): CartDrawerTheme {
  return {
    ...theme,
    accent: pickString(style, 'accentColor', theme.accent),
    background: pickString(style, 'backgroundColor', theme.background),
    surface: pickString(style, 'surfaceColor', theme.surface),
    text: pickString(style, 'textColor', theme.text),
    muted: pickString(style, 'mutedColor', theme.muted),
    border: pickString(style, 'borderColor', theme.border),
    footerBg: pickString(style, 'footerBackground', theme.footerBg),
  }
}

export function mergeOrderIntoCartConfig(
  config: CartDrawerConfig,
  orderConfig: Partial<CartDrawerConfig>,
): CartDrawerConfig {
  return {
    ...config,
    ...orderConfig,
    parts: config.parts,
    theme: config.theme,
    steps: config.steps,
  }
}
