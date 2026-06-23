import type { CartDrawerVariantId } from '@/lib/cart-drawer-config'
import type { CartDrawerChildType } from '@/lib/cart-drawer-children-config'

/** Prop keys exposed per cart drawer variant and child part. */
export const CART_DRAWER_VARIANT_CHILD_PROPS: Record<
  CartDrawerVariantId,
  Record<CartDrawerChildType, readonly string[]>
> = {
  CartDrawerV1: {
    cartDrawerHeader: [
      'visible',
      'eyebrow',
      'titlePrefix',
      'detailsTitle',
      'deliveryTitle',
      'paymentTitle',
      'showOrderBadge',
      'orderBadgePrefix',
      'itemCountSuffix',
    ],
    cartStepNav: ['visible', 'step1Label', 'step2Label', 'step3Label', 'step4Label', 'accentColor'],
    cartLineItem: [
      'visible',
      'showUnitPrice',
      'showRemove',
      'emptyMessage',
      'loadingMessage',
      'imageRadius',
    ],
    cartBill: [
      'visible',
      'subtotalLabel',
      'taxLabel',
      'deliveryLabel',
      'totalLabel',
      'pickupLabel',
      'discountLabel',
    ],
    cartCta: [
      'visible',
      'cartButtonLabel',
      'detailsButtonLabel',
      'deliveryButtonLabel',
      'savingLabel',
      'backgroundColor',
      'textColor',
    ],
    cartCoupon: ['visible', 'couponCode', 'couponSavings'],
    cartDrawerStyle: [
      'backgroundColor',
      'surfaceColor',
      'textColor',
      'mutedColor',
      'borderColor',
      'accentColor',
      'footerBackground',
      'showTopAccentBar',
    ],
  },
  CartDrawerV2: {
    cartDrawerHeader: [
      'visible',
      'titlePrefix',
      'detailsTitle',
      'deliveryTitle',
      'paymentTitle',
      'showOrderBadge',
      'orderBadgePrefix',
      'itemCountSuffix',
    ],
    cartStepNav: ['visible', 'step1Label', 'step2Label', 'step3Label', 'step4Label', 'accentColor'],
    cartLineItem: [
      'visible',
      'showUnitPrice',
      'showRemove',
      'emptyMessage',
      'loadingMessage',
      'imageRadius',
    ],
    cartBill: [
      'visible',
      'subtotalLabel',
      'taxLabel',
      'deliveryLabel',
      'totalLabel',
      'pickupLabel',
      'discountLabel',
    ],
    cartCta: [
      'visible',
      'cartButtonLabel',
      'detailsButtonLabel',
      'deliveryButtonLabel',
      'savingLabel',
      'backgroundColor',
      'textColor',
    ],
    cartCoupon: ['visible', 'couponCode', 'couponSavings', 'showOnCartStepOnly'],
    cartDrawerStyle: [
      'backgroundColor',
      'surfaceColor',
      'textColor',
      'mutedColor',
      'borderColor',
      'accentColor',
      'footerBackground',
    ],
  },
  CartDrawerV3: {
    cartDrawerHeader: [
      'visible',
      'titlePrefix',
      'detailsTitle',
      'deliveryTitle',
      'paymentTitle',
      'orderBadgePrefix',
      'itemCountSuffix',
    ],
    cartStepNav: ['visible', 'step1Label', 'step2Label', 'step3Label', 'step4Label', 'accentColor'],
    cartLineItem: [
      'visible',
      'showUnitPrice',
      'showRemove',
      'emptyMessage',
      'loadingMessage',
      'imageRadius',
    ],
    cartBill: [
      'visible',
      'subtotalLabel',
      'taxLabel',
      'deliveryLabel',
      'totalLabel',
      'pickupLabel',
      'discountLabel',
    ],
    cartCta: [
      'visible',
      'cartButtonLabel',
      'detailsButtonLabel',
      'deliveryButtonLabel',
      'savingLabel',
      'backgroundColor',
      'textColor',
    ],
    cartCoupon: ['visible', 'couponCode', 'couponSavings'],
    cartDrawerStyle: [
      'backgroundColor',
      'surfaceColor',
      'textColor',
      'mutedColor',
      'borderColor',
      'accentColor',
      'footerBackground',
    ],
  },
}

export type CartDrawerFieldGroup = {
  label: string
  keys: readonly string[]
}

/** Groups checkout-step-related fields in the properties panel. */
export const CART_DRAWER_CHILD_FIELD_GROUPS: Partial<
  Record<CartDrawerChildType, CartDrawerFieldGroup[]>
