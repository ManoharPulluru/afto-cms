/** Customer auth tokens in browser localStorage (per business). */

export type CustomerSession = {
  customerId: string
  phoneNumber: string
  businessAccountId: string
  accessToken: string
  refreshToken: string
  savedAt: number
}

const STORAGE_PREFIX = 'afto_customer_session'

function storageKey(businessAccountId: string): string {
  return `${STORAGE_PREFIX}_${businessAccountId}`
}

export function saveCustomerSession(session: Omit<CustomerSession, 'savedAt'>): void {
  if (typeof window === 'undefined') return
  const payload: CustomerSession = { ...session, savedAt: Date.now() }
  localStorage.setItem(storageKey(session.businessAccountId), JSON.stringify(payload))
}

export function loadCustomerSession(businessAccountId: string): CustomerSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(storageKey(businessAccountId))
    if (!raw) return null
    return JSON.parse(raw) as CustomerSession
  } catch {
    return null
  }
}

export function clearCustomerSession(businessAccountId: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(storageKey(businessAccountId))
}

export function getCustomerAccessToken(businessAccountId: string): string | null {
  return loadCustomerSession(businessAccountId)?.accessToken ?? null
}
