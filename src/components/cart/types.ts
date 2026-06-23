import type { CartDrawerVariantId } from '@/lib/cart-drawer-config'

export type CartDrawerStep = {
  id: string
  label: string
}

export type CartLineItem = {
  id: string
  name: string
  imageUrl: string
  unitPrice: number
  quantity: number
  note?: string
}

export type CartDrawerParts = {
  header: {
    visible: boolean
    eyebrow: string
    titlePrefix: string
    detailsTitle: string
    deliveryTitle: string
    paymentTitle: string
    showOrderBadge: boolean
    orderBadgePrefix: string
    itemCountSuffix: string
  }
  stepNav: {
    visible: boolean
    accentColor: string
  }
  lineItem: {
    visible: boolean
    showUnitPrice: boolean
    showRemove: boolean
    emptyMessage: string
    loadingMessage: string
    imageRadius: number
  }
  bill: {
    visible: boolean
    subtotalLabel: string
    taxLabel: string
    deliveryLabel: string
    totalLabel: string
    pickupLabel: string
    discountLabel: string
  }
  cta: {
    visible: boolean
    cartButtonLabel: string
    detailsButtonLabel: string
    deliveryButtonLabel: string
    savingLabel: string
    backgroundColor: string
    textColor: string
  }
  coupon: {
    visible: boolean
    couponCode: string
    couponSavings: string
    showOnCartStepOnly: boolean
  }
  style: {
    showTopAccentBar: boolean
  }
}

export type CartDrawerConfig = {
  variant: CartDrawerVariantId
  orderNumber: string
  titlePrefix: string
  accentColor: string
  nextButtonLabel: string
  couponCode: string
  couponSavings: string
  steps: CartDrawerStep[]
  items: CartLineItem[]
  subtotal: number
  subtotalAfterDiscount: number
  tax: number
  total: number
  couponBadge?: string
  storeAddress?: string
  theme?: CartDrawerTheme
  parts?: CartDrawerParts
}

export type CartDrawerTheme = {
  accent: string
  background: string
  text: string
  muted: string
  border: string
  surface: string
  stepInactiveBg: string
  stepInactiveText: string
  success: string
  successBg: string
  successBorder: string
  footerBg: string
}
