import { getBusinessAccountId } from '@/lib/api'
import { getCustomerAccessToken } from '@/lib/customer-session'
import { mapCustomerProfile } from '@/lib/map-customer-response'
import type { CustomerProfile, UpdateCustomerProfilePayload } from '@/lib/types/customer'

function authHeaders(): Record<string, string> {
  const token = getCustomerAccessToken(getBusinessAccountId())
  if (!token) throw new Error('Please log in to continue')
  return { Authorization: `Bearer ${token}` }
}

async function parseCustomerResponse(res: Response): Promise<CustomerProfile> {
  const json = await res.json()
  if (!res.ok) {
    throw new Error(typeof json?.error === 'string' ? json.error : 'Customer request failed')
  }
  const profile = mapCustomerProfile(json)
  if (!profile) throw new Error('Invalid customer response')
  return profile
}

export async function fetchCustomerProfile(): Promise<CustomerProfile> {
  const res = await fetch('/api/customers/me', { headers: authHeaders() })
  return parseCustomerResponse(res)
}

export async function updateCustomerProfile(
  payload: UpdateCustomerProfilePayload,
): Promise<CustomerProfile> {
  const res = await fetch('/api/customers/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  return parseCustomerResponse(res)
}
