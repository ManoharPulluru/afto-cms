import { getBusinessAccountId } from '@/lib/api'
import { getCustomerAccessToken } from '@/lib/customer-session'
import { mapPaymentIntentResponse } from '@/lib/map-payment-response'
import type { ConfirmOrderPayload, PaymentIntentSetup } from '@/lib/types/payment'

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
          : 'Payment request failed'
    throw new Error(message)
  }
  return json
}

export async function prepareOrderPayment(
  orderId: string,
  payload: ConfirmOrderPayload,
): Promise<PaymentIntentSetup> {
  const res = await fetch(`/api/orders/${orderId}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  const json = await parseJson(res)
  const mapped = mapPaymentIntentResponse(json)
  if (!mapped.ok) {
    if (mapped.reason === 'missing_publishable_key') {
      throw new Error(
        'Stripe publishable key is not configured. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env and restart the dev server.',
      )
    }
    if (mapped.reason === 'missing_client_secret') {
      throw new Error('Payment intent was not returned for this order. Try going back and confirming delivery again.')
    }
    throw new Error('Payment is not available for this order yet')
  }
  return mapped.setup
}

/** @deprecated Use prepareOrderPayment — qa3 returns intent from POST /orders/{id}/confirm */
export async function fetchPaymentIntent(orderId: string): Promise<PaymentIntentSetup> {
  return prepareOrderPayment(orderId, {
    customer_details: { email: '' },
  })
}

export async function confirmOrder(orderId: string, payload: ConfirmOrderPayload): Promise<void> {
  const res = await fetch(`/api/orders/${orderId}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  await parseJson(res)
}
