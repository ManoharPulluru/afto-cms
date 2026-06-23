'use client'

import { useEffect, useMemo } from 'react'
import type { VariantComponentProps } from '@/lib/registry/types'
import { LoginModalCardByVariant } from '@/components/auth/login-modal/LoginModalCards'
import type { LoginModalConfig } from '@/components/auth/login-modal/types'
import type { LoginModalVariantId } from '@/lib/login-modal-config'
import { useCustomerAuthOptional } from '@/providers/CustomerAuthProvider'
import { StudioIcon } from '@/components/studio/builder/ui/StudioIcon'

function propsToConfig(props: Record<string, unknown>, ctx: VariantComponentProps['ctx']): LoginModalConfig {
  const store = ctx?.store
  return {
    variant: (props.variant as LoginModalVariantId) || 'LoginModalV1',
    title: (props.modalTitle as string) || 'Welcome Back',
    subtitle: (props.modalSubtitle as string) || 'Sign in to access your account',
    accentColor: (props.accentColor as string) || store?.store.primaryColor || '#F97316',
    otpButtonLabel: (props.otpButtonLabel as string) || 'Get OTP',
    mobilePlaceholder: (props.mobilePlaceholder as string) || '98765 43210',
    storeName: store?.store.name,
    logoUrl: store?.store.logo,
  }
}

type LoginModalSectionShellProps = VariantComponentProps & {
  variantId: LoginModalVariantId
}

function LoginModalSectionShell({ nodeId, props, ctx, variantId }: LoginModalSectionShellProps) {
  const enabled = props.enabled !== false
  const displayAsOverlay = props.displayAsOverlay !== false
  const isBuilder = Boolean(ctx.builderMode)
  const isSelected = ctx.selectedNodeId === nodeId
  const auth = useCustomerAuthOptional()

  const config = useMemo(
    () => ({ ...propsToConfig(props, ctx), variant: variantId }),
    [props, ctx, variantId],
  )

  const registerLoginModal = auth?.registerLoginModal
  const unregisterLoginModal = auth?.unregisterLoginModal

  useEffect(() => {
    if (!enabled) return
    registerLoginModal?.({ variantId, config })
  }, [enabled, registerLoginModal, variantId, config])

  useEffect(() => {
    if (!enabled) {
      unregisterLoginModal?.()
      return
    }
    return () => unregisterLoginModal?.()
  }, [enabled, unregisterLoginModal])

  if (!enabled) return null

  // Overlay mode: hidden on the page — opened from header profile / login only
  if (displayAsOverlay) {
    if (isBuilder && isSelected) {
      return (
        <div className="mx-4 my-3 rounded-xl border border-dashed border-teal-500/35 bg-teal-500/5 px-4 py-5 text-center">
          <div className="mb-2 flex justify-center text-teal-400">
            <StudioIcon icon="solar:login-3-bold-duotone" width={28} height={28} />
          </div>
          <p className="text-sm font-medium text-teal-200/90">Login modal</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            Hidden on the live site. Opens when visitors tap Profile / Login in the header.
            Use Preview → click the profile icon to test.
          </p>
        </div>
      )
    }
    return null
  }

  // Inline embed (displayAsOverlay off) — visible in page flow
  const businessId =
    process.env.NEXT_PUBLIC_BUSINESS_ACCOUNT_ID ?? process.env.NEXT_PUBLIC_BUSINESS_ID

  return (
    <section className="flex w-full justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-lg">
        <LoginModalCardByVariant
          variant={variantId}
          config={config}
          businessId={businessId}
          onSuccess={() => auth?.onLoginSuccess()}
        />
      </div>
    </section>
  )
}

export function LoginModalSectionV1(props: VariantComponentProps) {
  return <LoginModalSectionShell {...props} variantId="LoginModalV1" />
}

export function LoginModalSectionV2(props: VariantComponentProps) {
  return <LoginModalSectionShell {...props} variantId="LoginModalV2" />
}

export function LoginModalSectionV3(props: VariantComponentProps) {
  return <LoginModalSectionShell {...props} variantId="LoginModalV3" />
}
