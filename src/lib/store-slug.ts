export function getStoreSlug(): string {
  return process.env.NEXT_PUBLIC_STORE_SLUG || process.env.STORE_SLUG || 'namastesupermarket'
}
