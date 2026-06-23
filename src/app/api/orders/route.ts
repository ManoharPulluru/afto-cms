import { NextResponse } from 'next/server'
import { post } from '@/lib/http.service'
import { customerProxyHeaders } from '@/app/api/orders/_utils'
import type { OrderItemPayload } from '@/lib/types/order'

type CreateOrderBody = {
  channel: string
  items: OrderItemPayload[]
  channel_metadata: Record<string, unknown>
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderBody
    const data = await post<unknown, CreateOrderBody>('/orders/', body, {
      headers: customerProxyHeaders(request),
    })
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create order'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
