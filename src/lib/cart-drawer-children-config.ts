import type { PropField } from '@/lib/registry'
import {
  getCartDrawerChildPropKeys,
  isCartDrawerChildPropVisible,
  getCartDrawerFieldGroups,
  getCartDrawerVariantLabel,
} from '@/lib/cart-drawer-variant-config'

export const CART_DRAWER_CHILD_SLOTS = [
  'cartDrawerHeader',
  'cartStepNav',
  'cartLineItem',
  'cartBill',
  'cartCta',
  'cartCoupon',
  'cartDrawerStyle',
] as const

export type CartDrawerChildType = (typeof CART_DRAWER_CHILD_SLOTS)[number]

export const CART_DRAWER_CHILD_META: Record<CartDrawerChildType, { label: string }> = {
  cartDrawerHeader: { label: 'Header' },
  cartStepNav: { label: 'Step navigation' },
  cartLineItem: { label: 'Line items' },
  cartBill: { label: 'Bill summary' },
  cartCta: { label: 'Continue button' },
  cartCoupon: { label: 'Coupon banner' },
  cartDrawerStyle: { label: 'Drawer style' },
}

const CART_DRAWER_CHILD_FIELDS: Record<CartDrawerChildType, PropField[]> = {
  cartDrawerHeader: [
    { key: 'visible', label: 'Visible', type: 'boolean' },
    { key: 'eyebrow', label: 'Eyebrow text', type: 'text' },
    { key: 'titlePrefix', label: 'Cart step title', type: 'text' },
    { key: 'detailsTitle', label: 'Details step title', type: 'text' },
    { key: 'deliveryTitle', label: 'Delivery step title', type: 'text' },
    { key: 'paymentTitle', label: 'Payment step title', type: 'text' },
    { key: 'showOrderBadge', label: 'Show order badge', type: 'boolean' },
    { key: 'orderBadgePrefix', label: 'Order badge prefix', type: 'text' },
    { key: 'itemCountSuffix', label: 'Item count suffix', type: 'text' },
  ],
  cartStepNav: [
    { key: 'visible', label: 'Visible', type: 'boolean' },
    { key: 'step1Label', label: 'Cart step label', type: 'text' },
    { key: 'step2Label', label: 'Details step label', type: 'text' },
    { key: 'step3Label', label: 'Delivery step label', type: 'text' },
    { key: 'step4Label', label: 'Payment step label', type: 'text' },
    { key: 'accentColor', label: 'Accent color', type: 'color' },
  ],
  cartLineItem: [
    { key: 'visible', label: 'Visible', type: 'boolean' },
    { key: 'showUnitPrice', label: 'Show unit price', type: 'boolean' },
    { key: 'showRemove', label: 'Show remove action', type: 'boolean' },
    { key: 'emptyMessage', label: 'Empty cart message', type: 'text' },
    { key: 'loadingMessage', label: 'Loading message', type: 'text' },
    { key: 'imageRadius', label: 'Image radius (px)', type: 'number' },
  ],
  cartBill: [
    { key: 'visible', label: 'Visible', type: 'boolean' },
    { key: 'subtotalLabel', label: 'Subtotal label', type: 'text' },
    { key: 'taxLabel', label: 'Tax label', type: 'text' },
    { key: 'deliveryLabel', label: 'Delivery label', type: 'text' },
    { key: 'totalLabel', label: 'Total label', type: 'text' },
    { key: 'pickupLabel', label: 'Free pickup label', type: 'text' },
    { key: 'discountLabel', label: 'Discount label', type: 'text' },
  ],
  cartCta: [
    { key: 'visible', label: 'Visible', type: 'boolean' },
    { key: 'cartButtonLabel', label: 'Cart step button', type: 'text' },
    { key: 'detailsButtonLabel', label: 'Details step button', type: 'text' },
    { key: 'deliveryButtonLabel', label: 'Delivery step button', type: 'text' },
    { key: 'savingLabel', label: 'Saving label', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text color', type: 'color' },
  ],
  cartCoupon: [
    { key: 'visible', label: 'Visible', type: 'boolean' },
    { key: 'couponCode', label: 'Coupon code (preview)', type: 'text' },
    { key: 'couponSavings', label: 'Savings label', type: 'text' },
    { key: 'showOnCartStepOnly', label: 'Show on cart step only', type: 'boolean' },
  ],
  cartDrawerStyle: [
    { key: 'backgroundColor', label: 'Drawer background', type: 'color' },
    { key: 'surfaceColor', label: 'Card / surface', type: 'color' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'mutedColor', label: 'Muted text', type: 'color' },
    { key: 'borderColor', label: 'Border color', type: 'color' },
    { key: 'accentColor', label: 'Accent color', type: 'color' },
    { key: 'footerBackground', label: 'Footer background', type: 'color' },
    { key: 'showTopAccentBar', label: 'Top accent bar', type: 'boolean' },
  ],
}

const FIELD_BY_KEY: Record<string, Record<string, PropField>> = Object.fromEntries(
  CART_DRAWER_CHILD_SLOTS.map((type) => [
    type,
    Object.fromEntries(CART_DRAWER_CHILD_FIELDS[type].map((f) => [f.key, f])),
  ]),
)

export function getCartDrawerChildFields(variant: string, childType: string): PropField[] {
  const keys = getCartDrawerChildPropKeys(variant, childType)
  const byKey = FIELD_BY_KEY[childType] ?? {}
  return keys.map((key) => byKey[key]).filter(Boolean) as PropField[]
}

export function getCartDrawerChildFieldKeys(variant: string, childType: string): string[] {
  return [...getCartDrawerChildPropKeys(variant, childType)]
}

export function getCartDrawerPartLabelsForVariant(variant: string): string[] {
  return CART_DRAWER_CHILD_SLOTS.map((t) => CART_DRAWER_CHILD_META[t].label)
}

/** @deprecated use getCartDrawerPartLabelsForVariant */
export function getCartDrawerPartLabels(): string[] {
  return getCartDrawerPartLabelsForVariant('CartDrawerV1')
}

export {
  getCartDrawerFieldGroups,
  getCartDrawerVariantLabel,
  isCartDrawerChildPropVisible,
}
