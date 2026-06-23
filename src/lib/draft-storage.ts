import type { StoreData } from '@/lib/types/store'

function draftKey(storeSlug: string): string {
  return `afto-builder-draft-${storeSlug}`
}

export function loadDraftFromStorage(storeSlug: string): StoreData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(draftKey(storeSlug))
    if (!raw) return null
    return JSON.parse(raw) as StoreData
  } catch {
    return null
  }
}

export function saveDraftToStorage(data: StoreData): void {
  if (typeof window === 'undefined') return
  try {
    const key = draftKey(data.store.slug)
    localStorage.setItem(key, JSON.stringify(data))
    localStorage.setItem(`${key}-updatedAt`, String(Date.now()))
  } catch {
    // ignore quota errors
  }
}

export function clearDraftFromStorage(storeSlug: string): void {
  if (typeof window === 'undefined') return
  const key = draftKey(storeSlug)
  localStorage.removeItem(key)
  localStorage.removeItem(`${key}-updatedAt`)
}

export function hasDraftInStorage(storeSlug: string): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(draftKey(storeSlug)) !== null
}
