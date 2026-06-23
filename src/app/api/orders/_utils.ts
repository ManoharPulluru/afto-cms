import { getBackendAuthHeaders } from '@/lib/backend-auth-headers'

export function customerProxyHeaders(request: Request): Record<string, string> {
  const auth = request.headers.get('authorization')
  return {
    ...getBackendAuthHeaders(),
    ...(auth ? { Authorization: auth } : {}),
  }
}
