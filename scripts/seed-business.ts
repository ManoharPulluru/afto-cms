#!/usr/bin/env tsx
/**
 * Seed a business with blank or full website config.
 *
 *   npm run db:seed -- --slug ajax --name Ajax --blank
 */
import dns from 'node:dns'
import 'dotenv/config'
import pg from 'pg'
import { uuidv7 } from 'uuidv7'
import type { StoreData } from '../src/lib/types/store'

dns.setDefaultResultOrder('ipv4first')

function parseArgs(): {
  slug: string
  name: string
  blank: boolean
  businessId?: string
  email?: string
  password?: string
} {
  const args = process.argv.slice(2)
  let slug = 'ajax'
  let name = 'Ajax'
  let blank = false
  let businessId: string | undefined
  let email: string | undefined
  let password: string | undefined

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug' && args[i + 1]) slug = args[++i]
    else if (args[i] === '--name' && args[i + 1]) name = args[++i]
    else if (args[i] === '--blank') blank = true
    else if (args[i] === '--business-id' && args[i + 1]) businessId = args[++i]
    else if (args[i] === '--email' && args[i + 1]) email = args[++i]
    else if (args[i] === '--password' && args[i + 1]) password = args[++i]
  }

  return { slug, name, blank, businessId, email, password }
}

function blankStoreConfig(
  slug: string,
  name: string,
  email?: string,
  password?: string,
): StoreData {
  const loginEmail = email ?? `admin@${slug}.com`
  const loginPassword = password ?? loginEmail
  return {
    store: {
      name,
      slug,
      primaryColor: '#F97316',
      secondaryColor: '#FFFFFF',
      address: '3037 Clayhill Rd, Mississauga, ON L5B 4L2',
      blankCanvas: true,
    },
    users: [
      {
        email: loginEmail,
        password: loginPassword,
        name: `${name} Admin`,
      },
    ],
    categories: [],
    products: [],
    pages: [{ id: 'home', title: 'Home', slug: '/', tree: [] }],
  }
}

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
  const { slug, name, blank, businessId: argBusinessId, email, password } = parseArgs()
  const businessId = argBusinessId ?? uuidv7()
  const config = blank ? blankStoreConfig(slug, name, email, password) : (() => {
    throw new Error('Non-blank seed: use db:setup with SEED_STORE_JSON for now')
  })()

  const client = pgClient()
  await client.connect()

  try {
    await client.query(
      `INSERT INTO businesses (id, name, slug)
       VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, updated_at = now()`,
      [businessId, name, slug],
    )

    const biz = await client.query<{ id: string }>(`SELECT id FROM businesses WHERE slug = $1`, [slug])
    const resolvedId = biz.rows[0]?.id ?? businessId

    await client.query(
      `INSERT INTO website_configs (business_id, published_config, version, published_at)
       VALUES ($1, $2::jsonb, 1, now())
       ON CONFLICT (business_id) DO UPDATE SET
         published_config = EXCLUDED.published_config,
         version = website_configs.version + 1,
         published_at = now(),
         updated_at = now()`,
      [resolvedId, JSON.stringify(config)],
    )

    console.log(`Seeded business "${name}" (slug=${slug})`)
    console.log(`BUSINESS_ID=${resolvedId}`)
    console.log(`Studio login: ${config.users[0]?.email} / ${config.users[0]?.password}`)
    console.log(`blankCanvas=${Boolean(config.store.blankCanvas)}`)
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error('db:seed failed:', err)
  process.exit(1)
})
