import { NextResponse } from 'next/server'
import { get } from '@/lib/http.service'
import { getBackendAuthHeaders, getBusinessAccountIdFromEnv } from '@/lib/backend-auth-headers'
import type { WhatsAppTemplateDetailResponse } from '@/lib/types/product-template'

type RouteContext = { params: Promise<{ templateId: string }> }

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { templateId } = await context.params
    const businessId = getBusinessAccountIdFromEnv()
    if (!businessId) {
      return NextResponse.json({ error: 'Business account is not configured' }, { status: 500 })
    }

    const path = `/token-wrapper/channel-whatsapp/templates/${businessId}/${templateId}`
    const data = await get<WhatsAppTemplateDetailResponse>(path, {
      headers: getBackendAuthHeaders(),
    })

    if (!data.success) {
      return NextResponse.json({ error: data.message || 'Failed to load template' }, { status: 502 })
    }

    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load template'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
