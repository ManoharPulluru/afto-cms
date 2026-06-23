'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useStore } from '@/providers/ThemeProvider'
import { getImageUrl } from '@/lib/utils'
import { getContrastTextColor } from '@/lib/theme'
import type { VariantComponentProps } from '@/lib/registry/types'

export function HeroMediaV1({ props }: VariantComponentProps) {
  const mediaType = (props.mediaType as string) || 'image'
  const imageUrl = getImageUrl(props.imageUrl as string | undefined)
  const videoUrl = props.videoUrl as string | undefined
  const alt = (props.alt as string) || 'Hero media'
  const objectFit = (props.objectFit as string) || 'cover'
  const { theme } = useStore()

  if (mediaType === 'video' && videoUrl) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: objectFit as React.CSSProperties['objectFit'] }}
      >
        <source src={videoUrl} />
      </video>
    )
  }

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        priority
        className="absolute inset-0"
        style={{ objectFit: objectFit as React.CSSProperties['objectFit'] }}
        sizes="100vw"
      />
    )
  }

  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.primaryColor}99 50%, #0f1419 100%)`,
      }}
    />
  )
}

export function HeroOverlayV1({ props }: VariantComponentProps) {
  const overlayColor = (props.overlayColor as string) || '#000000'
  const opacity = Math.min(100, Math.max(0, Number(props.overlayOpacity ?? 35))) / 100
  const enableGradient = props.enableGradient !== false
  const gradientColor = (props.gradientColor as string) || '#000000'

  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '')
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
    const n = parseInt(full.slice(0, 6), 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
  }

  const { r, g, b } = hexToRgb(overlayColor)
  const base = `rgba(${r}, ${g}, ${b}, ${opacity})`
  const { r: gr, g: gg, b: gb } = hexToRgb(gradientColor)

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: enableGradient
          ? `linear-gradient(to bottom, ${base} 0%, rgba(${r},${g},${b},${opacity * 0.6}) 45%, rgba(${gr},${gg},${gb},${Math.min(1, opacity + 0.25)}) 100%)`
          : base,
      }}
    />
  )
}

export function HeroTitleV1({ nodeId, props }: VariantComponentProps) {
  if (props.visible === false) return null
  const text = (props.text as string) || ''
  if (!text) return null

  const textColor = (props.textColor as string) || '#ffffff'
  const fontSize = Number(props.fontSize) || 48
  const fontSizeMobile = Number(props.fontSizeMobile) || 32
  const fontWeight = Number(props.fontWeight) || 700
  const maxWidth = Number(props.maxWidth) || 720

  return (
    <>
      <h1
        id={`hero-title-${nodeId}`}
        className="hero-title-text leading-[1.08] tracking-tight"
        style={{ color: textColor, fontWeight, maxWidth }}
      >
        {text}
      </h1>
      <style
        dangerouslySetInnerHTML={{
          __html: `#hero-title-${nodeId}{font-size:${fontSizeMobile}px}@media(min-width:768px){#hero-title-${nodeId}{font-size:${fontSize}px}}`,
        }}
      />
    </>
  )
}

export function HeroSubtitleV1({ nodeId, props }: VariantComponentProps) {
  if (props.visible === false) return null
  const text = (props.text as string) || ''
  if (!text) return null

  const textColor = (props.textColor as string) || 'rgba(255,255,255,0.88)'
  const fontSize = Number(props.fontSize) || 18
  const fontSizeMobile = Number(props.fontSizeMobile) || 16
  const maxWidth = Number(props.maxWidth) || 560

  return (
    <>
      <p
        id={`hero-sub-${nodeId}`}
        className="hero-subtitle-text mt-3 md:mt-4 leading-relaxed"
        style={{ color: textColor, maxWidth }}
      >
        {text}
      </p>
      <style
        dangerouslySetInnerHTML={{
          __html: `#hero-sub-${nodeId}{font-size:${fontSizeMobile}px}@media(min-width:768px){#hero-sub-${nodeId}{font-size:${fontSize}px}}`,
        }}
      />
    </>
  )
}

export function HeroButtonV1({ nodeId, props }: VariantComponentProps) {
  if (props.visible === false) return null
  const label = (props.label as string) || ''
  const href = (props.href as string) || '#'
  if (!label) return null

  const { theme } = useStore()
  const bg = (props.backgroundColor as string) || theme.primaryColor
  const textColor = (props.textColor as string) || getContrastTextColor(bg)
  const borderColor = props.borderColor as string | undefined
  const borderRadius = Number(props.borderRadius) || 8
  const fontSize = Number(props.fontSize) || 16
  const fontSizeMobile = Number(props.fontSizeMobile) || 15
  const paddingX = Number(props.paddingX) || 24
  const paddingY = Number(props.paddingY) || 12

  return (
    <>
      <Link
        id={`hero-btn-${nodeId}`}
        href={href}
        className="hero-btn inline-flex items-center justify-center font-semibold shadow-lg transition hover:brightness-110 active:scale-[0.98]"
        style={{
          backgroundColor: bg,
          color: textColor,
          borderRadius,
          border: borderColor ? `1px solid ${borderColor}` : undefined,
        }}
      >
        {label}
      </Link>
      <style
        dangerouslySetInnerHTML={{
          __html: `#hero-btn-${nodeId}{font-size:${fontSizeMobile}px;padding:${paddingY * 0.85}px ${paddingX * 0.85}px}@media(min-width:768px){#hero-btn-${nodeId}{font-size:${fontSize}px;padding:${paddingY}px ${paddingX}px}}`,
        }}
      />
    </>
  )
}
