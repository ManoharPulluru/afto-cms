import type { Product } from '@/lib/types/store'
import type { TemplateApiProduct } from '@/lib/types/product-template'

export function mapTemplateProduct(product: TemplateApiProduct): Product {
  const storePrice = Number.parseFloat(product.storePrice) || 0
  const listPrice = Number.parseFloat(product.price) || 0

  return {
    id: product.retailerId,
    name: product.displayName?.trim() || product.name,
    price: storePrice,
    image: product.imageUrl ?? undefined,
    description: product.description ?? undefined,
    compareAtPrice: listPrice > storePrice ? listPrice : undefined,
    categoryName: product.subcategory?.name ?? product.category?.name ?? undefined,
  }
}
