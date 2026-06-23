#!/usr/bin/env tsx
/** Re-seed component_definitions from registry (e.g. after adding login modal section). */
import dns from 'node:dns'
import 'dotenv/config'
import pg from 'pg'
import { uuidv7 } from 'uuidv7'
import { componentRegistry } from '../src/lib/registry/index.ts'

dns.setDefaultResultOrder('ipv4first')

function pgClient(): pg.Client {
  return new pg.Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME ?? process.env.CMS_DB_NAME ?? 'websites-cms',
    ssl: process.env.DB_SSL === 'false' ? undefined : { rejectUnauthorized: false },
    connectionTimeoutMillis: 20_000,
  })
}

async function main(): Promise<void> {
  const client = pgClient()
  await client.connect()
  let count = 0
  try {
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
    console.log(`Upserted ${count} component variants to component_definitions.`)
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
