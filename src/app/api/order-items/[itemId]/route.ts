import { NextResponse } from 'next/server'
import { del } from '@/lib/http.service'
import { customerProxyHeaders } from '@/app/api/orders/_utils'

type RouteParams = { params: Promise<{ itemId: string }> }

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { itemId } = await params
    const data = await del<unknown>(`/order-items/${itemId}`, {
      headers: customerProxyHeaders(request),
    })
    return NextResponse.json(data ?? { success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to remove item'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