> = {
  cartDrawerHeader: [
    { label: 'General', keys: ['visible', 'eyebrow'] },
    { label: 'Cart step', keys: ['titlePrefix'] },
    { label: 'Details step', keys: ['detailsTitle'] },
    { label: 'Delivery step', keys: ['deliveryTitle'] },
    { label: 'Payment step', keys: ['paymentTitle'] },
    { label: 'Order info', keys: ['showOrderBadge', 'orderBadgePrefix', 'itemCountSuffix'] },
  ],
  cartStepNav: [
    { label: 'General', keys: ['visible', 'accentColor'] },
    { label: 'Cart step', keys: ['step1Label'] },
    { label: 'Details step', keys: ['step2Label'] },
    { label: 'Delivery step', keys: ['step3Label'] },
    { label: 'Payment step', keys: ['step4Label'] },
  ],
  cartCta: [
    { label: 'General', keys: ['visible', 'savingLabel', 'backgroundColor', 'textColor'] },
    { label: 'Cart step', keys: ['cartButtonLabel'] },
    { label: 'Details step', keys: ['detailsButtonLabel'] },
    { label: 'Delivery step', keys: ['deliveryButtonLabel'] },
  ],
  cartLineItem: [
    { label: 'Display', keys: ['visible', 'showUnitPrice', 'showRemove', 'imageRadius'] },
    { label: 'Messages', keys: ['emptyMessage', 'loadingMessage'] },
  ],
  cartBill: [
    { label: 'Display', keys: ['visible'] },
    { label: 'Labels', keys: ['subtotalLabel', 'taxLabel', 'deliveryLabel', 'totalLabel', 'pickupLabel', 'discountLabel'] },
  ],
  cartCoupon: [
    { label: 'Coupon', keys: ['visible', 'couponCode', 'couponSavings', 'showOnCartStepOnly'] },
  ],
  cartDrawerStyle: [
    { label: 'Colors', keys: ['backgroundColor', 'surfaceColor', 'textColor', 'mutedColor', 'borderColor', 'accentColor', 'footerBackground'] },
    { label: 'Accent bar', keys: ['showTopAccentBar'] },
  ],
}

function normalizeCartDrawerVariant(variant: string): CartDrawerVariantId {
  if (variant === 'CartDrawerV2' || variant === 'CartDrawerV3') return variant
  return 'CartDrawerV1'
}

export function getCartDrawerChildPropKeys(
  variant: string,
  childType: string,
): readonly string[] {
  const v = normalizeCartDrawerVariant(variant)
  return CART_DRAWER_VARIANT_CHILD_PROPS[v][childType as CartDrawerChildType] ?? []
}

export function isCartDrawerChildPropVisible(
  variant: string,
  childType: string,
  fieldKey: string,
): boolean {
  return getCartDrawerChildPropKeys(variant, childType).includes(fieldKey)
}

export function getCartDrawerFieldGroups(
  variant: string,
  childType: string,
): CartDrawerFieldGroup[] {
  const allowed = new Set(getCartDrawerChildPropKeys(variant, childType))
  const groups = CART_DRAWER_CHILD_FIELD_GROUPS[childType as CartDrawerChildType] ?? []
  return groups
    .map((group) => ({
      label: group.label,
      keys: group.keys.filter((key) => allowed.has(key)),
    }))
    .filter((group) => group.keys.length > 0)
}

export function getCartDrawerVariantLabel(variant: string): string {
  if (variant === 'CartDrawerV2') return 'Dark Bistro'
  if (variant === 'CartDrawerV3') return 'Minimal'
  return 'Warm'
}

/** Jump studio preview to the checkout step that matches the selected cart part. */
export function getStudioPreviewStepForCartChild(childType?: string | null): number {
  switch (childType) {
    case 'cartDrawerHeader':
    case 'cartStepNav':
    case 'cartLineItem':
    case 'cartBill':
    case 'cartCta':
    case 'cartCoupon':
      return 0
    default:
      return 0
  }
}

/** Suggested preview step when editing a specific property in the studio. */
export function getStudioPreviewStepForCartField(
  childType: string,
  fieldKey: string,
): number | null {
  if (childType === 'cartDrawerHeader') {
    if (fieldKey === 'detailsTitle') return 1
    if (fieldKey === 'deliveryTitle') return 2
    if (fieldKey === 'paymentTitle') return 3
    if (fieldKey === 'titlePrefix' || fieldKey === 'eyebrow' || fieldKey.startsWith('order') || fieldKey === 'showOrderBadge' || fieldKey === 'itemCountSuffix') {
      return 0
    }
  }
  if (childType === 'cartStepNav') {
    if (fieldKey === 'step2Label') return 1
    if (fieldKey === 'step3Label') return 2
    if (fieldKey === 'step4Label') return 3
    if (fieldKey === 'step1Label' || fieldKey === 'visible' || fieldKey === 'accentColor') return 0
  }
  if (childType === 'cartCta') {
    if (fieldKey === 'detailsButtonLabel') return 1
    if (fieldKey === 'deliveryButtonLabel') return 2
    if (fieldKey === 'cartButtonLabel' || fieldKey === 'visible' || fieldKey === 'savingLabel' || fieldKey.endsWith('Color')) {
      return 0
    }
  }
  if (childType === 'cartBill' || childType === 'cartCoupon' || childType === 'cartLineItem') return 0
  return null
}
