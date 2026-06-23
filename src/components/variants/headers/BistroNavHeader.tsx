'use client'

import Link from 'next/link'
import { useStore } from '@/providers/ThemeProvider'
import type { VariantComponentProps } from '@/lib/registry/types'
import { getVariantComponent } from '@/lib/registry/render-map'
import { getBistroNavLinksFromChildren, resolveNodeProps } from '@/lib/resolve-props'
import { bistroNavSlot } from '@/lib/bistro-header-config'
import {
  mergeThemedHeaderChildProps,
  resolveBarBackgroundColor,
  resolveHeaderVariantTheme,
} from '@/lib/header-variant-theme'
import { headerPositionClass, headerSpacerHeight } from '@/components/variants/headers/header-layout'
import { renderHeaderSlot } from '@/lib/render-header-slot'
import { HeaderLogoutButton } from '@/components/auth/HeaderLogoutButton'

/** HeaderV3 — Bistro Center Logo Nav */
export function BistroNavHeader({ ctx, childNodes, props: headerProps }: VariantComponentProps) {
  const { store } = useStore()
  const theme = resolveHeaderVariantTheme('HeaderV3', headerProps, store, childNodes)
  const themedCtx = { ...ctx, store, headerTheme: theme }
  const bar = theme.bar
  const navLinks = getBistroNavLinksFromChildren(childNodes, store)
  const spacerClass = headerSpacerHeight(ctx.builderMode, ctx.previewInFrame, 'bistro')

  const headerBg = resolveBarBackgroundColor(bar)
  const leftLinks = navLinks.filter(({ props }) => bistroNavSlot(String(props.navKey)) === 'left')
  const rightLinks = navLinks.filter(({ props }) => bistroNavSlot(String(props.navKey)) === 'right')

  const logoDesktop = renderHeaderSlot(childNodes, 'logo', themedCtx, null, {
    appearance: 'bistro',
    accentColor: bar.accentColor,
  })
  const logoMobile = renderHeaderSlot(childNodes, 'logo', themedCtx, null, {
    appearance: 'bistro-mobile',
    accentColor: bar.accentColor,
  })
  const storeNameMobile = renderHeaderSlot(childNodes, 'storeName', themedCtx, null, { appearance: 'bistro-mobile' })
  const menuDesktop = renderHeaderSlot(childNodes, 'menuButton', themedCtx, null, { appearance: 'bistro' })
  const menuMobile = renderHeaderSlot(childNodes, 'menuButton', themedCtx, null, { appearance: 'bistro-mobile' })
  const searchDesktop = renderHeaderSlot(childNodes, 'search', themedCtx, null, { appearance: 'bistro' })
  const searchMobile = renderHeaderSlot(childNodes, 'search', themedCtx, null, { appearance: 'bistro-mobile' })
  const accountBlock = renderHeaderSlot(childNodes, 'account', themedCtx, null)
  const cartDesktop = renderHeaderSlot(childNodes, 'cart', themedCtx, null, { appearance: 'bistro' })
  const cartMobile = renderHeaderSlot(childNodes, 'cart', themedCtx, null, { appearance: 'bistro-mobile' })

  function renderNavLink(node: (typeof navLinks)[0]['node']) {
    const Component = getVariantComponent(node.variant)
    if (!Component) return null
    const resolved = mergeThemedHeaderChildProps(
      theme,
      node.type,
      resolveNodeProps(node.type, node.props ?? {}, store, node),
      { accentColor: bar.accentColor },
    )
    return <Component key={node.id} nodeId={node.id} props={resolved} ctx={themedCtx} />
  }

  return (
    <>
      <header
        data-variant="HeaderV3"
        data-color-scheme={theme.colorScheme}
        className={`${headerPositionClass(ctx.builderMode, ctx.previewInFrame)} w-full transition-all duration-500 max-lg:!border-b`}
        style={{
          backgroundColor: headerBg,
          borderBottom: `1px solid ${bar.borderColor}`,
          minHeight: bar.minHeightDesktop,
        }}
      >
        {/* Desktop */}
        <div
          className="relative hidden w-full items-center px-6 lg:flex"
          style={{ height: bar.minHeightDesktop }}
        >
          <div className="grid h-full w-full" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
            <nav className="flex h-full items-center justify-end">
              {leftLinks.map(({ node }) => renderNavLink(node))}
            </nav>

            <Link href="/" className="group flex shrink-0 cursor-pointer flex-col items-center justify-center px-8">
              {logoDesktop}
            </Link>

            <nav
              className="flex h-full items-center justify-start"
              style={{ paddingRight: bar.rightNavPadding }}
            >
              {rightLinks.map(({ node }) => renderNavLink(node))}
            </nav>
          </div>

          <div className="absolute right-6 flex h-full items-center gap-1">
            {menuDesktop}
            <span
              className="mx-1 h-4 w-px flex-shrink-0"
              style={{ backgroundColor: bar.dividerColor }}
              aria-hidden
            />
            {searchDesktop}
            {accountBlock}
            <HeaderLogoutButton iconColor={String(theme.content.account?.iconColor ?? 'rgba(245,240,232,0.65)')} />
            {cartDesktop}
          </div>
        </div>

        {/* Mobile */}
        <div
          className="flex items-center px-4 lg:hidden"
          style={{
            height: bar.minHeightMobile,
            backgroundColor: bar.mobileBackgroundColor,
            borderBottom: `1px solid ${bar.mobileBorderColor}`,
            gap: 0,
          }}
        >
          <Link href="/" className="flex flex-shrink-0 cursor-pointer items-center gap-2.5">
            {logoMobile}
            {storeNameMobile}
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-0.5">
            {menuMobile}
            {searchMobile}
            {accountBlock}
            <HeaderLogoutButton iconColor={String(theme.content.account?.iconColor ?? 'rgba(245,240,232,0.65)')} />
            {cartMobile}
          </div>
        </div>
      </header>
      {spacerClass && <div aria-hidden className={spacerClass} />}
    </>
  )
}

export { BistroNavHeader as HeaderV3 }
