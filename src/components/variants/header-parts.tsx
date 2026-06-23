'use client'

import type { VariantComponentProps } from '@/lib/registry/types'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import { useHeaderAccountState } from '@/hooks/useHeaderAccountState'

/** Renders store name title (header slot) */
export function StoreNameV1({ props }: VariantComponentProps) {
  const text = (props.text as string) || ''
  const appearance = props.appearance as string | undefined
  const textColor = (props.textColor as string) || '#0F1419'
  const fontSize = Number(props.fontSize) || 20
  const mobileFontSize = Number(props.mobileFontSize) || 11

  if (!text) return null

  if (appearance === 'glass-mobile') {
    return (
      <span
        className="truncate font-semibold leading-tight tracking-tight"
        style={{ color: textColor, fontSize: `${mobileFontSize}px` }}
      >
        {text}
      </span>
    )
  }

  return (
    <span
      className="truncate font-semibold leading-tight tracking-tight"
      style={{ color: textColor, fontSize: `${fontSize}px` }}
    >
      {text}
    </span>
  )
}

/** Renders store address line (header slot) */
export function AddressV1({ props }: VariantComponentProps) {
  const text = (props.text as string) || ''
  const appearance = props.appearance as string | undefined
  const textColor = (props.textColor as string) || '#1A1F2E'
  const mobileTextColor = (props.mobileTextColor as string) || textColor
  const fontSize = Number(props.fontSize) || 12
  const showIcon = props.showIcon !== false
  const icon = (props.icon as string) || 'solar:map-point-linear'
  const iconColor = (props.iconColor as string) || textColor

  if (!text) return null

  if (appearance === 'glass-mobile') {
    return (
      <span
        className="flex min-w-0 items-center gap-1 truncate"
        style={{ color: mobileTextColor, fontSize: `${Math.max(9, fontSize - 2)}px` }}
      >
        {showIcon && (
          <DynamicIcon icon={icon} size={12} className="shrink-0" style={{ color: iconColor }} />
        )}
        {text}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {showIcon && <DynamicIcon icon={icon} size={14} className="shrink-0" style={{ color: iconColor }} />}
      <span className="truncate" style={{ color: textColor, fontSize: `${fontSize}px` }}>
        {text}
      </span>
    </div>
  )
}

/** Renders deals / promo button (header slot) */
export function DealsV1({ props }: VariantComponentProps) {
  const label = (props.label as string) || 'Deals'
  const visible = props.visible !== false
  const appearance = props.appearance as string | undefined
  const icon = (props.icon as string) || 'solar:star-fall-minimalistic-linear'
  const gradientStart = (props.gradientStart as string) || (props.accentColor as string) || '#F97316'
  const gradientEnd = (props.gradientEnd as string) || (props.accentColor as string) || '#F97316'
  const textColor = (props.textColor as string) || '#ffffff'
  const borderColor = (props.borderColor as string) || gradientEnd

  if (!visible) return null

  if (appearance === 'glass-mobile') {
    return (
      <button
        type="button"
        className="flex cursor-pointer items-center gap-1 rounded-xl px-2 py-1.5 text-xs font-semibold"
        style={{
          background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
          color: textColor,
          border: `1px solid ${borderColor}`,
        }}
      >
        <DynamicIcon icon={icon} size={12} />
        <span>{label}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition hover:brightness-105"
      style={{
        background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
        color: textColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      <DynamicIcon icon={icon} size={15} />
      {label}
    </button>
  )
}

/** Renders account / login button (Glass Storefront) */
export function AccountV1({ props }: VariantComponentProps) {
  const { isLoggedIn, userName, userEmail, openLogin } = useHeaderAccountState(props)
  const welcomeLabel = (props.welcomeLabel as string) || 'Welcome'
  const loginPrompt = (props.loginPrompt as string) || 'Login or Sign Up'
  const backgroundColor = (props.backgroundColor as string) || 'rgba(248, 250, 249, 0.5)'
  const borderColor = (props.borderColor as string) || 'rgba(232, 245, 232, 0.25)'
  const avatarBg = (props.avatarBg as string) || (props.accentColor as string) || '#F97316'
  const avatarTextColor = (props.avatarTextColor as string) || '#ffffff'
  const loggedOutIcon = (props.loggedOutIcon as string) || 'solar:user-circle-linear'
  const nameColor = (props.nameColor as string) || '#0F1419'
  const subtitleColor = (props.subtitleColor as string) || '#1A1F2E'
  const chevronColor = (props.chevronColor as string) || '#1A1F2E'

  return (
    <button
      type="button"
      onClick={() => {
        if (!isLoggedIn) openLogin()
      }}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2 transition-all duration-300 hover:scale-[1.02]"
      style={{
        backgroundColor,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${borderColor}`,
      }}
    >
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
        style={{ backgroundColor: avatarBg, color: avatarTextColor }}
      >
        {isLoggedIn && userName ? (
          userName.charAt(0).toUpperCase()
        ) : (
          <DynamicIcon icon={loggedOutIcon} size={20} />
        )}
      </div>
      <div className="flex flex-col items-start">
        <span className="text-sm font-semibold leading-tight" style={{ color: nameColor }}>
          {isLoggedIn && userName ? userName : welcomeLabel}
        </span>
        <span className="text-xs leading-tight" style={{ color: subtitleColor }}>
          {isLoggedIn ? userEmail || 'View account' : loginPrompt}
        </span>
      </div>
      <DynamicIcon icon="solar:alt-arrow-down-linear" size={16} style={{ color: chevronColor }} />
    </button>
  )
}

/** Style-only node — edited in properties, applied by header wrapper */
export function HeaderStyleV1(_props: VariantComponentProps) {
  return null
}
