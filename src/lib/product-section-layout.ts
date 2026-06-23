const DEPRECATED_PRODUCT_CARD_VARIANTS = new Set(['ProductCardV1', 'ProductCardV3', 'ProductCardV8'])

/** Map removed variants to Circle Float for existing storefronts. */
export function normalizeProductCardVariant(variant: string): string {
  if (DEPRECATED_PRODUCT_CARD_VARIANTS.has(variant)) return 'ProductCardV4'
  return variant
}

/** Grid layout per product card variant */
export function getProductSectionGridClass(productCardVariant: string): string {
  const variant = normalizeProductCardVariant(productCardVariant)

  switch (variant) {
    case 'ProductCardV4':
    case 'ProductCardV6':
      return 'grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-5'
    case 'ProductCardV5':
    case 'ProductCardV7':
      return 'grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-x-8'
    case 'ProductCardV9':
      return 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
    default:
      return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
  }
}
