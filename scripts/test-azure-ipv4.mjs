import pg from 'pg'

const configs = [
  {
    label: 'IPv4 aftoqa',
    host: '172.173.137.20',
    user: 'aftoqa',
    ssl: { rejectUnauthorized: false },
  },
  {
    label: 'IPv4 aftoqa@server',
    host: '172.173.137.20',
    user: 'aftoqa@afto-qa-db',
    ssl: { rejectUnauthorized: false },
  },
  {
    label: 'hostname aftoqa',
    host: 'afto-qa-db.postgres.database.azure.com',
    user: 'aftoqa',
    ssl: { rejectUnauthorized: false },
  },
]

for (const c of configs) {
  const client = new pg.Client({
    host: c.host,
    port: 5432,
    user: c.user,
    password: process.env.DB_PASSWORD ?? 'Apple@123',
    database: process.env.DB_DATABASE_NAME ?? 'afto_qa_latest',
    ssl: c.ssl,
    connectionTimeoutMillis: 25_000,
  })
  const t0 = Date.now()
  try {
    await client.connect()
    const r = await client.query('SELECT current_database(), current_user')
    console.log('OK', c.label, `${Date.now() - t0}ms`, r.rows[0])
    await client.end()
    process.exit(0)
  } catch (e) {
    console.log('FAIL', c.label, `${Date.now() - t0}ms`, e instanceof Error ? e.message : e)
    try {
      await client.end()
    } catch {
      /* ignore */
    }
  }
}
process.exit(1)
