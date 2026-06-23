import { NextResponse } from 'next/server'
import { post } from '@/lib/http.service'
import { customerProxyHeaders } from '@/app/api/orders/_utils'
import type { OrderItemPayload } from '@/lib/types/order'

type RouteParams = { params: Promise<{ orderId: string }> }

type AddItemsBody = {
  items: OrderItemPayload[]
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { orderId } = await params
    const body = (await request.json()) as AddItemsBody
    const data = await post<unknown, AddItemsBody>(`/orders/${orderId}/items`, body, {
      headers: customerProxyHeaders(request),
    })
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add items'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
