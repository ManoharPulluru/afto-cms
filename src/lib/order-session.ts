/** Active website order + cart checkout step in browser storage (per business). */

const ORDER_STORAGE_PREFIX = 'afto_active_order'
const CART_STEP_STORAGE_PREFIX = 'afto_cart_step'

function orderStorageKey(businessAccountId: string): string {
  return `${ORDER_STORAGE_PREFIX}_${businessAccountId}`
}

function cartStepStorageKey(businessAccountId: string): string {
  return `${CART_STEP_STORAGE_PREFIX}_${businessAccountId}`
}

export function saveActiveOrderId(businessAccountId: string, orderId: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(orderStorageKey(businessAccountId), orderId)
}

export function loadActiveOrderId(businessAccountId: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(orderStorageKey(businessAccountId))
}

export function clearActiveOrderId(businessAccountId: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(orderStorageKey(businessAccountId))
  sessionStorage.removeItem(cartStepStorageKey(businessAccountId))
}

export function saveCartStep(businessAccountId: string, orderId: string, step: number): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(
    cartStepStorageKey(businessAccountId),
    JSON.stringify({ orderId, step }),
  )
}

export function loadCartStep(businessAccountId: string, orderId: string): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(cartStepStorageKey(businessAccountId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as { orderId?: string; step?: number }
    if (parsed.orderId !== orderId) return null
    if (typeof parsed.step !== 'number' || parsed.step < 0) return null
    return parsed.step
  } catch {
    return null
  }
}
