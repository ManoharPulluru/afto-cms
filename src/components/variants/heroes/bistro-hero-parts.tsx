'use client'

import Link from 'next/link'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import { useStore } from '@/providers/ThemeProvider'
import { getImageUrl } from '@/lib/utils'
import type { VariantComponentProps } from '@/lib/registry/types'

export function HeroLogoV1({ props }: VariantComponentProps) {
  if (props.visible === false) return null
  const imageUrl = getImageUrl(props.imageUrl as string | undefined)
  if (!imageUrl) return null

  const widthMin = Number(props.widthMin ?? 100)
  const widthMax = Number(props.widthMax ?? 180)
  const widthVw = Number(props.widthVw ?? 18)
  const marginBottom = Number(props.marginBottom ?? 1.5)
  const dropShadow =
    (props.dropShadow as string) ||
    'drop-shadow(0 14px 14px rgba(0,0,0,0.95)) drop-shadow(0 0 20px rgba(239,178,27,0.5))'
  const brightness = Number(props.brightness ?? 1.1)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={(props.alt as string) || 'Logo'}
      src={imageUrl}
      style={{
        width: `clamp(${widthMin}px, ${widthVw}vw, ${widthMax}px)`,
        marginBottom: `${marginBottom}rem`,
        filter: `${dropShadow} brightness(${brightness})`,
      }}
    />
  )
}

export function HeroEyebrowV1({ nodeId, props }: VariantComponentProps) {
  if (props.visible === false) return null
  const text = (props.text as string) || ''
  if (!text) return null

  const textColor = (props.textColor as string) || '#EFB21B'
  const lineColor = (props.lineColor as string) || textColor
  const letterSpacing = Number(props.letterSpacing ?? 0.4)
  const fontSize = Number(props.fontSize ?? 9)
  const fontSizeDesktop = Number(props.fontSizeDesktop ?? 11)
  const lineWidthMobile = Number(props.lineWidthMobile ?? 40)
  const lineWidthDesktop = Number(props.lineWidthDesktop ?? 64)
  const marginBottom = Number(props.marginBottom ?? 1.25)
  const textShadow = (props.textShadow as string) || '0 2px 16px rgba(0,0,0,0.9)'

  return (
    <>
      <div
        id={`hero-eyebrow-${nodeId}`}
        className="mb-5 flex items-center gap-4 sm:mb-8"
        style={{ marginBottom: `${marginBottom}rem` }}
      >
        <span
          className="hero-eyebrow-line block h-px"
          style={{ backgroundColor: lineColor, width: lineWidthMobile }}
        />
        <span
          className="hero-eyebrow-text font-bold uppercase"
          style={{ color: textColor, letterSpacing: `${letterSpacing}em`, textShadow }}
        >
          {text}
        </span>
        <span
          className="hero-eyebrow-line block h-px"
          style={{ backgroundColor: lineColor, width: lineWidthMobile }}
        />
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `#hero-eyebrow-${nodeId} .hero-eyebrow-text{font-size:${fontSize}px}@media(min-width:640px){#hero-eyebrow-${nodeId} .hero-eyebrow-text{font-size:${fontSizeDesktop}px}#hero-eyebrow-${nodeId} .hero-eyebrow-line{width:${lineWidthDesktop}px!important}}`,
        }}
      />
    </>
  )
}

