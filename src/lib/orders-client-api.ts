import { getBusinessAccountId } from '@/lib/api'
import { getCustomerAccessToken } from '@/lib/customer-session'
import { mapOrderResponse } from '@/lib/map-order-response'
import type { Order, OrderItemPayload } from '@/lib/types/order'

export class OrderNotFoundError extends Error {
  constructor(message = 'Order not found') {
    super(message)
    this.name = 'OrderNotFoundError'
  }
}

function authHeaders(): Record<string, string> {
  const businessAccountId = getBusinessAccountId()
  const token = getCustomerAccessToken(businessAccountId)
  if (!token) throw new Error('Please log in to continue')
  return { Authorization: `Bearer ${token}` }
}

async function parseOrderResponse(res: Response): Promise<Order> {
  const json = await res.json()
  if (!res.ok) {
    const message = typeof json?.error === 'string' ? json.error : 'Order request failed'
    if (res.status === 404) throw new OrderNotFoundError(message)
    throw new Error(message)
  }
  const order = mapOrderResponse(json)
  if (!order) throw new Error('Invalid order response')
  return order
}

export async function createOrder(items: OrderItemPayload[]): Promise<Order> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({
      channel: 'website',
      items,
      channel_metadata: {},
    }),
  })
  return parseOrderResponse(res)
}

export async function fetchOrder(orderId: string): Promise<Order> {
  const res = await fetch(`/api/orders/${orderId}`, {
    headers: authHeaders(),
  })
  return parseOrderResponse(res)
}

export async function addOrderItems(orderId: string, items: OrderItemPayload[]): Promise<Order> {
  const res = await fetch(`/api/orders/${orderId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ items }),
  })
  return parseOrderResponse(res)
}

export async function updateOrderItemQuantity(
  orderId: string,
  itemId: string,
  quantity: number,
): Promise<Order> {
  const res = await fetch(`/api/orders/${orderId}/items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ quantity }),
  })
  return parseOrderResponse(res)
}

export async function deleteOrderItem(itemId: string): Promise<void> {
  const res = await fetch(`/api/order-items/${itemId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(typeof json?.error === 'string' ? json.error : 'Failed to remove item')
  }
}
