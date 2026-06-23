'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useStore } from '@/providers/ThemeProvider'
import { RemoteImage } from '@/components/ui/RemoteImage'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import { getImageUrl, formatPrice } from '@/lib/utils'
import { getContrastTextColor } from '@/lib/theme'
import type { VariantComponentProps } from '@/lib/registry/types'
import type { Product } from '@/lib/types/store'
import { getProductSectionGridClass, normalizeProductCardVariant } from '@/lib/product-section-layout'
import { useProductCatalog } from '@/providers/ProductTemplateCatalogProvider'
import { useHeaderCartState } from '@/hooks/useHeaderCartState'
import { useOrderCartOptional } from '@/providers/OrderCartProvider'
import { isStudioRenderContext } from '@/lib/studio-render-context'

export {
  ProductCardV4,
  ProductCardV5,
  ProductCardV6,
  ProductCardV7,
  ProductCardV9,
} from '@/components/variants/product-cards'
export { HeaderV1 } from '@/components/variants/headers/GroceryNavBarHeader'
export { HeaderV2 } from '@/components/variants/headers/GlassStorefrontHeader'
export { HeaderV3 } from '@/components/variants/headers/BistroNavHeader'
export { HeroV1, HeroV2, HeroV3 } from '@/components/variants/heroes/HeroMediaShell'
export { HeroV4 } from '@/components/variants/heroes/BistroCenteredHero'
export {
  HeroMediaV1,
  HeroOverlayV1,
  HeroTitleV1,
  HeroSubtitleV1,
  HeroButtonV1,
} from '@/components/variants/heroes/hero-parts'
export {
  HeroLogoV1,
  HeroEyebrowV1,
  HeroTitleBistroV1,
  HeroButtonBistroV1,
  HeroFeatureV1,
} from '@/components/variants/heroes/bistro-hero-parts'

