'use client'

import { useCustomerAuthOptional } from '@/providers/CustomerAuthProvider'
import { useCartDrawerOptional } from '@/providers/CartDrawerProvider'

type UseHeaderCartStateOptions = {
  /** When true, cart opens only for logged-in visitors (live storefront). */
  requireLogin?: boolean
}

/** Opens the page cart drawer when a cart drawer section is registered */
export function useHeaderCartState(options?: UseHeaderCartStateOptions) {
  const cart = useCartDrawerOptional()
  const auth = useCustomerAuthOptional()
  const isLoggedIn = auth?.isLoggedIn ?? false
  const requireLogin = options?.requireLogin ?? true

  const openCart = () => {
    if (requireLogin && !isLoggedIn) {
      auth?.openLoginModal()
      return
    }
    cart?.openCartDrawer()
  }

  return {
    openCart,
    isLoggedIn,
    hasCartDrawer: cart?.hasCartDrawer ?? false,
  }
}
