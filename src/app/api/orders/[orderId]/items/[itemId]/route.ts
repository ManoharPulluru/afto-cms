import { NextResponse } from 'next/server'
import { put } from '@/lib/http.service'
import { customerProxyHeaders } from '@/app/api/orders/_utils'

type RouteParams = { params: Promise<{ orderId: string; itemId: string }> }

type UpdateItemBody = {
  quantity: number
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { orderId, itemId } = await params
    const body = (await request.json()) as UpdateItemBody
    const data = await put<unknown, UpdateItemBody>(
      `/orders/${orderId}/items/${itemId}`,
      body,
      { headers: customerProxyHeaders(request) },
    )
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update item'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
