'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CartDrawerByVariant } from '@/components/cart/CartDrawerByVariant'
import { StudioCartStepBar } from '@/components/cart/StudioCartStepBar'
import type { CartDrawerConfig } from '@/components/cart/types'
import type { CartDrawerVariantId } from '@/lib/cart-drawer-config'
import {
  getDarkCartTheme,
  getMinimalCartTheme,
  getWarmCartTheme,
} from '@/components/cart/cart-drawer-themes'

type CartDrawerOverlayProps = {
  variant: CartDrawerVariantId
  config: CartDrawerConfig
  onClose: () => void
  isLoading?: boolean
  isMutating?: boolean
  studioMode?: boolean
  studioHighlightPart?: string
  studioPreviewStep?: number
  onStudioPreviewStepChange?: (step: number) => void
}

const OVERLAY_STYLES: Record<
  CartDrawerVariantId,
  { backdrop: string; panelWrap: string }
> = {
  CartDrawerV1: {
    backdrop: 'bg-black/40 backdrop-blur-sm',
    panelWrap: 'max-w-lg sm:max-w-md md:max-w-lg',
  },
  CartDrawerV2: {
    backdrop: 'bg-black/70 backdrop-blur-md',
    panelWrap: 'max-w-lg',
  },
  CartDrawerV3: {
    backdrop: 'bg-black/25',
    panelWrap: 'max-w-md',
  },
}

function themeForVariant(variant: CartDrawerVariantId, config: CartDrawerConfig) {
  if (config.theme) return config.theme
  if (variant === 'CartDrawerV2') return getDarkCartTheme(config.accentColor)
  if (variant === 'CartDrawerV3') return getMinimalCartTheme(config.accentColor)
  return getWarmCartTheme(config.accentColor)
}

export function CartDrawerOverlay({
  variant,
  config,
  onClose,
  isLoading = false,
  isMutating = false,
  studioMode = false,
  studioHighlightPart,
  studioPreviewStep = 0,
  onStudioPreviewStepChange,
}: CartDrawerOverlayProps) {
  const styles = OVERLAY_STYLES[variant] ?? OVERLAY_STYLES.CartDrawerV1
  const theme = themeForVariant(variant, config)

  useEffect(() => {
    if (studioMode) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, studioMode])

  useEffect(() => {
    if (!studioMode) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [studioMode])

  const drawer = (
    <div
      className="fixed inset-0 z-[200] flex h-[100dvh] max-h-[100dvh] w-full animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <button
        type="button"
        className={`h-[100dvh] min-h-0 flex-1 ${studioMode ? 'bg-black/20' : styles.backdrop}`}
        aria-label={studioMode ? 'Studio cart preview backdrop' : 'Close cart'}
        onClick={studioMode ? undefined : onClose}
        disabled={studioMode}
      />
      <div
        className={`flex h-[100dvh] max-h-[100dvh] w-full shrink-0 flex-col ${styles.panelWrap}`}
        onClick={(e) => e.stopPropagation()}
      >
        {studioMode && onStudioPreviewStepChange && (
          <StudioCartStepBar
            steps={config.steps}
            activeStep={studioPreviewStep}
            theme={theme}
            onStepChange={onStudioPreviewStepChange}
          />
        )}
        <div className="min-h-0 flex-1">
          <CartDrawerByVariant
            variant={variant}
            config={config}
            onClose={studioMode ? undefined : onClose}
            isLoading={isLoading}
            isMutating={isMutating}
            studioHighlightPart={studioHighlightPart}
            studioPreviewStep={studioMode ? studioPreviewStep : undefined}
          />
        </div>
      </div>
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(drawer, document.body)
}
