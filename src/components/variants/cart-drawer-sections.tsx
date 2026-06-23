'use client'

import { useEffect, useMemo } from 'react'
import type { VariantComponentProps } from '@/lib/registry/types'
import type { CartDrawerVariantId } from '@/lib/cart-drawer-config'
import { getStudioPreviewStepForCartChild } from '@/lib/cart-drawer-variant-config'
import { useCartDrawerOptional } from '@/providers/CartDrawerProvider'
import { buildRegisteredDrawer } from '@/providers/CartDrawerProvider'
import { useCustomerAuthOptional } from '@/providers/CustomerAuthProvider'
import { isStudioRenderContext } from '@/lib/studio-render-context'

type CartDrawerSectionShellProps = VariantComponentProps & {
  variantId: CartDrawerVariantId
}

function CartDrawerSectionShell({ nodeId, props, childNodes, ctx, variantId }: CartDrawerSectionShellProps) {
  const enabled = props.enabled !== false
  const displayAsOverlay = props.displayAsOverlay !== false
  const isStudio = isStudioRenderContext(ctx)
  const selectedChild = childNodes?.find((c) => c.id === ctx.selectedNodeId)
  const isCartDrawerActive = ctx.selectedNodeId === nodeId || Boolean(selectedChild)
  const studioHighlightPart = isStudio ? selectedChild?.type ?? null : null
  const auth = useCustomerAuthOptional()
  const isLoggedIn = auth?.isLoggedIn ?? false
  const cart = useCartDrawerOptional()

  const registered = useMemo(
    () => buildRegisteredDrawer(variantId, props, ctx.store, childNodes),
    [variantId, props, childNodes, ctx.store],
  )

  useEffect(() => {
    if (!enabled) return
    cart?.registerCartDrawer(registered)
  }, [enabled, cart, registered])

  useEffect(() => {
    if (!enabled || !isStudio || !cart) return

    if (isCartDrawerActive) {
      cart.setStudioCartPreview({
        active: true,
        highlightPart: studioHighlightPart,
      })
      cart.setStudioPreviewStep(getStudioPreviewStepForCartChild(studioHighlightPart))
      cart.openCartDrawer()
      return
    }

    if (cart.studioPreview.active) {
      cart.setStudioCartPreview({ active: false, highlightPart: null })
      cart.closeCartDrawer()
    }
  }, [
    enabled,
    isStudio,
    isCartDrawerActive,
    studioHighlightPart,
    cart,
  ])

  if (!enabled) return null

  if (displayAsOverlay) {
    if (isStudio) {
      return null
    }

    if (!isLoggedIn) return null
    return null
  }

  return null
}

export function CartDrawerSectionV1({ childNodes, ...props }: VariantComponentProps) {
  return <CartDrawerSectionShell {...props} childNodes={childNodes} variantId="CartDrawerV1" />
}

export function CartDrawerSectionV2({ childNodes, ...props }: VariantComponentProps) {
  return <CartDrawerSectionShell {...props} childNodes={childNodes} variantId="CartDrawerV2" />
}

export function CartDrawerSectionV3({ childNodes, ...props }: VariantComponentProps) {
  return <CartDrawerSectionShell {...props} childNodes={childNodes} variantId="CartDrawerV3" />
}
