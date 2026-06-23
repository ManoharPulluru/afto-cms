/**
 * Proactive access-token refresh using /customer/refresh-token.
 * Schedules refresh shortly before JWT expiry.
 */
import { refreshCustomerToken } from '@/lib/api'
import {
  loadCustomerSession,
  saveCustomerSession,
  clearCustomerSession,
  type CustomerSession,
} from '@/lib/customer-session'

/** Refresh this long before access token expires */
const REFRESH_BUFFER_MS = 60_000

type RefreshCallbacks = {
  onUpdated: (session: CustomerSession) => void
  onExpired: () => void
}

let refreshInFlight: Promise<CustomerSession | null> | null = null

export function parseJwtExp(accessToken: string): number | null {
  try {
    const parts = accessToken.split('.')
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const payload = JSON.parse(atob(padded)) as { exp?: unknown }
    return typeof payload.exp === 'number' ? payload.exp : null
  } catch {
    return null
  }
}

/** Milliseconds until we should call refresh (0 = now). null if exp unknown. */
export function msUntilTokenRefresh(accessToken: string): number | null {
  const exp = parseJwtExp(accessToken)
  if (!exp) return null
  const refreshAt = exp * 1000 - REFRESH_BUFFER_MS
  return Math.max(0, refreshAt - Date.now())
}

export function isAccessTokenExpired(accessToken: string): boolean {
  const exp = parseJwtExp(accessToken)
  if (!exp) return false
  return Date.now() >= exp * 1000
}

export async function refreshStoredCustomerSession(
  businessAccountId: string,
): Promise<CustomerSession | null> {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    const current = loadCustomerSession(businessAccountId)
    if (!current?.refreshToken) return null

    const data = await refreshCustomerToken(current.refreshToken)
    const { accessToken, refreshToken, customerId } = data.entity

    const next: Omit<CustomerSession, 'savedAt'> = {
      customerId: customerId ?? current.customerId,
      phoneNumber: current.phoneNumber,
      businessAccountId: current.businessAccountId,
      accessToken,
      refreshToken: refreshToken ?? current.refreshToken,
    }

    saveCustomerSession(next)
    return loadCustomerSession(businessAccountId)
  })()

  try {
    return await refreshInFlight
  } finally {
    refreshInFlight = null
  }
}

/** Returns a valid access token, refreshing first if expired or about to expire. */
export async function getValidCustomerAccessToken(
  businessAccountId: string,
): Promise<string | null> {
  const session = loadCustomerSession(businessAccountId)
  if (!session?.accessToken) return null

  const ms = msUntilTokenRefresh(session.accessToken)
  if (ms !== null && ms > 0 && !isAccessTokenExpired(session.accessToken)) {
    return session.accessToken
  }

  try {
    const updated = await refreshStoredCustomerSession(businessAccountId)
    return updated?.accessToken ?? null
  } catch {
    clearCustomerSession(businessAccountId)
    return null
  }
}

export function startCustomerTokenRefreshLoop(
  businessAccountId: string,
  callbacks: RefreshCallbacks,
): () => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let cancelled = false

  async function runRefresh() {
    if (cancelled) return

    const current = loadCustomerSession(businessAccountId)
    if (!current?.refreshToken) return

    try {
      const updated = await refreshStoredCustomerSession(businessAccountId)
      if (cancelled) return
      if (updated) {
        callbacks.onUpdated(updated)
        schedule(updated.accessToken)
      }
    } catch {
      if (!cancelled) callbacks.onExpired()
    }
  }

  function schedule(accessToken: string) {
    if (cancelled) return
    if (timeoutId) clearTimeout(timeoutId)

    const ms = msUntilTokenRefresh(accessToken)
    if (ms === null) {
      // Unknown expiry — refresh every 30 minutes as fallback
      timeoutId = setTimeout(() => void runRefresh(), 30 * 60 * 1000)
      return
    }

    if (ms === 0) {
      void runRefresh()
      return
    }

    timeoutId = setTimeout(() => void runRefresh(), ms)
  }

  const session = loadCustomerSession(businessAccountId)
  if (session?.accessToken) {
    if (isAccessTokenExpired(session.accessToken) || msUntilTokenRefresh(session.accessToken) === 0) {
      void runRefresh()
    } else {
      schedule(session.accessToken)
    }
  }

  return () => {
    cancelled = true
    if (timeoutId) clearTimeout(timeoutId)
  }
}
