'use client'

import { useStore } from '@/providers/ThemeProvider'
import type { VariantComponentProps } from '@/lib/registry/types'
import { resolveSearchProps } from '@/lib/resolve-props'
import { mergeThemedHeaderChildProps, resolveBarBackgroundColor, resolveHeaderVariantTheme } from '@/lib/header-variant-theme'
import { headerPositionClass, headerSpacerHeight } from '@/components/variants/headers/header-layout'
import { renderHeaderSlot } from '@/lib/render-header-slot'
import { GlassMobileSearchBtn } from '@/components/variants/glass-header-parts'
import { HeaderLogoutButton } from '@/components/auth/HeaderLogoutButton'

/** HeaderV2 — Glass Storefront (Namaste blur style) */
export function GlassStorefrontHeader({ ctx, childNodes, props: headerProps }: VariantComponentProps) {
  const { store } = useStore()
  const theme = resolveHeaderVariantTheme('HeaderV2', headerProps, store, childNodes)
  const themedCtx = { ...ctx, store, headerTheme: theme }
  const bar = theme.bar
  const spacerClass = headerSpacerHeight(ctx.builderMode, ctx.previewInFrame, 'glass')

  const headerBg = resolveBarBackgroundColor(bar)
  const borderColor = bar.borderColor || `${bar.accentColor}20`

  const searchNode = childNodes?.find((c) => c.type === 'search')
  const mobileSearchProps = mergeThemedHeaderChildProps(
    theme,
    'search',
    resolveSearchProps(searchNode?.props ?? {}, store),
    { appearance: 'glass-mobile' },
  )

  const brandBlock = (
    <div className="flex min-w-0 items-center gap-2">
      {renderHeaderSlot(childNodes, 'logo', themedCtx, null, { appearance: 'glass' })}
      <div className="flex min-w-0 flex-col gap-0.5">
        {renderHeaderSlot(childNodes, 'storeName', themedCtx, null, { appearance: 'glass' })}
        {renderHeaderSlot(childNodes, 'address', themedCtx, null, { appearance: 'glass' })}
      </div>
    </div>
  )

  const searchBlock = renderHeaderSlot(childNodes, 'search', themedCtx, null, { appearance: 'glass' })
  const dealsBlock = renderHeaderSlot(childNodes, 'deals', themedCtx, null, { appearance: 'glass' })
  const accountBlock = renderHeaderSlot(childNodes, 'account', themedCtx, null)
  const cartBlock = renderHeaderSlot(childNodes, 'cart', themedCtx, null, { appearance: 'glass' })

  const mobileLogo = renderHeaderSlot(childNodes, 'logo', themedCtx, null, { appearance: 'glass-mobile' })
  const mobileStoreName = renderHeaderSlot(childNodes, 'storeName', themedCtx, null, { appearance: 'glass-mobile' })
  const mobileCart = renderHeaderSlot(childNodes, 'cart', themedCtx, null, { appearance: 'glass-mobile' })
  const mobileDeals = renderHeaderSlot(childNodes, 'deals', themedCtx, null, { appearance: 'glass-mobile' })
  const mobileAddress = renderHeaderSlot(childNodes, 'address', themedCtx, null, { appearance: 'glass-mobile' })

  return (
    <>
      <header
        data-variant="HeaderV2"
        data-color-scheme={theme.colorScheme}
        className={`${headerPositionClass(ctx.builderMode, ctx.previewInFrame)} shadow-lg transition-all duration-300 ${bar.blur ? 'backdrop-blur-xl' : ''}`}
        style={{
          backgroundColor: headerBg,
          borderBottom: `1px solid ${borderColor}`,
          backdropFilter: bar.blur ? 'blur(20px)' : undefined,
          boxShadow: bar.boxShadow,
        }}
      >
        <div className="hidden items-center justify-between gap-4 px-6 py-4 xl:px-8 lg:flex">
          {brandBlock}

          <div className="mx-4 flex flex-1 justify-center">
            <div className="relative w-full">{searchBlock}</div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-3">
            {dealsBlock}
            {accountBlock}
            <HeaderLogoutButton iconColor={String(theme.content.account?.iconColor ?? '#1A1F2E')} />
            {cartBlock}
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-3 sm:px-4 lg:hidden">
          <div className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
            <div className="relative h-8 w-10 flex-shrink-0">{mobileLogo}</div>
            <div className="flex min-w-0 flex-col gap-0.5">
              {mobileStoreName}
              {mobileAddress}
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-1.5">
            <GlassMobileSearchBtn nodeId={searchNode?.id ?? 'mobile-search'} props={mobileSearchProps} ctx={themedCtx} />
            {mobileDeals}
            {accountBlock}
            <HeaderLogoutButton iconColor={String(theme.content.account?.iconColor ?? '#1A1F2E')} />
            {mobileCart}
          </div>
        </div>
      </header>
      {spacerClass && <div aria-hidden className={spacerClass} />}
    </>
  )
}

export { GlassStorefrontHeader as HeaderV2 }
