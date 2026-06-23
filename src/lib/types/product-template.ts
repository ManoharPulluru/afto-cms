export type WhatsAppTemplateListItem = {
  id: string
  businessAccountId: string
  name: string
  metaTemplateId: string
  metaTemplateType: string
  whatsappMainMenu: string
  headerText: string
  bodyText: string
  status: string
  thumbnailUrl?: string
  serialNumber: number
  totalItemsCount: number
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

export type WhatsAppTemplatePagination = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasMore: boolean
}

export type WhatsAppTemplateListResponse = {
  success: boolean
  data: {
    templates: WhatsAppTemplateListItem[]
    pagination: WhatsAppTemplatePagination
  }
  message: string
}

export type TemplateProductBrand = { id: string; name: string }
export type TemplateProductCategory = { id: string; name: string }

export type TemplateApiProduct = {
  retailerId: string
  businessAccountId: string
  name: string
  displayName?: string | null
  description?: string | null
  imageUrl?: string | null
  price: string
  storePrice: string
  brand?: TemplateProductBrand | null
  category?: TemplateProductCategory | null
  subcategory?: TemplateProductCategory | null
}

export type TemplateSectionItem = {
  id: string
  sectionId: string
  productRetailerId: string
  serialNumber: number
  product: TemplateApiProduct
}

export type TemplateSection = {
  id: string
  templateId: string
  title: string
  serialNumber: number
  items: TemplateSectionItem[]
}

export type WhatsAppTemplateDetail = {
  id: string
  businessAccountId: string
  name: string
  headerText: string
  bodyText: string
  thumbnailUrl?: string
  status: string
  sections: TemplateSection[]
}

export type WhatsAppTemplateDetailResponse = {
  success: boolean
  data: WhatsAppTemplateDetail
  message: string
}
