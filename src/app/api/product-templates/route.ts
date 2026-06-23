import { NextResponse } from 'next/server'
import { get } from '@/lib/http.service'
import { getBackendAuthHeaders, getBusinessAccountIdFromEnv } from '@/lib/backend-auth-headers'
import type { WhatsAppTemplateListResponse } from '@/lib/types/product-template'

export async function GET(request: Request) {
  try {
    const businessId = getBusinessAccountIdFromEnv()
    if (!businessId) {
      return NextResponse.json({ error: 'Business account is not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') ?? '1'
    const limit = searchParams.get('limit') ?? '20'
    const search = searchParams.get('search')

    const query = new URLSearchParams({ page, limit })
    if (search?.trim()) query.set('search', search.trim())

    const path = `/token-wrapper/channel-whatsapp/templates/${businessId}/list?${query.toString()}`
    const data = await get<WhatsAppTemplateListResponse>(path, {
      headers: getBackendAuthHeaders(),
    })

    if (!data.success) {
      return NextResponse.json({ error: data.message || 'Failed to load templates' }, { status: 502 })
    }

    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load templates'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
