'use client'

import type { ReactNode } from 'react'
import type { LoginModalConfig } from '@/components/auth/login-modal/types'
import { OtpPhoneForm, type OtpPhoneFormTheme } from '@/components/auth/login-modal/OtpPhoneForm'
import { useOtpLogin } from '@/hooks/useOtpLogin'
import { RemoteImage } from '@/components/ui/RemoteImage'
import { LoginModalCloseButton } from '@/components/auth/login-modal/LoginModalCloseButton'
import { DynamicIcon } from '@/components/ui/DynamicIcon'

export type LoginModalCardProps = {
  config: LoginModalConfig
  businessId?: string
  onClose?: () => void
  onSuccess?: () => void
}

type CardChromeProps = LoginModalCardProps & {
  theme: OtpPhoneFormTheme
  header: ReactNode | ((otp: ReturnType<typeof useOtpLogin>) => ReactNode)
  otpHeader?: ReactNode | ((otp: ReturnType<typeof useOtpLogin>) => ReactNode)
  footer?: ReactNode
  className?: string
  style?: React.CSSProperties
  closeButton?: {
    backgroundColor: string
    color: string
    borderColor: string
  }
}

function resolveSlot(
  slot: ReactNode | ((otp: ReturnType<typeof useOtpLogin>) => ReactNode) | undefined,
  otp: ReturnType<typeof useOtpLogin>,
): ReactNode {
  if (!slot) return null
  return typeof slot === 'function' ? slot(otp) : slot
}

/** Shared shell: one OTP hook + presentational form; variants only change chrome. */
function LoginModalCardChrome({
  businessId,
  theme,
  header,
  otpHeader,
  footer,
  className,
  style,
  onSuccess,
  onClose,
  closeButton,
}: CardChromeProps) {
  const otp = useOtpLogin({
    businessAccountId: businessId,
    onSuccess: () => onSuccess?.(),
  })

  return (
    <div className={className} style={style}>
      {onClose && (
        <LoginModalCloseButton
          onClose={onClose}
          backgroundColor={closeButton?.backgroundColor ?? '#ffffff'}
          color={closeButton?.color ?? '#1A1F2E'}
          borderColor={closeButton?.borderColor ?? '#E8F5E8'}
        />
      )}
      <OtpPhoneForm
        theme={theme}
        otp={otp}
        header={resolveSlot(header, otp)}
        otpHeader={resolveSlot(otpHeader, otp)}
      />
      {footer}
    </div>
  )
}

