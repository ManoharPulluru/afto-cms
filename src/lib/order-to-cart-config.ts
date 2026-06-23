import type { CartDrawerConfig } from '@/components/cart/types'
import type { Order } from '@/lib/types/order'

export function orderToCartDrawerConfig(
  order: Order | null,
  baseConfig: CartDrawerConfig,
): CartDrawerConfig {
  if (!order) return baseConfig

  return {
    ...baseConfig,
    orderNumber: order.orderNumber,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    })),
    subtotal: order.subtotal || order.items.reduce((s, i) => s + i.lineTotal, 0),
    subtotalAfterDiscount: order.subtotalAfterDiscount || order.subtotal,
    tax: order.tax,
    total: order.total,
    couponBadge: order.couponBadge,
  }
}
