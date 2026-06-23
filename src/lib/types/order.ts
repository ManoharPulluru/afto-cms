export type OrderItemPayload = {
  product_retailer_id: string
  quantity: number
  applied_template: unknown[]
}

export type OrderLineItem = {
  id: string
  productRetailerId: string
  quantity: number
  name: string
  imageUrl: string
  unitPrice: number
  lineTotal: number
}

export type Order = {
  id: string
  orderNumber: string
  items: OrderLineItem[]
  subtotal: number
  subtotalAfterDiscount: number
  tax: number
  total: number
  couponBadge?: string
}
