import { NextResponse } from 'next/server'
import { get } from '@/lib/http.service'
import { customerProxyHeaders } from '@/app/api/orders/_utils'

type RouteParams = { params: Promise<{ orderId: string }> }

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { orderId } = await params
    const data = await get<unknown>(`/orders/${orderId}`, {
      headers: customerProxyHeaders(request),
    })
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load order'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
