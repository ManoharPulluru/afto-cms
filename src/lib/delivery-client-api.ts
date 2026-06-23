import { getBusinessAccountId } from '@/lib/api'
import { getCustomerAccessToken } from '@/lib/customer-session'
import { mapDeliveryChargeResponse } from '@/lib/map-delivery-response'
import type { DeliveryChargeInfo } from '@/lib/types/delivery'

function authHeaders(): Record<string, string> {
  const token = getCustomerAccessToken(getBusinessAccountId())
  if (!token) throw new Error('Please log in to continue')
  return { Authorization: `Bearer ${token}` }
}

async function parseJson(res: Response): Promise<unknown> {
  const json = await res.json()
  if (!res.ok) {
    const message =
      typeof json === 'object' && json !== null && 'error' in json
        ? String((json as { error: unknown }).error)
        : typeof json === 'object' && json !== null && 'message' in json
          ? String((json as { message: unknown }).message)
          : 'Delivery request failed'
    throw new Error(message)
  }
  return json
}

export async function fetchDeliveryCharges(
  orderId: string,
  destinationAddress: string,
  fallbackStoreAddress = '',
): Promise<DeliveryChargeInfo> {
  const res = await fetch(`/api/delivery-charges/${orderId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ destination_address: destinationAddress }),
  })
  const json = await parseJson(res)
  return mapDeliveryChargeResponse(json, fallbackStoreAddress)
}

export async function submitOrderPickup(
  orderId: string,
  pickupInstructions?: string,
): Promise<void> {
  const body =
    pickupInstructions?.trim() ? { pickup_instructions: pickupInstructions.trim() } : {}

  const res = await fetch(`/api/orders/${orderId}/pickup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  })
  await parseJson(res)
}

export async function submitOrderDelivery(orderId: string, body: Record<string, unknown> = {}): Promise<void> {
  const res = await fetch(`/api/orders/${orderId}/delivery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  })
  await parseJson(res)
}
