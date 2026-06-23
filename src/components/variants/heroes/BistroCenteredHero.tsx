'use client'

import type { VariantComponentProps } from '@/lib/registry/types'
import { renderHeroSlot, renderHeroFeatureNodes } from '@/lib/render-hero-slot'
import { useStore } from '@/providers/ThemeProvider'
import { resolveHeroHeight } from '@/components/variants/heroes/hero-layout'

/** HeroV4 — Bistro centered overlay (logo, eyebrow, title, CTA, features) */
export function HeroV4({ props: sectionProps, childNodes, ctx }: VariantComponentProps) {
  const { store } = useStore()
  const fullCtx = { ...ctx, store }

  const media = renderHeroSlot(childNodes, 'heroMedia', fullCtx, null)
  const overlay = renderHeroSlot(childNodes, 'heroOverlay', fullCtx, null)
  const logo = renderHeroSlot(childNodes, 'heroLogo', fullCtx, null)
  const eyebrow = renderHeroSlot(childNodes, 'heroEyebrow', fullCtx, null)
  const title = renderHeroSlot(childNodes, 'heroTitle', fullCtx, null)
  const button = renderHeroSlot(childNodes, 'heroButton', fullCtx, null)
  const features = renderHeroFeatureNodes(childNodes, fullCtx)

  const dividerColor =
    (sectionProps.featureDividerColor as string) || 'rgba(245, 240, 232, 0.18)'
  const heightDesktop = resolveHeroHeight(sectionProps, false)
  const heightMobile = resolveHeroHeight(sectionProps, true)

  return (
    <section
      data-variant="HeroV4"
      className="hero-bistro-section relative w-full overflow-hidden"
      style={
        {
          '--hero-h-mobile': heightMobile,
          '--hero-h-desktop': heightDesktop,
        } as React.CSSProperties
      }
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `.hero-bistro-section{min-height:var(--hero-h-mobile);display:flex;flex-direction:column}@media(min-width:768px){.hero-bistro-section{min-height:var(--hero-h-desktop)}}.hero-bistro-inner{min-height:inherit;flex:1;display:flex;flex-direction:column;width:100%}`,
        }}
      />

      <div className="hero-bistro-inner relative flex w-full flex-col">
        <div className="absolute inset-0">{media}</div>
        <div className="absolute inset-0">{overlay}</div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          {logo}
          {eyebrow}
          {title}
          {button}

          {features.length > 0 && (
            <div className="mt-7 flex items-center gap-6 sm:gap-10">
              {features.map((feature, index) => (
                <div key={feature.key} className="flex items-center gap-6 sm:gap-10">
                  {index > 0 && (
                    <div className="h-10 w-px shrink-0" style={{ backgroundColor: dividerColor }} />
                  )}
                  {feature.node}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
