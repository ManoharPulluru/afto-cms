import type { PropField } from '@/lib/registry'

export const CART_DRAWER_VARIANTS = [
  { id: 'CartDrawerV1', label: 'Warm Checkout Drawer' },
  { id: 'CartDrawerV2', label: 'Dark Bistro Drawer' },
  { id: 'CartDrawerV3', label: 'Minimal Slide Drawer' },
] as const

export type CartDrawerVariantId = (typeof CART_DRAWER_VARIANTS)[number]['id']

export const CART_DRAWER_SECTION_FIELDS: PropField[] = [
  { key: 'enabled', label: 'Enable cart drawer', type: 'boolean' },
  { key: 'displayAsOverlay', label: 'Slide-in overlay', type: 'boolean' },
  { key: 'orderNumber', label: 'Order number (preview)', type: 'text' },
]

export const CART_DRAWER_SECTION_DEFAULTS = {
  enabled: true,
  displayAsOverlay: true,
  orderNumber: '28390',
  /** @deprecated use cartDrawerHeader child */
  titlePrefix: 'Your Order',
  /** @deprecated use cartCta child */
  nextButtonLabel: 'Next',
  /** @deprecated use cartCoupon child */
  couponCode: 'FIRSTORDER',
  /** @deprecated use cartCoupon child */
  couponSavings: '−$1.20 saved',
}

export const CART_DRAWER_CHILD_DEFAULTS: Record<string, Record<string, unknown>> = {
  cartDrawerHeader: {
    visible: true,
    eyebrow: 'Your shopping bag',
    titlePrefix: 'Your Order',
    detailsTitle: 'Your Details',
    deliveryTitle: 'How to Get It',
    paymentTitle: 'Complete Payment',
    showOrderBadge: true,
    orderBadgePrefix: 'Order #',
    itemCountSuffix: 'items',
  },
  cartStepNav: {
    visible: true,
    step1Label: 'Cart',
    step2Label: 'Details',
    step3Label: 'Delivery',
    step4Label: 'Payment',
    accentColor: '',
  },
  cartLineItem: {
    visible: true,
    showUnitPrice: true,
    showRemove: true,
    emptyMessage: 'Your cart is empty',
    loadingMessage: 'Loading cart…',
    imageRadius: 12,
  },
  cartBill: {
    visible: true,
    subtotalLabel: 'Subtotal',
    taxLabel: 'Tax',
    deliveryLabel: 'Delivery',
    totalLabel: 'Total',
    pickupLabel: 'Free pickup',
    discountLabel: 'Discount',
  },
  cartCta: {
    visible: true,
    cartButtonLabel: 'Next',
    detailsButtonLabel: 'Choose Delivery',
    deliveryButtonLabel: 'Proceed to Payment',
    savingLabel: 'Saving…',
    backgroundColor: '',
    textColor: '#ffffff',
  },
  cartCoupon: {
    visible: true,
    couponCode: 'FIRSTORDER',
    couponSavings: '−$1.20 saved',
    showOnCartStepOnly: false,
  },
  cartDrawerStyle: {
    backgroundColor: '',
    surfaceColor: '',
    textColor: '',
    mutedColor: '',
    borderColor: '',
    accentColor: '',
    footerBackground: '',
    showTopAccentBar: true,
  },
}
