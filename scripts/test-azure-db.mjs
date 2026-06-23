import dns from 'node:dns'
import pg from 'pg'

dns.setDefaultResultOrder('ipv4first')

const host = 'afto-qa-db.postgres.database.azure.com'
const password = process.env.DB_PASSWORD ?? 'Apple@123'
const database = process.env.DB_DATABASE_NAME ?? 'afto_qa_latest'

const attempts = [
  { user: 'aftoqa', port: 5432, ssl: { rejectUnauthorized: false } },
  { user: 'aftoqa@afto-qa-db', port: 5432, ssl: { rejectUnauthorized: false } },
  { user: 'aftoqa', port: 5432, ssl: false },
  { user: 'aftoqa', port: 5432, ssl: { rejectUnauthorized: false }, host: 'afto-qa-db.postgres.database.azure.com' },
]

for (const a of attempts) {
  const label = `${a.user}@${host}:${a.port} ssl=${Boolean(a.ssl)}`
  const client = new pg.Client({
    host,
    port: a.port,
    user: a.user,
    password,
    database,
    ssl: a.ssl === false ? undefined : a.ssl,
    connectionTimeoutMillis: 10_000,
  })
  const t0 = Date.now()
  try {
    await client.connect()
    const r = await client.query(
      'SELECT current_database(), current_user, version()',
    )
    console.log('OK', label, `${Date.now() - t0}ms`)
    console.log(r.rows[0])
    await client.end()
    process.exit(0)
  } catch (e) {
    console.log('FAIL', label, `${Date.now() - t0}ms`, e instanceof Error ? e.message : e)
    try {
      await client.end()
    } catch {
      /* ignore */
    }
  }
}
process.exit(1)
