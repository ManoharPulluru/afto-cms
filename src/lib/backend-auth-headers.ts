/** Headers required by Afto token-wrapper endpoints. */
export function getBackendAuthHeaders(): Record<string, string> {
  const token =
    process.env.AFTO_EXTERNAL_TOKEN ??
    process.env.NEXT_PUBLIC_AFTO_EXTERNAL_TOKEN ??
    ''

  if (!token) {
    throw new Error('AFTO_EXTERNAL_TOKEN is not configured')
  }

  return {
    accept: 'application/json, text/plain, */*',
    'x-external-token': token,
    'x-platform': 'afto-web',
  }
}

export function getBusinessAccountIdFromEnv(): string {
  return (
    process.env.NEXT_PUBLIC_BUSINESS_ACCOUNT_ID ??
    process.env.NEXT_PUBLIC_BUSINESS_ID ??
    process.env.BUSINESS_ID ??
    ''
  )
}