export function LogoV1({ props }: VariantComponentProps) {
  const { store, theme } = useStore()
  const imageUrl = getImageUrl((props.imageUrl as string) || undefined)
  const initial = store.store.name.charAt(0) || 'S'
  const appearance = props.appearance as string | undefined
  const accent = theme.primaryColor || '#F97316'

  if (appearance === 'glass') {
    return (
      <div className="group relative h-10 w-20 flex-shrink-0 cursor-pointer">
        <div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle, ${accent}20, transparent)`,
            filter: 'blur(8px)',
          }}
        />
        {imageUrl ? (
          <RemoteImage
            src={imageUrl}
            alt={`${store.store.name} logo`}
            width={80}
            height={40}
            className="relative z-10 h-full w-full scale-110 object-contain transition-all duration-300 group-hover:scale-105"
          />
        ) : (
          <span
            className="relative z-10 flex h-full w-full items-center justify-center rounded-xl text-xs font-bold"
            style={{ backgroundColor: `${accent}15`, color: accent }}
          >
            {initial}
          </span>
        )}
      </div>
    )
  }

  if (appearance === 'glass-mobile') {
    return (
      <div className="relative h-8 w-10 flex-shrink-0">
        {imageUrl ? (
          <RemoteImage src={imageUrl} alt={`${store.store.name} logo`} width={40} height={32} className="h-full w-full object-contain" />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center rounded-lg text-xs font-bold"
            style={{ backgroundColor: `${accent}15`, color: accent }}
          >
            {initial}
          </span>
        )}
      </div>
    )
  }

  return (
    <Link href="/" className="group flex max-w-[140px] shrink-0 items-center sm:max-w-[180px]">
      {imageUrl ? (
        <RemoteImage
          src={imageUrl}
          alt={`${store.store.name} logo`}
          width={180}
          height={52}
          className="h-10 w-auto max-w-full rounded-lg object-contain sm:h-[52px] sm:rounded-xl"
        />
      ) : (
        <span
          className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold sm:h-[52px] sm:w-[52px] sm:rounded-xl sm:text-base"
          style={{ backgroundColor: `${accent}20`, color: accent }}
        >
          {initial}
        </span>
      )}
    </Link>
  )
}

export function SearchV1({ nodeId, props }: VariantComponentProps) {
  const placeholder = (props.placeholder as string) || 'Search…'
  const appearance = props.appearance as string | undefined

  if (appearance === 'glass') {
    const backgroundColor = (props.backgroundColor as string) || '#f8faf9'
    const borderColor = (props.borderColor as string) || '#e8f5e8'
    const borderWidth = Number(props.borderWidth) || 1
    const textColor = (props.textColor as string) || '#0f1419'
    const placeholderColor = (props.placeholderColor as string) || '#9ca3af'
    const icon = (props.icon as string) || 'solar:magnifer-linear'
    const iconColor = (props.iconColor as string) || '#1a1f2e'

    return (
      <div className="relative w-full">
        <form className="group relative w-full max-w-3xl transition-all duration-300 ease-out" onSubmit={(e) => e.preventDefault()}>
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ color: iconColor }}
          >
            <DynamicIcon icon={icon} size={20} />
          </div>
          <input
            id={`search-glass-${nodeId}`}
            type="text"
            placeholder={placeholder}
            className="w-full rounded-lg py-2.5 pl-12 pr-10 text-sm font-medium transition-all duration-300 focus:outline-none"
            style={{
              backgroundColor,
              color: textColor,
              border: `${borderWidth}px solid ${borderColor}`,
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `#search-glass-${nodeId}::placeholder{color:${placeholderColor};opacity:1}`,
            }}
          />
        </form>
      </div>
    )
  }

  if (appearance === 'grocery') {
    const backgroundColor = (props.backgroundColor as string) || '#f4f6f0'
    const borderColor = (props.borderColor as string) || '#e2eacc'
    const borderWidth = Number(props.borderWidth) || 1
    const textColor = (props.textColor as string) || '#0f1419'
    const placeholderColor = (props.placeholderColor as string) || '#9ca3af'
    const icon = (props.icon as string) || 'solar:magnifer-linear'
    const iconColor = (props.iconColor as string) || '#1a1f2e'

    return (
      <div className="relative w-full min-w-0">
        <form className="group relative w-full min-w-0 transition-all duration-300 ease-out" onSubmit={(e) => e.preventDefault()}>
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ color: iconColor }}
          >
            <DynamicIcon icon={icon} size={18} />
          </div>
          <input
            id={`search-${nodeId}`}
            type="text"
            placeholder={placeholder}
            className="w-full rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium transition-all duration-300 focus:outline-none"
            style={{
              backgroundColor,
              color: textColor,
              border: `${borderWidth}px solid ${borderColor}`,
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `#search-${nodeId}::placeholder{color:${placeholderColor};opacity:1}`,
            }}
          />
        </form>
      </div>
    )
  }

  if (appearance === 'grocery-mobile') {
    const backgroundColor = (props.backgroundColor as string) || '#ffffff'
    const borderColor = (props.borderColor as string) || '#e5e7eb'
    const textColor = (props.textColor as string) || '#111827'
    const placeholderColor = (props.placeholderColor as string) || '#9ca3af'
    const icon = (props.icon as string) || 'solar:magnifer-linear'
    const iconColor = (props.iconColor as string) || '#9ca3af'

    return (
      <form className="relative w-full" onSubmit={(e) => e.preventDefault()}>
        <div
          className="flex items-center gap-2 rounded-xl px-3 shadow-sm transition-all duration-200"
          style={{ border: `1px solid ${borderColor}`, backgroundColor }}
        >
          <DynamicIcon icon={icon} size={16} style={{ color: iconColor }} />
          <input
            id={`search-m-${nodeId}`}
            type="search"
            placeholder={placeholder}
            className="min-h-[40px] flex-1 bg-transparent py-2 text-[15px] font-medium focus:outline-none"
            style={{ color: textColor }}
            autoComplete="off"
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `#search-m-${nodeId}::placeholder{color:${placeholderColor};opacity:1}`,
            }}
          />
        </div>
      </form>
    )
  }

  return (
    <input
      type="search"
      placeholder={placeholder}
      className="hidden w-48 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm md:block"
    />
  )
}