/** Warm white card with soft accent orbs */
export function LoginModalWarmCard({ config, businessId, onClose, onSuccess }: LoginModalCardProps) {
  const accent = config.accentColor
  const theme: OtpPhoneFormTheme = {
    accentColor: accent,
    mobilePlaceholder: config.mobilePlaceholder,
    otpButtonLabel: config.otpButtonLabel,
    labelColor: '#1A1F2E',
    inputBorderColor: '#E8F5E8',
    inputBg: '#F8FAF9',
    inputTextColor: '#0F1419',
    uiVariant: 'warm',
  }

  const phoneHeader = (
    <>
      <div
        className="absolute right-0 top-0 h-20 w-20 rounded-full opacity-20 blur-xl sm:h-32 sm:w-32 sm:blur-3xl"
        style={{ backgroundColor: accent }}
      />
      <div
        className="absolute bottom-0 left-0 h-24 w-24 rounded-full opacity-10 blur-xl sm:h-40 sm:w-40 sm:blur-3xl"
        style={{ backgroundColor: accent }}
      />
      <div className="relative z-10 mb-3 flex flex-col items-center sm:mb-6 md:mb-8">
        <div
          className="relative mb-2.5 rounded-full p-2.5 shadow-lg sm:mb-6 sm:p-4 md:p-5"
          style={{ backgroundColor: accent, boxShadow: `${accent}44 0px 16px 32px` }}
        >
          <DynamicIcon icon="lucide:user" size={28} className="text-white sm:h-8 sm:w-8 md:h-10 md:w-10" />
        </div>
        <h2 className="mb-1 text-center text-lg font-bold text-[#0F1419] sm:mb-3 sm:text-2xl md:text-3xl">
          {config.title}
        </h2>
        <p className="text-center text-xs text-[#1A1F2E] sm:text-sm md:text-base">{config.subtitle}</p>
      </div>
    </>
  )

  const otpHeader = (otp: ReturnType<typeof useOtpLogin>) => (
    <>
      <div
        className="absolute right-0 top-0 h-20 w-20 rounded-full opacity-20 blur-xl sm:h-32 sm:w-32 sm:blur-3xl"
        style={{ backgroundColor: accent }}
      />
      <div
        className="absolute bottom-0 left-0 h-24 w-24 rounded-full opacity-10 blur-xl sm:h-40 sm:w-40 sm:blur-3xl"
        style={{ backgroundColor: accent }}
      />
      <div className="relative z-10 mb-3 flex flex-col items-center sm:mb-6 md:mb-8">
        <div
          className="relative mb-2.5 rounded-full p-2.5 shadow-lg sm:mb-6 sm:p-4 md:p-5"
          style={{ backgroundColor: accent, boxShadow: `${accent}44 0px 16px 32px` }}
        >
          <DynamicIcon icon="lucide:smartphone" size={28} className="text-white sm:h-8 sm:w-8 md:h-10 md:w-10" />
        </div>
        <h2 className="mb-1 text-center text-lg font-bold text-[#0F1419] sm:mb-3 sm:text-2xl md:text-3xl">
          Verify OTP
        </h2>
        <p className="text-center text-xs text-[#1A1F2E] sm:text-sm md:text-base">
          We&apos;ve sent a code to {otp.phoneNumber}
        </p>
      </div>
    </>
  )

  return (
    <LoginModalCardChrome
      config={config}
      businessId={businessId}
      theme={theme}
      header={phoneHeader}
      otpHeader={otpHeader}
      onClose={onClose}
      onSuccess={onSuccess}
      className="relative w-full max-w-md overflow-hidden rounded-xl p-3 shadow-lg sm:rounded-2xl sm:p-6 sm:shadow-xl md:p-8"
      style={{ backgroundColor: '#ffffff' }}
    />
  )
}

/** Dark glass card with gradient ring */
export function LoginModalDarkCard({ config, businessId, onClose, onSuccess }: LoginModalCardProps) {
  const accent = config.accentColor
  const theme: OtpPhoneFormTheme = {
    accentColor: accent,
    mobilePlaceholder: config.mobilePlaceholder,
    otpButtonLabel: config.otpButtonLabel,
    labelColor: 'rgba(248, 250, 252, 0.65)',
    inputBorderColor: 'rgba(255, 255, 255, 0.12)',
    inputBg: 'rgba(255, 255, 255, 0.06)',
    inputTextColor: '#f8fafc',
  }

  const header = (otp: ReturnType<typeof useOtpLogin>) => (
    <>
      <div
        className="pointer-events-none absolute -left-8 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: accent }}
      />
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: accent }}
      />
      <div className="relative z-10 mb-5 flex items-start gap-4 sm:mb-7">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
          style={{ borderColor: theme.inputBorderColor, backgroundColor: `${accent}22` }}
        >
          <DynamicIcon
            icon={otp.step === 'otp' ? 'lucide:smartphone' : 'lucide:smartphone'}
            size={22}
            style={{ color: accent }}
          />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="text-xl font-bold tracking-tight text-[#f8fafc] sm:text-2xl">
            {otp.step === 'otp' ? 'Verify OTP' : config.title}
          </h2>
          <p className="mt-1 text-sm" style={{ color: theme.labelColor }}>
            {otp.step === 'otp' ? `Code sent to ${otp.phoneNumber}` : config.subtitle}
          </p>
        </div>
      </div>
    </>
  )

  const footer = (
    <p
      className="relative z-10 mt-4 text-center text-[10px] uppercase tracking-widest"
      style={{ color: theme.labelColor }}
    >
      Secure sign-in · SMS verification
    </p>
  )

  return (
    <div
      className="relative w-full max-w-md overflow-hidden rounded-2xl p-1 shadow-2xl sm:rounded-3xl"
      style={{
        background: `linear-gradient(135deg, ${accent}99, ${accent}22, rgba(255,255,255,0.08))`,
      }}
    >
      <LoginModalCardChrome
        config={config}
        businessId={businessId}
        theme={theme}
        header={header}
        footer={footer}
        onClose={onClose}
        onSuccess={onSuccess}
        closeButton={{
          backgroundColor: 'rgba(15, 20, 25, 0.9)',
          color: '#f8fafc',
          borderColor: 'rgba(255, 255, 255, 0.15)',
        }}
        className="relative overflow-hidden rounded-[14px] p-4 backdrop-blur-xl sm:rounded-[22px] sm:p-7 md:p-8"
        style={{ backgroundColor: 'rgba(15, 20, 25, 0.92)' }}
      />
    </div>
  )
}

