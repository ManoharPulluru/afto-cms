import { migrateStore } from '@/lib/migrate-store'
import { loadStoreFromDb, saveStoreToDb, listStoreSlugsFromDb } from '@/lib/db/store-repository'
import { findPageByPath } from '@/lib/tree-utils'
import type { StoreData, StorePage } from '@/lib/types/store'

export { resolveBlock, resolvePageLayout } from '@/lib/resolve-layout'

export async function loadStore(slug?: string): Promise<StoreData> {
  const data = await loadStoreFromDb(slug)
  return migrateStore(data)
}

export async function saveStore(data: StoreData, slug?: string): Promise<void> {
  await saveStoreToDb(migrateStore(data), slug)
}

export function getStorePage(store: StoreData, path: string): StorePage | null {
  return findPageByPath(store.pages, path) ?? null
}

export async function listAvailableStores(): Promise<string[]> {
  return listStoreSlugsFromDb()
}
