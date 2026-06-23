import dns from 'node:dns'
import pg from 'pg'
import { getDbConfig } from '@/lib/db/config'

// Azure Postgres: hostname resolves to IPv6 first; IPv6 often hangs from dev networks.
dns.setDefaultResultOrder('ipv4first')

const { Pool } = pg

declare global {
  // eslint-disable-next-line no-var
  var __aftoPgPool: pg.Pool | undefined
}

function createPool(): pg.Pool {
  const config = getDbConfig()
  return new Pool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
    max: 10,
    connectionTimeoutMillis: 15_000,
    idleTimeoutMillis: 30_000,
  })
}

export function getPool(): pg.Pool {
  if (!global.__aftoPgPool) {
    global.__aftoPgPool = createPool()
  }
  return global.__aftoPgPool
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<pg.QueryResult<T>> {
  return getPool().query<T>(text, params)
}