/** Split brand panel + OTP form */
export function LoginModalSplitCard({ config, businessId, onClose, onSuccess }: LoginModalCardProps) {
  const accent = config.accentColor
  const storeName = config.storeName ?? 'Your Store'
  const theme: OtpPhoneFormTheme = {
    accentColor: accent,
    mobilePlaceholder: config.mobilePlaceholder,
    otpButtonLabel: config.otpButtonLabel,
    labelColor: '#4B5563',
    inputBorderColor: '#E5E7EB',
    inputBg: '#F9FAFB',
    inputTextColor: '#0F1419',
  }

  const header = (otp: ReturnType<typeof useOtpLogin>) => (
    <div className="mb-4 flex flex-col items-center sm:mb-6 sm:items-start">
      <div
        className="mb-3 flex h-11 w-11 items-center justify-center rounded-full sm:hidden"
        style={{ backgroundColor: `${accent}18`, color: accent }}
      >
        <DynamicIcon icon={otp.step === 'otp' ? 'lucide:smartphone' : 'lucide:user-round'} size={22} />
      </div>
      <h2 className="text-center text-lg font-bold text-[#0F1419] sm:text-left sm:text-2xl">
        {otp.step === 'otp' ? 'Verify OTP' : config.title}
      </h2>
      <p className="mt-1 text-center text-xs text-[#4B5563] sm:text-left sm:text-sm">
        {otp.step === 'otp' ? `Code sent to ${otp.phoneNumber}` : config.subtitle}
      </p>
    </div>
  )

  return (
    <div
      className="relative flex w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl sm:rounded-3xl"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div
        className="hidden w-[38%] flex-col justify-between p-6 text-white sm:flex"
        style={{
          background: `linear-gradient(160deg, ${accent} 0%, ${accent}cc 45%, #0f1419 100%)`,
        }}
      >
        <div>
          {config.logoUrl ? (
            <RemoteImage
              src={config.logoUrl}
              alt={storeName}
              width={48}
              height={48}
              className="mb-4 h-12 w-12 rounded-xl object-cover"
            />
          ) : (
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <DynamicIcon icon="solar:shop-bold-duotone" size={24} className="text-white" />
            </div>
          )}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Member access</p>
          <h3 className="mt-2 text-xl font-bold leading-tight">{storeName}</h3>
        </div>
        <p className="text-xs leading-relaxed text-white/75">
          Order faster, track deliveries, and unlock exclusive deals with one tap sign-in.
        </p>
      </div>

      <div className="relative flex-1 p-4 sm:p-6 md:p-8">
        <LoginModalCardChrome
          config={config}
          businessId={businessId}
          theme={theme}
          header={header}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  )
}

export function LoginModalCardByVariant({
  variant,
  config,
  businessId,
  onClose,
  onSuccess,
}: {
  variant: string
  config: LoginModalConfig
  businessId?: string
  onClose?: () => void
  onSuccess?: () => void
}) {
  switch (variant) {
    case 'LoginModalV2':
      return (
        <LoginModalDarkCard
          config={config}
          businessId={businessId}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )
    case 'LoginModalV3':
      return (
        <LoginModalSplitCard
          config={config}
          businessId={businessId}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )
    case 'LoginModalV1':
    default:
      return (
        <LoginModalWarmCard
          config={config}
          businessId={businessId}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )
  }
}
