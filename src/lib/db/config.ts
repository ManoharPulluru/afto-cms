export type DbConfig = {
  host: string
  port: number
  user: string
  password: string
  database: string
  ssl: boolean
}

export function getDbConfig(): DbConfig {
  const host = process.env.DB_HOST
  const user = process.env.DB_USERNAME
  const password = process.env.DB_PASSWORD
  const database = process.env.DB_DATABASE_NAME ?? process.env.CMS_DB_NAME ?? 'websites-cms'

  if (!host || !user || !password) {
    throw new Error(
      'Database not configured. Set DB_HOST, DB_USERNAME, DB_PASSWORD, and DB_DATABASE_NAME (or CMS_DB_NAME).',
    )
  }

  return {
    host,
    port: Number(process.env.DB_PORT ?? 5432),
    user,
    password,
    database,
    ssl: process.env.DB_SSL !== 'false',
  }
}

export function getBusinessId(): string {
  const id = process.env.BUSINESS_ID
  if (!id) {
    throw new Error('BUSINESS_ID is required (UUID v7 for the store tenant).')
  }
  return id
}
