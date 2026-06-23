import type { LoginModalVariantId } from '@/lib/login-modal-config'

export type LoginModalConfig = {
  variant: LoginModalVariantId
  title: string
  subtitle: string
  accentColor: string
  otpButtonLabel: string
  mobilePlaceholder: string
  storeName?: string
  logoUrl?: string
}

export type LoginModalOpenOptions = Partial<
  Omit<LoginModalConfig, 'variant'> & { variant?: LoginModalVariantId }
>
