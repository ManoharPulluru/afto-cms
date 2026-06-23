import { NextResponse } from 'next/server'
import { post } from '@/lib/http.service'
import { customerProxyHeaders } from '@/app/api/orders/_utils'

type RouteParams = { params: Promise<{ orderId: string }> }

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { orderId } = await params
    const body = await request.json().catch(() => ({}))
    const data = await post<unknown, unknown>(`/orders/${orderId}/delivery`, body, {
      headers: customerProxyHeaders(request),
    })
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to set delivery'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