export function CartV1({ props, ctx }: VariantComponentProps) {
  const { theme } = useStore()
  const isStudio = isStudioRenderContext(ctx)
  const { openCart } = useHeaderCartState({ requireLogin: !isStudio })
  const orderCart = useOrderCartOptional()
  const accent = theme.primaryColor || '#F97316'
  const appearance = props.appearance as string | undefined
  const cartTotal =
    orderCart && orderCart.itemCount > 0
      ? formatPrice(orderCart.orderTotal)
      : (props.cartTotal as string) || formatPrice(0)
  const cartCount =
    orderCart && orderCart.itemCount > 0
      ? orderCart.itemCount
      : Number(props.cartCount ?? 0)
  const label = (props.label as string) || 'Cart'

  if (appearance === 'glass') {
    const bg = (props.backgroundColor as string) || accent
    const textCol = (props.textColor as string) || '#ffffff'
    const borderCol = (props.borderColor as string) || `${accent}30`
    const iconName = (props.icon as string) || 'solar:cart-large-2-linear'
    const showCount = props.showCount !== false

    return (
      <button
        type="button"
        className="relative flex cursor-pointer items-center gap-3 rounded-xl px-5 py-3 shadow-lg transition-all duration-300 hover:scale-[1.02]"
        style={{ backgroundColor: bg, color: textCol, border: `1px solid ${borderCol}` }}
        onClick={openCart}
      >
        <div className="relative">
          <DynamicIcon icon={iconName} size={20} />
          {showCount && cartCount > 0 && (
            <span
              className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold shadow-lg"
              style={{ border: '2px solid white', backgroundColor: bg, color: textCol }}
            >
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-sm font-bold leading-tight">{cartTotal}</span>
      </button>
    )
  }

  if (appearance === 'glass-mobile') {
    const iconName = (props.icon as string) || 'solar:cart-large-2-linear'
    const iconColor = (props.mobileIconColor as string) || '#0F1419'
    const badgeBg = (props.backgroundColor as string) || accent
    const showCount = props.showCount !== false

    return (
      <button type="button" className="relative rounded-lg p-2 transition hover:bg-black/[0.04]" aria-label="Cart" style={{ color: iconColor }} onClick={openCart}>
        <DynamicIcon icon={iconName} size={20} />
        {showCount && cartCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold text-white shadow-lg"
            style={{ border: '1px solid white', backgroundColor: badgeBg }}
          >
            {cartCount}
          </span>
        )}
      </button>
    )
  }

  if (appearance === 'grocery-floating' || appearance === 'grocery-desktop') {
    const bg = (props.backgroundColor as string) || accent
    const textCol = (props.textColor as string) || '#ffffff'
    const iconName = (props.icon as string) || 'solar:bag-4-linear'
    const showCount = props.showCount !== false
    const showTotal = props.showTotal === true

    return (
      <button
        type="button"
        aria-label="Open cart"
        className="relative hidden h-9 shrink-0 items-center gap-1.5 overflow-hidden rounded-lg px-3 text-xs font-semibold shadow-sm transition hover:brightness-105 lg:inline-flex"
        style={{ backgroundColor: bg, color: textCol }}
        onClick={openCart}
      >
        <DynamicIcon icon={iconName} size={16} />
        {showTotal && <span>{cartTotal}</span>}
        {!showTotal && <span>{label}</span>}
        {showCount && cartCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold"
            style={{ backgroundColor: '#fff', color: bg }}
          >
            {cartCount}
          </span>
        )}
      </button>
    )
  }

  if (appearance === 'grocery-mobile') {
    const bg = (props.backgroundColor as string) || accent
    const textCol = (props.textColor as string) || '#ffffff'
    const iconName = (props.icon as string) || 'solar:bag-4-linear'
    const showCount = props.showCount !== false

    return (
      <button
        type="button"
        aria-label="Open cart"
        className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg transition hover:brightness-105 lg:hidden"
        style={{ backgroundColor: bg, color: textCol }}
        onClick={openCart}
      >
        <DynamicIcon icon={iconName} size={16} />
        {showCount && cartCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold"
            style={{ backgroundColor: '#fff', color: bg }}
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
      className="rounded-lg px-3 py-1.5 text-sm font-semibold"
      style={{ backgroundColor: theme.secondaryColor, color: getContrastTextColor(theme.secondaryColor) }}
      onClick={openCart}
    >
      {label} ({cartCount})
    </button>
  )
}


function resolveProduct(
  props: Record<string, unknown>,
  ctx: VariantComponentProps['ctx'],
  catalogGetProduct?: (id: string) => Product | undefined,
): Product | null {
  const id = props.productId as string
  if (!id) return null
  return catalogGetProduct?.(id) ?? ctx.store.products.find((p) => p.id === id) ?? null
}

export function ProductCardV2({ props, ctx }: VariantComponentProps) {
  const catalog = useProductCatalog()
  const product = resolveProduct(props, ctx, catalog.getProduct)
  if (!product) return null
  const imageUrl = getImageUrl(product.image)
  return (
    <article className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="relative h-28 w-28 shrink-0 bg-gray-100">
        {imageUrl && <Image src={imageUrl} alt={product.name} fill className="object-cover" />}
      </div>
      <div className="flex flex-1 flex-col justify-center p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-tenant-primary font-bold">{formatPrice(product.price)}</p>
      </div>
    </article>
  )
}

export function TemplateSectionV1({ props, children }: VariantComponentProps) {
  const title = (props.title as string) || ''
  const variant = normalizeProductCardVariant((props.productCardVariant as string) || 'ProductCardV4')
  const gridClass = getProductSectionGridClass(variant)
  const isCircleFloat = variant === 'ProductCardV4'
  const isListRow = variant === 'ProductCardV5' || variant === 'ProductCardV7'

  return (
    <div className="mb-10 last:mb-0">
      {title && (
        <h3
          className={`mb-5 text-xl font-bold sm:text-2xl ${
            isListRow ? 'text-[#f5f0e8]' : 'text-gray-900'
          }`}
        >
          {title}
        </h3>
      )}
      <div className={`${gridClass} ${isCircleFloat ? 'overflow-visible' : ''}`}>{children}</div>
    </div>
  )
}

export function ProductSectionV1({ props, children, ctx }: VariantComponentProps) {
  const title = (props.title as string) || ''
  const templateId = props.templateId as string | undefined
  const templateName = props.templateName as string | undefined
  const variant = normalizeProductCardVariant((props.productCardVariant as string) || 'ProductCardV4')
  const isListRow = variant === 'ProductCardV5' || variant === 'ProductCardV7'
  const catalog = useProductCatalog()
  const hasTemplateChildren = Boolean(templateId)

  if (!templateId) {
    if (ctx.builderMode) {
      return (
        <section className="border-y border-dashed border-zinc-300 bg-zinc-50 py-16 dark:border-zinc-700 dark:bg-zinc-900/40">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Product Template</p>
            <p className="mt-2 text-sm text-zinc-500">
              Link a WhatsApp product template in the properties panel to show items here.
            </p>
          </div>
        </section>
      )
    }
    return null
  }

  if (catalog.isLoading && !children) {
    return (
      <section className={`py-12 md:py-16 ${isListRow ? 'bg-[#0f1419]' : ''}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-zinc-800" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-40 rounded-xl bg-gray-200 dark:bg-zinc-800" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  const displayTitle = title || templateName || ''

  return (
    <section className={`py-12 md:py-16 ${isListRow ? 'bg-[#0f1419]' : ''}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {displayTitle && (
          <h2 className={`mb-8 text-3xl font-bold ${isListRow ? 'text-[#f5f0e8]' : 'text-gray-900'}`}>
            {displayTitle}
          </h2>
        )}
        {hasTemplateChildren ? (
          <div className="space-y-2">{children}</div>
        ) : (
          <p className={`text-sm ${isListRow ? 'text-zinc-400' : 'text-gray-500'}`}>
            No items in this template yet.
          </p>
        )}
      </div>
    </section>
  )
}

export function CategoriesV1({ props, ctx }: VariantComponentProps) {
  const title = (props.title as string) || ''
  const ids = (props.categoryIds as string[]) || []
  const categories = ids
    .map((id) => ctx.store.categories.find((c) => c.id === id))
    .filter(Boolean)

  if (categories.length === 0) return null

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && <h2 className="mb-8 text-3xl font-bold text-gray-900">{title}</h2>}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((cat) => {
            if (!cat) return null
            const img = getImageUrl(cat.image)
            return (
              <div key={cat.id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-gray-100">
                  {img && <Image src={img} alt={cat.name} fill className="object-cover" />}
                </div>
                <p className="p-3 text-center font-medium">{cat.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function OffersV1({ props }: VariantComponentProps) {
  const title = (props.title as string) || ''
  const slides = (props.slides as Array<{ headline: string; description?: string; image?: string; link?: string }>) || []
  const slide = slides[0]

  if (!slide) return null

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && <h2 className="mb-6 text-3xl font-bold">{title}</h2>}
        <div className="rounded-2xl bg-tenant-primary p-8 text-white">
          <h3 className="text-2xl font-bold">{slide.headline}</h3>
          {slide.description && <p className="mt-2 opacity-90">{slide.description}</p>}
        </div>
      </div>
    </section>
  )
}

export function TestimonialsV1({ props }: VariantComponentProps) {
  const title = (props.title as string) || ''
  const items = (props.items as Array<{ quote: string; author: string; role?: string }>) || []

  if (items.length === 0) return null

  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>}
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <blockquote key={i} className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-gray-700">&ldquo;{item.quote}&rdquo;</p>
              <footer className="mt-3 font-semibold">{item.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

export function OrdersV1({ props }: VariantComponentProps) {
  const title = (props.title as string) || 'Your Orders'
  return (
    <section className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-bold">{title}</h2>
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
          No orders yet. This section will connect to your order system.
        </div>
      </div>
    </section>
  )
}

export function FooterV1(_props: VariantComponentProps) {
  const { store, theme } = useStore()
  const info = store.store
  const textColor = getContrastTextColor(theme.primaryColor)
  return (
    <footer className="mt-auto border-t" style={{ backgroundColor: theme.primaryColor, color: textColor }}>
      <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 lg:px-8">
        <p className="font-bold">{info.name}</p>
        <p className="mt-2 text-sm opacity-80">Powered by Afto Storefront Platform</p>
      </div>
    </footer>
  )
}

export function FooterV2(_props: VariantComponentProps) {
  const { store, theme } = useStore()
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-100 py-6 text-center text-sm text-gray-600">
      © {new Date().getFullYear()} {store.store.name}
      <span className="mx-2">·</span>
      <span style={{ color: theme.primaryColor }}>Afto</span>
    </footer>
  )
}
