import type { CartDrawerConfig } from '@/components/cart/types'

export type ResolvedCartBill = {
  subtotal: number
  subtotalAfterDiscount: number
  tax: number
  deliveryCharge: number
  total: number
  hasCoupon: boolean
}

function finite(n: number, fallback = 0): number {
  return Number.isFinite(n) ? n : fallback
}

export function sumItemsSubtotal(items: CartDrawerConfig['items']): number {
  return items.reduce((sum, item) => sum + finite(item.unitPrice) * finite(item.quantity, 1), 0)
}

/** Normalize bill totals from API config + live delivery charge. */
export function resolveCartBill(
  config: CartDrawerConfig,
  deliveryCharge: number | null,
  deliveryMethod: 'pickup' | 'delivery',
): ResolvedCartBill {
  const fromItems = sumItemsSubtotal(config.items)
  const subtotal = finite(config.subtotal) || fromItems
  const subtotalAfterDiscount = finite(config.subtotalAfterDiscount) || subtotal
  const tax = finite(config.tax)
  const deliveryAmount =
    deliveryMethod === 'delivery' && deliveryCharge !== null ? finite(deliveryCharge) : 0

  const computed = subtotalAfterDiscount + tax + deliveryAmount
  const total = computed > 0 ? computed : finite(config.total)

  return {
    subtotal,
    subtotalAfterDiscount,
    tax,
    deliveryCharge: deliveryAmount,
    total,
    hasCoupon: subtotal > subtotalAfterDiscount + 0.001,
  }
}
