import type { Order, OrderLineItem } from '@/lib/types/order'

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

function pickNumber(obj: Record<string, unknown>, keys: string[], fallback = 0): number {
  for (const key of keys) {
    const v = obj[key]
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string' && v.trim() && !Number.isNaN(Number(v))) return Number(v)
  }
  return fallback
}

function pickString(obj: Record<string, unknown>, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const v = obj[key]
    if (typeof v === 'string' && v.trim()) return v
    if (typeof v === 'number') return String(v)
  }
  return fallback
}

function mapLineItem(raw: Record<string, unknown>): OrderLineItem | null {
  const id = pickString(raw, ['id', 'orderItemId', 'order_item_id'])
  const productRetailerId = pickString(raw, [
    'product_retailer_id',
    'productRetailerId',
    'retailerId',
    'product_id',
  ])
  if (!id || !productRetailerId) return null

  const quantity = pickNumber(raw, ['quantity', 'qty'], 1)
  const product =
    asRecord(raw.product) ??
    asRecord(raw.productDetails) ??
    asRecord(raw.product_retailer) ??
    asRecord(raw.productRetailer) ??
    raw

  const unitPrice = pickNumber(raw, [
    'unit_price',
    'unitPrice',
    'storePrice',
    'store_price',
    'price',
    'item_price',
    'salePrice',
    'sale_price',
    'regPrice',
    'reg_price',
  ]) || pickNumber(product, ['storePrice', 'store_price', 'salePrice', 'sale_price', 'price', 'regPrice'])

  const lineTotal = pickNumber(
    raw,
    ['line_total', 'lineTotal', 'total_price', 'totalPrice', 'amount', 'item_total', 'itemTotal'],
    unitPrice * quantity,
  )

  return {
    id,
    productRetailerId,
    quantity,
    name: pickString(product, ['displayName', 'display_name', 'name', 'product_name', 'productName', 'itemName'], 'Item'),
    imageUrl: pickString(product, ['imageUrl', 'image_url', 'product_image_url', 'image', 'imageURL'], ''),
    unitPrice: unitPrice || (quantity > 0 ? lineTotal / quantity : 0),
    lineTotal,
  }
}

function readOrderSummary(entity: Record<string, unknown>): Record<string, unknown> | null {
  return asRecord(entity.order_summary) ?? asRecord(entity.orderSummary)
}

export function mapOrderResponse(data: unknown): Order | null {
  const root = asRecord(data)
  if (!root) return null

  const entity = asRecord(root.entity) ?? asRecord(root.data) ?? root
  const id = pickString(entity, ['id', 'orderId', 'order_id'])
  if (!id) return null

  const summary = readOrderSummary(entity)

  const itemsRaw = entity.items ?? entity.order_items ?? entity.orderItems
  const items: OrderLineItem[] = Array.isArray(itemsRaw)
    ? itemsRaw
        .map((item) => mapLineItem(asRecord(item) ?? {}))
        .filter((item): item is OrderLineItem => item !== null)
    : []

  const itemsSubtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)

  const subtotal =
    pickNumber(summary ?? {}, ['subtotal', 'sub_total']) ||
    pickNumber(entity, ['subtotal', 'sub_total', 'items_total', 'itemsTotal']) ||
    itemsSubtotal

  const tax =
    pickNumber(summary ?? {}, ['tax', 'tax_amount', 'taxAmount']) ||
    pickNumber(entity, ['tax', 'tax_amount', 'taxAmount'])

  const couponDiscount =
    pickNumber(summary ?? {}, ['coupon_discount', 'couponDiscount']) ||
    pickNumber(entity, ['coupon_discount', 'couponDiscount'])

  const offerDiscount =
    pickNumber(summary ?? {}, ['offer_discount', 'offerDiscount']) ||
    pickNumber(entity, ['offer_discount', 'offerDiscount'])

  const discount =
    couponDiscount + offerDiscount ||
    pickNumber(entity, ['discount', 'discount_amount', 'discountAmount'])

  const total =
    pickNumber(summary ?? {}, ['total', 'grand_total', 'grandTotal']) ||
    pickNumber(entity, ['total', 'grand_total', 'grandTotal', 'order_total']) ||
    subtotal + tax

  const subtotalAfterDiscount =
    pickNumber(entity, ['subtotal_after_discount', 'subtotalAfterDiscount']) ||
    Math.max(0, subtotal - discount) ||
    subtotal

  const orderNumber =
    pickString(entity, ['order_number', 'orderNumber', 'orderNo', 'number']) ||
    id.slice(-5).toUpperCase()

  return {
    id,
    orderNumber,
    items,
    subtotal: subtotal || total,
    subtotalAfterDiscount: subtotalAfterDiscount || subtotal,
    tax,
    total: total || subtotalAfterDiscount + tax,
    couponBadge:
      discount > 0
        ? `Coupon −${discount.toFixed(2)}`
        : couponDiscount > 0
          ? `Coupon −${couponDiscount.toFixed(2)}`
          : undefined,
  }
}
