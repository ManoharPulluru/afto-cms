'use client'

import { useMemo } from 'react'
import { CartDrawerOverlay } from '@/components/cart/CartDrawerOverlay'
import { resolveCartPreviewConfig } from '@/lib/resolve-cart-preview-config'
import type { StoreData } from '@/lib/types/store'
import { useCartDrawerOptional } from '@/providers/CartDrawerProvider'
import { useOrderCartOptional } from '@/providers/OrderCartProvider'

type CartDrawerLiveOverlayProps = {
  store?: StoreData
}

export function CartDrawerLiveOverlay({ store }: CartDrawerLiveOverlayProps = {}) {
  const cart = useCartDrawerOptional()
  const orderCart = useOrderCartOptional()

  const config = useMemo(() => {
    if (!cart) return null
    return resolveCartPreviewConfig(
      orderCart?.order ?? null,
      cart.registeredDrawer.config,
      store,
    )
  }, [cart, orderCart?.order, store])

  if (!cart?.isOpen || !config) return null

  const isStudioPreview = cart.studioPreview.active

  return (
    <CartDrawerOverlay
      variant={cart.registeredDrawer.variantId}
      config={config}
      isLoading={orderCart?.isLoading ?? false}
      isMutating={orderCart?.isMutating ?? false}
      onClose={isStudioPreview ? () => {} : cart.closeCartDrawer}
      studioMode={isStudioPreview}
      studioHighlightPart={cart.studioPreview.highlightPart ?? undefined}
      studioPreviewStep={cart.studioPreviewStep}
      onStudioPreviewStepChange={cart.setStudioPreviewStep}
    />
  )
}
