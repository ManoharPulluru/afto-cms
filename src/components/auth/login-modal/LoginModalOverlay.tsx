'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { LoginModalCardByVariant } from '@/components/auth/login-modal/LoginModalCards'
import type { LoginModalConfig } from '@/components/auth/login-modal/types'
import { ModalBackdrop } from '@/components/auth/login-modal/ModalChrome'
import type { LoginModalVariantId } from '@/lib/login-modal-config'

type LoginModalOverlayProps = {
  variant: LoginModalVariantId
  config: LoginModalConfig
  onClose: () => void
  onSuccess: () => void
}

export function LoginModalOverlay({ variant, config, onClose, onSuccess }: LoginModalOverlayProps) {
  const businessId =
    process.env.NEXT_PUBLIC_BUSINESS_ACCOUNT_ID ?? process.env.NEXT_PUBLIC_BUSINESS_ID

  useEffect(() => {
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
  }, [onClose])

  const modal = (
    <ModalBackdrop onClose={onClose}>
      <LoginModalCardByVariant
        variant={variant}
        config={config}
        businessId={businessId}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </ModalBackdrop>
  )

  if (typeof document === 'undefined') return null
  return createPortal(modal, document.body)
}
