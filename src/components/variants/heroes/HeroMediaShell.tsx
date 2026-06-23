'use client'

import type { VariantComponentProps } from '@/lib/registry/types'
import { renderHeroSlot } from '@/lib/render-hero-slot'
import { useStore } from '@/providers/ThemeProvider'
import { resolveHeroHeight } from '@/components/variants/heroes/hero-layout'

export type HeroButtonPosition = 'left' | 'center' | 'right'

function HeroMediaShell({
  buttonPosition,
  props: sectionProps,
  childNodes,
  ctx,
}: VariantComponentProps & { buttonPosition: HeroButtonPosition }) {
  const { store } = useStore()
  const fullCtx = { ...ctx, store }

  const media = renderHeroSlot(childNodes, 'heroMedia', fullCtx, null)
  const overlay = renderHeroSlot(childNodes, 'heroOverlay', fullCtx, null)
  const title = renderHeroSlot(childNodes, 'heroTitle', fullCtx, null)
  const subtitle = renderHeroSlot(childNodes, 'heroSubtitle', fullCtx, null)
  const button = renderHeroSlot(childNodes, 'heroButton', fullCtx, null)

  const buttonNode = childNodes?.find((c) => c.type === 'heroButton')
  const buttonProps = buttonNode?.props ?? {}
  const marginBottom = Number(buttonProps.marginBottom ?? 32)
  const marginBottomMobile = Number(buttonProps.marginBottomMobile ?? 24)
  const marginSide = Number(buttonProps.marginSide ?? 32)
  const marginSideMobile = Number(buttonProps.marginSideMobile ?? 20)

  const alignClass =
    buttonPosition === 'center'
      ? 'justify-center'
      : buttonPosition === 'right'
        ? 'justify-end'
        : 'justify-start'

  const heightDesktop = resolveHeroHeight(sectionProps, false)
  const heightMobile = resolveHeroHeight(sectionProps, true)

  return (
    <section
      data-variant={sectionProps._variantId ?? 'HeroV1'}
      className="hero-media-section relative w-full overflow-hidden"
      style={
        {
          '--hero-h-mobile': heightMobile,
          '--hero-h-desktop': heightDesktop,
          '--hero-btn-mb-mobile': `${marginBottomMobile}px`,
          '--hero-btn-mb-desktop': `${marginBottom}px`,
          '--hero-btn-side-mobile': `${marginSideMobile}px`,
          '--hero-btn-side-desktop': `${marginSide}px`,
        } as React.CSSProperties
      }
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `.hero-media-section{min-height:var(--hero-h-mobile);display:flex;flex-direction:column}@media(min-width:768px){.hero-media-section{min-height:var(--hero-h-desktop)}}.hero-media-inner{min-height:inherit;flex:1;display:flex;flex-direction:column;width:100%}.hero-btn-row{padding-bottom:var(--hero-btn-mb-mobile);padding-left:var(--hero-btn-side-mobile);padding-right:var(--hero-btn-side-mobile)}@media(min-width:768px){.hero-btn-row{padding-bottom:var(--hero-btn-mb-desktop);padding-left:var(--hero-btn-side-desktop);padding-right:var(--hero-btn-side-desktop)}}`,
        }}
      />

      <div className="hero-media-inner relative flex w-full flex-col">
        <div className="absolute inset-0">{media}</div>
        <div className="absolute inset-0">{overlay}</div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          {(title || subtitle) ? (
            <div className="flex flex-1 flex-col justify-center px-5 pb-6 pt-10 sm:px-8 md:px-12 md:pb-8 md:pt-14 lg:px-16">
              {title}
              {subtitle}
            </div>
          ) : (
            <div className="flex-1" aria-hidden />
          )}

          {button && (
            <div className={`hero-btn-row flex shrink-0 ${alignClass}`}>{button}</div>
          )}
        </div>
      </div>
    </section>
  )
}

/** HeroV1 — button bottom-left */
export function HeroV1(props: VariantComponentProps) {
  return <HeroMediaShell {...props} buttonPosition="left" />
}

/** HeroV2 — button bottom-center */
export function HeroV2(props: VariantComponentProps) {
  return <HeroMediaShell {...props} buttonPosition="center" />
}

/** HeroV3 — button bottom-right */
export function HeroV3(props: VariantComponentProps) {
  return <HeroMediaShell {...props} buttonPosition="right" />
}
