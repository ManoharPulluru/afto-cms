'use client'

import Link from 'next/link'
import type { VariantComponentProps } from '@/lib/registry/types'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import { useHeaderAccountState } from '@/hooks/useHeaderAccountState'
import { useHeaderCartState } from '@/hooks/useHeaderCartState'
import { useOrderCartOptional } from '@/providers/OrderCartProvider'
import { isStudioRenderContext } from '@/lib/studio-render-context'
import { formatPrice } from '@/lib/utils'
import { RemoteImage } from '@/components/ui/RemoteImage'

/** Bistro center-logo nav link with underline hover */
export function BistroNavLinkV1({ props }: VariantComponentProps) {
  const label = (props.label as string) || 'Link'
  const href = (props.href as string) || '#'
  const textColor = (props.textColor as string) || 'rgba(245, 240, 232, 0.6)'
  const hoverColor = (props.hoverColor as string) || '#f5f0e8'
  const underlineColor = (props.underlineColor as string) || (props.accentColor as string) || '#EFB21B'
  const fontSize = Number(props.fontSize) || 10
  const letterSpacing = Number(props.letterSpacing) || 0.15
  const visible = props.visible !== false

  if (!visible) return null

  return (
    <Link
      href={href}
      className="group relative flex h-full flex-shrink-0 items-center whitespace-nowrap px-3 text-[10px] font-bold uppercase transition-colors duration-200 lg:text-xs xl:text-sm"
      style={{ color: textColor, letterSpacing: `${letterSpacing}em`, fontSize: `${fontSize}px` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = textColor
      }}
    >
      {label}
      <span
        className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 transition-all duration-300 group-hover:w-[60%]"
        style={{ backgroundColor: underlineColor }}
      />
    </Link>
  )
}

/** View Menu / Menu CTA button */
export function MenuButtonV1({ props }: VariantComponentProps) {
  const label = (props.label as string) || 'View Menu'
  const mobileLabel = (props.mobileLabel as string) || 'Menu'
  const href = (props.href as string) || '#'
  const textColor = (props.textColor as string) || '#0c0c0c'
  const backgroundColor = (props.backgroundColor as string) || '#EFB21B'
  const borderColor = (props.borderColor as string) || '#EFB21B'
  const visible = props.visible !== false
  const appearance = props.appearance as string | undefined

  if (!visible) return null

  if (appearance === 'bistro-mobile') {
    return (
      <Link
        href={href}
        className="ml-1 flex-shrink-0 whitespace-nowrap border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-300"
        style={{ color: textColor, borderColor, backgroundColor }}
      >
        {mobileLabel}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="relative ml-2 flex flex-shrink-0 items-center gap-1.5 border px-4 py-2 transition-all duration-300"
      style={{ color: textColor, borderColor, backgroundColor }}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest lg:text-xs xl:text-sm">{label}</span>
    </Link>
  )
}

/** Icon-only search button */
export function BistroSearchBtnV1({ props }: VariantComponentProps) {
  const icon = (props.icon as string) || 'lucide:search'
  const iconColor = (props.iconColor as string) || 'rgba(245,240,232,0.65)'
  const hoverColor = (props.hoverColor as string) || '#f5f0e8'
  const iconSize = Number(props.iconSize) || 16
  const mobileIconSize = Number(props.mobileIconSize) || 18
  const appearance = props.appearance as string | undefined
  const size = appearance === 'bistro-mobile' ? mobileIconSize : iconSize

  if (appearance === 'bistro-mobile') {
    return (
      <button
        type="button"
        aria-label="Search"
        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200"
        style={{ color: iconColor }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = hoverColor
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = iconColor
        }}
      >
        <DynamicIcon icon={icon} size={size} />
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label="Search"
      className="flex-shrink-0 p-2 transition-colors duration-200"
      style={{ color: iconColor }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = iconColor
      }}
    >
      <DynamicIcon icon={icon} size={size} />
    </button>
  )
}

/** Icon-only profile button */
export function BistroAccountV1({ props }: VariantComponentProps) {
  const { isLoggedIn, openLogin } = useHeaderAccountState(props)
  const icon = (props.icon as string) || 'lucide:user'
  const iconColor = (props.iconColor as string) || 'rgba(245,240,232,0.65)'
  const hoverColor = (props.hoverColor as string) || '#f5f0e8'
  const iconSize = Number(props.iconSize) || 16

  return (
    <button
      type="button"
      aria-label={isLoggedIn ? 'Profile' : 'Login'}
      onClick={() => {
        if (!isLoggedIn) openLogin()
      }}
      className="flex-shrink-0 p-2 transition-colors duration-200"
      style={{ color: iconColor }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = iconColor
      }}
    >
      <DynamicIcon icon={icon} size={iconSize} />
    </button>
  )
}

