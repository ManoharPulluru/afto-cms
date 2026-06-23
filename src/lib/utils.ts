export function getImageUrl(url: string | undefined | null): string | null {
  if (!url) return null
  return url
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
