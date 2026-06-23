import { NextResponse } from 'next/server'
import { post } from '@/lib/http.service'
import { customerProxyHeaders } from '@/app/api/orders/_utils'

/**
 * Legacy route — qa3 does not implement POST /payments/intent correctly.
 * Proxies to POST /orders/{orderId}/confirm which returns payment_intent.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const orderId =
      (typeof body.order_id === 'string' && body.order_id) ||
      (typeof body.orderId === 'string' && body.orderId) ||
      ''

    if (!orderId) {
      return NextResponse.json({ error: 'order_id is required' }, { status: 400 })
    }

    const { order_id: _a, orderId: _b, ...rest } = body
    const data = await post<unknown, unknown>(`/orders/${orderId}/confirm`, rest, {
      headers: customerProxyHeaders(request),
    })
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create payment intent'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
