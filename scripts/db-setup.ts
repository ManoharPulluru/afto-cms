#!/usr/bin/env tsx
/**
 * Creates the websites-cms database (if needed), runs migrations,
 * seeds component_definitions from the code registry, and seeds website config from JSON.
 *
 * Usage:
 *   npm run db:setup
 *
 * Required env (see .env.example):
 *   DB_HOST, DB_USERNAME, DB_PASSWORD
 *   DB_BOOTSTRAP_DATABASE=afto_qa_latest  (existing DB used to CREATE DATABASE)
 *   CMS_DB_NAME=websites-cms
 */
import dns from 'node:dns'
import 'dotenv/config'
import fs from 'fs/promises'

dns.setDefaultResultOrder('ipv4first')
import path from 'path'
import pg from 'pg'
import { uuidv7 } from 'uuidv7'
import { fileURLToPath } from 'url'
import { componentRegistry } from '../src/lib/registry/index'
import type { StoreData } from '../src/lib/types/store'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

function pgClient(database: string): pg.Client {
  return new pg.Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database,
    ssl: process.env.DB_SSL === 'false' ? undefined : { rejectUnauthorized: false },
    connectionTimeoutMillis: 20_000,
  })
}

async function ensureDatabase(bootstrapDb: string, cmsDb: string): Promise<void> {
  const client = pgClient(bootstrapDb)
  await client.connect()
  try {
    const exists = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [cmsDb])
    if (exists.rowCount === 0) {
      console.log(`Creating database "${cmsDb}"...`)
      await client.query(`CREATE DATABASE "${cmsDb}"`)
      console.log('Database created.')
    } else {
      console.log(`Database "${cmsDb}" already exists.`)
    }
  } finally {
    await client.end()
  }
}

async function runMigration(cmsDb: string): Promise<void> {
  const sqlPath = path.join(ROOT, 'db/migrations/001_initial.sql')
  const sql = await fs.readFile(sqlPath, 'utf-8')
  const client = pgClient(cmsDb)
  await client.connect()
  try {
    console.log('Running migration 001_initial.sql...')
    await client.query(sql)
    console.log('Migration complete.')
  } finally {
    await client.end()
  }
}

async function seedComponents(cmsDb: string): Promise<number> {
  const client = pgClient(cmsDb)
  await client.connect()
  let count = 0
  try {
    console.log('Seeding component_definitions from registry...')
    for (const component of componentRegistry) {
      for (const variant of component.variants) {
        await client.query(
          `INSERT INTO component_definitions (
            id, type, variant, label, category, description, preview_color,
            default_props, field_schema, allowed_child_types, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10, true)
          ON CONFLICT (type, variant) DO UPDATE SET
            label = EXCLUDED.label,
            category = EXCLUDED.category,
            description = EXCLUDED.description,
            preview_color = EXCLUDED.preview_color,
            default_props = EXCLUDED.default_props,
            field_schema = EXCLUDED.field_schema,
            allowed_child_types = EXCLUDED.allowed_child_types,
            is_active = true,
            updated_at = now()`,
          [
            uuidv7(),
            component.type,
            variant.id,
            variant.label,
            component.category,
            variant.description ?? null,
            variant.previewColor ?? null,
            JSON.stringify(variant.defaultProps ?? {}),
            JSON.stringify(variant.fields ?? []),
            component.allowedChildTypes ?? [],
          ],
        )
        count += 1
      }
    }
    console.log(`Seeded ${count} component variants.`)
    return count
  } finally {
    await client.end()
  }
}

async function seedWebsiteConfig(
  cmsDb: string,
  storeJsonPath: string,
  businessId: string,
): Promise<void> {
  const raw = await fs.readFile(storeJsonPath, 'utf-8')
  const data = JSON.parse(raw) as StoreData

  const client = pgClient(cmsDb)
  await client.connect()
  try {
    console.log(`Seeding business ${businessId} (${data.store.slug})...`)

    await client.query(
      `INSERT INTO businesses (id, name, slug)
       VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, updated_at = now()`,
      [businessId, data.store.name, data.store.slug],
    )

    const bizRow = await client.query<{ id: string }>(
      `SELECT id FROM businesses WHERE slug = $1`,
      [data.store.slug],
    )
    const resolvedId = bizRow.rows[0]?.id ?? businessId

    await client.query(
      `INSERT INTO website_configs (business_id, published_config, version, published_at)
       VALUES ($1, $2::jsonb, 1, now())
       ON CONFLICT (business_id) DO UPDATE SET
         published_config = EXCLUDED.published_config,
         version = website_configs.version + 1,
         published_at = now(),
         updated_at = now()`,
      [resolvedId, JSON.stringify(data)],
    )

    console.log(`Website config seeded for business_id=${resolvedId}`)
    console.log(`Set BUSINESS_ID=${resolvedId} in .env`)
  } finally {
    await client.end()
  }
}

async function main(): Promise<void> {
  const bootstrapDb = process.env.DB_BOOTSTRAP_DATABASE ?? 'afto_qa_latest'
  const cmsDb = process.env.CMS_DB_NAME ?? process.env.DB_DATABASE_NAME ?? 'websites-cms'
  const storeSlug = process.env.STORE_SLUG ?? 'namastesupermarket'
  const storeJsonPath =
    process.env.SEED_STORE_JSON ??
    path.join(ROOT, 'data/stores', `${storeSlug}.json`)

  let businessId = process.env.BUSINESS_ID
  if (!businessId) {
    businessId = uuidv7()
    console.log(`Generated BUSINESS_ID (uuid v7): ${businessId}`)
  }

  if (!process.env.DB_HOST || !process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
    throw new Error('Missing DB_HOST, DB_USERNAME, or DB_PASSWORD')
  }

  console.log(`Bootstrap DB: ${bootstrapDb}`)
  console.log(`CMS DB: ${cmsDb}`)
  console.log(`Store JSON: ${storeJsonPath}`)

  await ensureDatabase(bootstrapDb, cmsDb)
  await runMigration(cmsDb)
  await seedComponents(cmsDb)
  await seedWebsiteConfig(cmsDb, storeJsonPath, businessId)

  console.log('\nDone. Add to .env:')
  console.log(`DB_DATABASE_NAME=${cmsDb}`)
  console.log(`BUSINESS_ID=${businessId}`)
}

main().catch((err) => {
  console.error('db:setup failed:', err)
  process.exit(1)
})