export function HeroTitleBistroV1({ nodeId, props }: VariantComponentProps) {
  if (props.visible === false) return null
  const text = (props.text as string) || ''
  if (!text) return null

  const textColor = (props.textColor as string) || '#f5f0e8'
  const fontSize = Number(props.fontSize ?? 29.6)
  const fontSizeDesktop = Number(props.fontSizeDesktop ?? 128)
  const fontWeight = Number(props.fontWeight ?? 700)
  const fontFamily = (props.fontFamily as string) || 'Georgia, "Times New Roman", serif'
  const letterSpacing = Number(props.letterSpacing ?? -0.01)
  const lineHeight = Number(props.lineHeight ?? 1)
  const textShadow =
    (props.textShadow as string) || '0 4px 32px rgb(0,0,0), 0 0 0 rgba(0,0,0,0.9)'
  const maxWidth = Number(props.maxWidth ?? 900)

  return (
    <>
      <h1
        id={`hero-bistro-title-${nodeId}`}
        className="mb-5 text-center font-bold"
        style={{
          color: textColor,
          fontFamily,
          fontWeight,
          letterSpacing: `${letterSpacing}em`,
          lineHeight,
          maxWidth,
          textShadow,
        }}
      >
        {text}
      </h1>
      <style
        dangerouslySetInnerHTML={{
          __html: `#hero-bistro-title-${nodeId}{font-size:clamp(${fontSize}px,9vw,${fontSizeDesktop}px)}`,
        }}
      />
    </>
  )
}

export function HeroButtonBistroV1({ nodeId, props }: VariantComponentProps) {
  if (props.visible === false) return null
  const label = (props.label as string) || ''
  const href = (props.href as string) || '#'
  if (!label) return null

  const { theme } = useStore()
  const accent = theme.primaryColor || '#EFB21B'
  const bg = (props.backgroundColor as string) || accent
  const textColor = (props.textColor as string) || '#0c0c0c'
  const borderColor = (props.borderColor as string) || bg
  const borderRadius = Number(props.borderRadius ?? 0)
  const paddingX = Number(props.paddingX ?? 44)
  const paddingY = Number(props.paddingY ?? 14)
  const letterSpacing = Number(props.letterSpacing ?? 0.32)
  const uppercase = props.uppercase !== false

  return (
    <Link
      id={`hero-bistro-btn-${nodeId}`}
      href={href}
      className={`mt-8 inline-block font-bold transition-all duration-300 hover:brightness-110 active:scale-[0.98] ${uppercase ? 'uppercase' : ''}`}
      style={{
        backgroundColor: bg,
        border: `1px solid ${borderColor}`,
        color: textColor,
        borderRadius: borderRadius || undefined,
        letterSpacing: `${letterSpacing}em`,
        padding: `${paddingY}px ${paddingX}px`,
        fontWeight: 'bold',
      }}
    >
      {label}
    </Link>
  )
}

export function HeroFeatureV1({ nodeId, props }: VariantComponentProps) {
  if (props.visible === false) return null
  const label = (props.label as string) || ''
  if (!label) return null

  const icon = (props.icon as string) || 'solar:star-bold'
  const iconColor = (props.iconColor as string) || '#EFB21B'
  const ringColor = (props.ringColor as string) || 'rgba(239,178,27,0.45)'
  const ringBackground = (props.ringBackground as string) || 'rgba(239,178,27,0.12)'
  const textColor = (props.textColor as string) || 'rgba(245,240,232,0.82)'
  const letterSpacing = Number(props.letterSpacing ?? 0.18)
  const fontSize = Number(props.fontSize ?? 10)
  const fontSizeDesktop = Number(props.fontSizeDesktop ?? 11)
  const textShadow = (props.textShadow as string) || '0 1px 8px rgba(0,0,0,0.9)'
  const href = props.href as string | undefined

  const content = (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: ringBackground, border: `1px solid ${ringColor}` }}
      >
        <DynamicIcon icon={icon} size={22} style={{ color: iconColor }} />
      </div>
      <span
        id={`hero-feature-${nodeId}`}
        className="font-semibold uppercase"
        style={{ color: textColor, letterSpacing: `${letterSpacing}em`, textShadow }}
      >
        {label}
      </span>
      <style
        dangerouslySetInnerHTML={{
          __html: `#hero-feature-${nodeId}{font-size:${fontSize}px}@media(min-width:640px){#hero-feature-${nodeId}{font-size:${fontSizeDesktop}px}}`,
        }}
      />
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-90">
        {content}
      </Link>
    )
  }
  return content
}

// Re-export standard parts used by bistro shell
export { HeroMediaV1, HeroOverlayV1 } from '@/components/variants/heroes/hero-parts'
