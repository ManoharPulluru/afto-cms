'use client'

import { DynamicIcon } from '@/components/ui/DynamicIcon'
import { useCustomerAuthOptional } from '@/providers/CustomerAuthProvider'

type HeaderLogoutButtonProps = {
  iconColor?: string
  hoverColor?: string
  hoverBg?: string
  label?: string
  showLabel?: boolean
  className?: string
}

/** Logout control shown in headers when customer is signed in */
export function HeaderLogoutButton({
  iconColor = '#6b7280',
  hoverColor = '#ef4444',
  hoverBg = 'rgba(0,0,0,0.04)',
  label = 'Logout',
  showLabel = false,
  className = '',
}: HeaderLogoutButtonProps) {
  const auth = useCustomerAuthOptional()
  if (!auth?.isLoggedIn) return null

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={auth.logout}
      className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition ${className}`}
      style={{ color: iconColor }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor
        e.currentTarget.style.backgroundColor = hoverBg
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = iconColor
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <DynamicIcon icon="solar:logout-2-linear" size={18} />
      {showLabel && <span>{label}</span>}
    </button>
  )
}
