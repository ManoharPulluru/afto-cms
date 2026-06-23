import { query } from '@/lib/db/pool'
import { getBusinessId } from '@/lib/db/config'
import { getStoreSlug } from '@/lib/store-slug'
import type { StoreData } from '@/lib/types/store'

type WebsiteConfigRow = {
  published_config: StoreData
  draft_config: StoreData | null
  version: number
}

export async function loadStoreFromDb(slug?: string): Promise<StoreData> {
  const businessId = process.env.BUSINESS_ID
  const storeSlug = slug ?? getStoreSlug()

  let result
  if (businessId) {
    result = await query<WebsiteConfigRow>(
      `SELECT published_config, draft_config, version
       FROM website_configs
       WHERE business_id = $1`,
      [businessId],
    )
  } else {
    result = await query<WebsiteConfigRow>(
      `SELECT wc.published_config, wc.draft_config, wc.version
       FROM website_configs wc
       INNER JOIN businesses b ON b.id = wc.business_id
       WHERE b.slug = $1`,
      [storeSlug],
    )
  }

  const row = result.rows[0]
  if (!row) {
    throw new Error(
      businessId
        ? `No website config found for business_id=${businessId}`
        : `No website config found for slug=${storeSlug}`,
    )
  }

  return row.published_config
}

export async function saveStoreToDb(data: StoreData, slug?: string): Promise<void> {
  const businessId = process.env.BUSINESS_ID
  const storeSlug = slug ?? data.store.slug ?? getStoreSlug()

  let resolvedBusinessId = businessId
  if (!resolvedBusinessId) {
    const biz = await query<{ id: string }>(
      `SELECT id FROM businesses WHERE slug = $1`,
      [storeSlug],
    )
    resolvedBusinessId = biz.rows[0]?.id
  }

  if (!resolvedBusinessId) {
    throw new Error(`Cannot save: no business found for slug=${storeSlug} and BUSINESS_ID is unset`)
  }

  await query(
    `INSERT INTO website_configs (business_id, published_config, version, published_at, updated_at)
     VALUES ($1, $2::jsonb, 1, now(), now())
     ON CONFLICT (business_id) DO UPDATE SET
       published_config = EXCLUDED.published_config,
       version = website_configs.version + 1,
       published_at = now(),
       updated_at = now()`,
    [resolvedBusinessId, JSON.stringify(data)],
  )

  await query(
    `UPDATE businesses SET name = $2, updated_at = now() WHERE id = $1`,
    [resolvedBusinessId, data.store.name],
  )
}

export async function listStoreSlugsFromDb(): Promise<string[]> {
  const result = await query<{ slug: string }>(
    `SELECT slug FROM businesses ORDER BY slug`,
  )
  return result.rows.map((r) => r.slug)
}

export function getConfiguredBusinessId(): string | undefined {
  try {
    return getBusinessId()
  } catch {
    return process.env.BUSINESS_ID
  }
}
