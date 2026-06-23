'use client'

import type { CartDrawerConfig } from '@/components/cart/types'
import type { CartDrawerVariantId } from '@/lib/cart-drawer-config'
import {
  CartDrawerWarmPanel,
  CartDrawerDarkPanel,
  CartDrawerMinimalPanel,
  getWarmCartTheme,
  getDarkCartTheme,
  getMinimalCartTheme,
} from '@/components/cart/CartDrawerPanels'

type CartDrawerByVariantProps = {
  variant: CartDrawerVariantId
  config: CartDrawerConfig
  onClose?: () => void
  isLoading?: boolean
  isMutating?: boolean
  studioHighlightPart?: string
  studioPreviewStep?: number
}

export function CartDrawerByVariant({
  variant,
  config,
  onClose,
  isLoading,
  isMutating,
  studioHighlightPart,
  studioPreviewStep,
}: CartDrawerByVariantProps) {
  const panelProps = {
    config,
    onClose,
    isLoading,
    isMutating,
    studioHighlightPart,
    studioPreviewStep,
  }
  switch (variant) {
    case 'CartDrawerV2':
      return (
        <CartDrawerDarkPanel
          {...panelProps}
          theme={config.theme ?? getDarkCartTheme(config.accentColor)}
        />
      )
    case 'CartDrawerV3':
      return (
        <CartDrawerMinimalPanel
          {...panelProps}
          theme={config.theme ?? getMinimalCartTheme(config.accentColor)}
        />
      )
    case 'CartDrawerV1':
    default:
      return (
        <CartDrawerWarmPanel
          {...panelProps}
          theme={config.theme ?? getWarmCartTheme(config.accentColor)}
        />
      )
  }
}
