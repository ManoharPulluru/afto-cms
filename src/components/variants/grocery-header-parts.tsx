'use client'

import Link from 'next/link'
import type { VariantComponentProps } from '@/lib/registry/types'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import { RemoteImage } from '@/components/ui/RemoteImage'
import { useHeaderAccountState } from '@/hooks/useHeaderAccountState'

/** Grocery nav link — one per Home / Orders / Rewards / Coupons */
export function NavLinkV1({ props }: VariantComponentProps) {
  const label = (props.label as string) || 'Link'
  const href = (props.href as string) || '#'
  const icon = props.icon as string | undefined
  const textColor = (props.textColor as string) || '#4b5563'
  const hoverColor = (props.hoverColor as string) || (props.accentColor as string) || '#6bb252'
  const iconColor = (props.iconColor as string) || textColor
  const fontSize = Number(props.fontSize) || 13
  const visible = props.visible !== false

  if (!visible) return null

  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-2.5 py-2 font-semibold transition-colors"
      style={{ color: textColor, fontSize: `${fontSize}px` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = textColor
      }}
    >
      {icon && (
        <DynamicIcon icon={icon} size={16} className="shrink-0" style={{ color: iconColor }} />
      )}
      {label}
    </Link>
  )
}

/** Grocery profile / account button */
export function GroceryAccountV1({ props }: VariantComponentProps) {
  const { isLoggedIn, userName, openLogin } = useHeaderAccountState(props)
  const showAvatar = props.showAvatar !== false
  const avatarUrl = props.avatarUrl as string | undefined
  const avatarBg = (props.avatarBg as string) || (props.accentColor as string) || '#6bb252'
  const avatarTextColor = (props.avatarTextColor as string) || '#ffffff'
  const nameColor = (props.nameColor as string) || '#374151'
  const iconColor = (props.iconColor as string) || '#6b7280'
  const hoverBg = (props.hoverBg as string) || 'rgba(0,0,0,0.04)'
  const loggedOutIcon = (props.loggedOutIcon as string) || 'solar:user-linear'

  if (isLoggedIn && userName) {
    return (
      <button
        type="button"
        aria-label="Account"
        className="flex shrink-0 items-center gap-2 rounded-lg px-1.5 py-1 transition"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = hoverBg
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        {showAvatar &&
          (avatarUrl ? (
            <RemoteImage
              src={avatarUrl}
              alt={userName}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
              style={{ backgroundColor: avatarBg, color: avatarTextColor }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
          ))}
        <span
          className="hidden max-w-[120px] truncate text-sm font-semibold sm:inline"
          style={{ color: nameColor }}
        >
          {userName}
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label="Login"
      onClick={openLogin}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition"
      style={{ color: iconColor }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverBg
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <DynamicIcon icon={loggedOutIcon} size={18} />
    </button>
  )
}

/** Grocery theme (light/dark) toggle pill */
export function ThemeToggleV1({ props }: VariantComponentProps) {
  const backgroundColor = (props.backgroundColor as string) || (props.accentColor as string) || '#6bb252'
  const knobColor = (props.knobColor as string) || '#ffffff'
  const icon = (props.icon as string) || 'solar:sun-linear'
  const iconColor = (props.iconColor as string) || backgroundColor

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      title="Theme"
      className="relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{ backgroundColor }}
    >
      <span
        className="absolute left-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full shadow-sm"
        style={{ backgroundColor: knobColor }}
      >
        <DynamicIcon icon={icon} size={11} style={{ color: iconColor }} />
      </span>
    </button>
  )
}

/** Bar styling — applied by header wrapper, not rendered directly */
export function GroceryBarStyleV1(_props: VariantComponentProps) {
  return null
}
