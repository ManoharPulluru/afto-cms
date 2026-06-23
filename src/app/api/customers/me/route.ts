import { NextResponse } from 'next/server'
import { get, put } from '@/lib/http.service'

function customerHeaders(request: Request): Record<string, string> {
  const auth = request.headers.get('authorization')
  return auth ? { Authorization: auth } : {}
}

export async function GET(request: Request) {
  try {
    const data = await get<unknown>('/customers/me', {
      headers: customerHeaders(request),
    })
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load customer profile'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const data = await put<unknown, unknown>('/customers/me', body, {
      headers: customerHeaders(request),
    })
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update customer profile'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