/** Bistro store name block (mobile brand) */
export function BistroStoreNameV1({ props }: VariantComponentProps) {
  const text = (props.text as string) || ''
  const tagline = (props.tagline as string) || ''
  const nameColor = (props.nameColor as string) || '#f5f0e8'
  const taglineColor = (props.taglineColor as string) || '#EFB21B'
  const nameFontSize = Number(props.nameFontSize) || 12
  const taglineFontSize = Number(props.taglineFontSize) || 8
  const letterSpacing = Number(props.letterSpacing) || 0.13
  const appearance = props.appearance as string | undefined

  if (appearance !== 'bistro-mobile' || !text) return null

  return (
    <div className="flex flex-col leading-none">
      <span
        className="font-bold uppercase"
        style={{ color: nameColor, fontSize: `${nameFontSize}px`, letterSpacing: `${letterSpacing}em` }}
      >
        {text}
      </span>
      {tagline && (
        <span
          className="uppercase"
          style={{
            color: taglineColor,
            fontSize: `${taglineFontSize}px`,
            letterSpacing: '0.22em',
            opacity: 0.85,
          }}
        >
          {tagline}
        </span>
      )}
    </div>
  )
}

/** Bistro logo with size control */
export function BistroLogoV1({ props }: VariantComponentProps) {
  const imageUrl = (props.imageUrl as string) || ''
  const desktopSize = Number(props.desktopSize) || 68
  const mobileSize = Number(props.mobileSize) || 36
  const hoverScale = Number(props.hoverScale) || 1.05
  const appearance = props.appearance as string | undefined
  const accent = (props.accentColor as string) || '#EFB21B'

  if (!imageUrl) return null

  if (appearance === 'bistro-mobile') {
    return (
      <div
        className="object-contain"
        style={{
          width: mobileSize,
          height: mobileSize,
          filter: `drop-shadow(0 0 6px ${accent}59)`,
        }}
      >
        <RemoteImage
          src={imageUrl}
          alt="Logo"
          width={mobileSize}
          height={mobileSize}
          className="h-full w-full object-contain"
        />
      </div>
    )
  }

  return (
    <div
      className="transition-transform duration-300 group-hover:scale-105"
      style={{ width: desktopSize, height: desktopSize }}
    >
      <RemoteImage
        src={imageUrl}
        alt="Logo"
        width={desktopSize}
        height={desktopSize}
        className="h-full w-full object-contain"
      />
    </div>
  )
}

export function BistroBarStyleV1(_props: VariantComponentProps) {
  return null
}

/** Bistro outline cart with badge + total */
export function BistroCartV1({ props, ctx }: VariantComponentProps) {
  const isStudio = isStudioRenderContext(ctx)
  const { openCart } = useHeaderCartState({ requireLogin: !isStudio })
  const orderCart = useOrderCartOptional()
  const cartTotal =
    orderCart && orderCart.itemCount > 0
      ? formatPrice(orderCart.orderTotal)
      : (props.cartTotal as string) || '$0.00'
  const cartCount =
    orderCart && orderCart.itemCount > 0
      ? orderCart.itemCount
      : Number(props.cartCount ?? 0)
  const showCount = props.showCount !== false
  const showTotal = props.showTotal !== false
  const icon = (props.icon as string) || 'lucide:shopping-cart'
  const textColor = (props.textColor as string) || '#EFB21B'
  const borderColor = (props.borderColor as string) || textColor
  const backgroundColor = (props.backgroundColor as string) || 'transparent'
  const badgeBg = (props.badgeBg as string) || '#EFB21B'
  const badgeTextColor = (props.badgeTextColor as string) || '#0c0c0c'
  const appearance = props.appearance as string | undefined

  if (appearance === 'bistro-mobile') {
    return (
      <button
        type="button"
        aria-label="Cart"
        className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200"
        style={{ color: textColor }}
        onClick={openCart}
      >
        <DynamicIcon icon={icon} size={18} />
        {showCount && cartCount > 0 && (
          <span
            className="absolute right-1 top-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full text-[8px] font-bold"
            style={{ backgroundColor: badgeBg, color: badgeTextColor }}
          >
            {cartCount}
          </span>
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label="Cart"
      className="relative ml-2 flex flex-shrink-0 items-center gap-1.5 border px-4 py-2 transition-all duration-300"
      style={{ color: textColor, borderColor, backgroundColor }}
      onClick={openCart}
    >
      <DynamicIcon icon={icon} size={15} />
      {showCount && cartCount > 0 && (
        <span
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
          style={{ backgroundColor: badgeBg, color: badgeTextColor }}
        >
          {cartCount}
        </span>
      )}
      {showTotal && (
        <span className="text-[10px] font-bold uppercase tracking-widest lg:text-xs xl:text-sm">{cartTotal}</span>
      )}
    </button>
  )
}
