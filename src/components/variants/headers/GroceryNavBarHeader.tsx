'use client'

import { IconMenu } from '@/components/variants/headers/icons'
import { useStore } from '@/providers/ThemeProvider'
import type { VariantComponentProps } from '@/lib/registry/types'
import { getVariantComponent } from '@/lib/registry/render-map'
import {
  getGroceryNavLinksFromChildren,
  resolveNodeProps,
} from '@/lib/resolve-props'
import {
  mergeThemedHeaderChildProps,
  resolveBarBackgroundColor,
  resolveHeaderVariantTheme,
} from '@/lib/header-variant-theme'
import { headerPositionClass, headerSpacerHeight } from '@/components/variants/headers/header-layout'
import { renderHeaderSlot } from '@/lib/render-header-slot'
import { HeaderLogoutButton } from '@/components/auth/HeaderLogoutButton'

/** HeaderV1 — Grocery Nav Bar (fully customizable atomic parts) */
export function GroceryNavBarHeader({ ctx, childNodes, props: headerProps }: VariantComponentProps) {
  const { store } = useStore()
  const theme = resolveHeaderVariantTheme('HeaderV1', headerProps, store, childNodes)
  const themedCtx = { ...ctx, store, headerTheme: theme }
  const bar = theme.bar
  const navLinks = getGroceryNavLinksFromChildren(childNodes, store)
  const spacerClass = headerSpacerHeight(ctx.builderMode, ctx.previewInFrame, 'grocery')

  const headerBg = resolveBarBackgroundColor(bar)

  const logoBlock = renderHeaderSlot(childNodes, 'logo', themedCtx, null, { appearance: 'grocery' })
  const searchBlock = renderHeaderSlot(childNodes, 'search', themedCtx, null, { appearance: 'grocery' })
  const mobileSearchBlock = renderHeaderSlot(childNodes, 'search', themedCtx, null, { appearance: 'grocery-mobile' })
  const accountBlock = renderHeaderSlot(childNodes, 'account', themedCtx, null)
  const themeToggleBlock = renderHeaderSlot(childNodes, 'themeToggle', themedCtx, null)
  const desktopCartBlock = renderHeaderSlot(childNodes, 'cart', themedCtx, null, { appearance: 'grocery-desktop' })
  const mobileCartBlock = renderHeaderSlot(childNodes, 'cart', themedCtx, null, { appearance: 'grocery-mobile' })

  const mutedIconColor =
    theme.colorScheme === 'dark' ? 'rgba(245,240,232,0.65)' : '#6b7280'

  return (
    <>
      <header
        data-variant="HeaderV1"
        data-color-scheme={theme.colorScheme}
        className={`${headerPositionClass(ctx.builderMode, ctx.previewInFrame)} w-full max-w-full overflow-x-hidden`}
        style={{ backgroundColor: headerBg }}
      >
        <div
          className="shadow-[0_1px_0_rgba(0,0,0,0.04)] lg:shadow-[0_1px_10px_rgba(0,0,0,0.04)]"
          style={{
            backgroundColor: headerBg,
            borderBottom: `1px solid ${bar.borderColor}`,
          }}
        >
          {/* Desktop */}
          <div className="mx-auto hidden w-full min-w-0 max-w-[1440px] items-center justify-between gap-6 px-6 py-3 lg:flex xl:gap-8 xl:px-8">
            <div className="flex shrink-0 items-center">{logoBlock}</div>

            {searchBlock && (
              <div className="flex min-w-0 flex-1 justify-center px-4">
                <div className="w-full max-w-xl">{searchBlock}</div>
              </div>
            )}

            <div className="flex shrink-0 items-center gap-2 xl:gap-3">
              <nav className="flex min-w-0 items-center">
                {navLinks.map(({ node }) => {
                  const Component = getVariantComponent(node.variant)
                  if (!Component) return null
                  const resolved = mergeThemedHeaderChildProps(
                    theme,
                    node.type,
                    resolveNodeProps(node.type, node.props ?? {}, store, node),
                  )
                  return (
                    <Component key={node.id} nodeId={node.id} props={resolved} ctx={themedCtx} />
                  )
                })}
              </nav>

              <span
                className="mx-1 h-5 w-px shrink-0"
                style={{ backgroundColor: bar.borderColor }}
                aria-hidden
              />

              {accountBlock}
              <HeaderLogoutButton iconColor={mutedIconColor} />
              {themeToggleBlock}
              {desktopCartBlock}
            </div>
          </div>

          {/* Mobile / tablet */}
          <div className="mx-auto flex min-h-[56px] w-full min-w-0 max-w-full items-center justify-between gap-3 px-4 py-2 sm:h-[60px] sm:px-6 lg:hidden">
            <div className="min-w-0 shrink">{logoBlock}</div>
            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              {accountBlock}
              <HeaderLogoutButton iconColor={mutedIconColor} />
              {mobileCartBlock}
              <button
                type="button"
                aria-label="Toggle menu"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-black/[0.04]"
                style={{ color: mutedIconColor }}
              >
                <IconMenu size={20} />
              </button>
            </div>
          </div>
        </div>

        {mobileSearchBlock && (
          <div
            className="lg:hidden"
            style={{
              backgroundColor: bar.mobileSearchBg,
              borderBottom: `1px solid ${bar.borderColor}`,
            }}
          >
            <div className="mx-auto w-full min-w-0 max-w-full px-4 pb-2.5 pt-2 sm:px-6">
              {mobileSearchBlock}
            </div>
          </div>
        )}
      </header>
      {spacerClass && <div aria-hidden className={spacerClass} />}
    </>
  )
}

export { GroceryNavBarHeader as HeaderV1 }
