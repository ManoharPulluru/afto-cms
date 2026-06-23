import type {
  WhatsAppTemplateDetail,
  WhatsAppTemplateDetailResponse,
  WhatsAppTemplateListResponse,
} from '@/lib/types/product-template'

export async function fetchProductTemplatesList(options?: {
  page?: number
  limit?: number
  search?: string
}): Promise<WhatsAppTemplateListResponse['data']> {
  const params = new URLSearchParams()
  params.set('page', String(options?.page ?? 1))
  params.set('limit', String(options?.limit ?? 20))
  if (options?.search?.trim()) params.set('search', options.search.trim())

  const res = await fetch(`/api/product-templates?${params.toString()}`)
  const json = (await res.json()) as WhatsAppTemplateListResponse | { error: string }

  if (!res.ok) {
    throw new Error('error' in json ? json.error : 'Failed to load templates')
  }

  return (json as WhatsAppTemplateListResponse).data
}

export async function fetchProductTemplateDetail(
  templateId: string,
): Promise<WhatsAppTemplateDetail> {
  const res = await fetch(`/api/product-templates/${templateId}`)
  const json = (await res.json()) as WhatsAppTemplateDetailResponse | { error: string }

  if (!res.ok) {
    throw new Error('error' in json ? json.error : 'Failed to load template')
  }

  return (json as WhatsAppTemplateDetailResponse).data
}
