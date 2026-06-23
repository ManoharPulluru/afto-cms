import type { CartDrawerConfig } from '@/components/cart/types'
import { MOCK_CART_ITEMS } from '@/components/cart/mock-cart-data'
import type { Order } from '@/lib/types/order'
import type { StoreData } from '@/lib/types/store'
import { orderToCartDrawerConfig } from '@/lib/order-to-cart-config'

function demoItemsFromStore(store?: StoreData) {
  const products = store?.products?.slice(0, 3) ?? []
  if (products.length === 0) return MOCK_CART_ITEMS

  return products.map((product, index) => ({
    id: product.id || `demo-${index}`,
    name: product.name,
    imageUrl: product.image || '',
    unitPrice: product.price ?? 0,
    quantity: index === 0 ? 2 : 1,
  }))
}

function withDemoTotals(config: CartDrawerConfig): CartDrawerConfig {
  const subtotal = config.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  return {
    ...config,
    subtotal,
    subtotalAfterDiscount: subtotal,
    tax,
    total: subtotal + tax,
  }
}

/** Live order in preview when available; otherwise demo line items for studio editing. */
export function resolveCartPreviewConfig(
  order: Order | null,
  baseConfig: CartDrawerConfig,
  store?: StoreData,
): CartDrawerConfig {
  if (order?.items?.length) {
    return orderToCartDrawerConfig(order, baseConfig)
  }

  if (baseConfig.items.length > 0) {
    return baseConfig
  }

  return withDemoTotals({
    ...baseConfig,
    items: demoItemsFromStore(store),
  })
}
