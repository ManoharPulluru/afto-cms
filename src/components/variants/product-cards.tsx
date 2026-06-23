'use client'

import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/types/store'
import type { VariantComponentProps } from '@/lib/registry/types'
import { RemoteImage } from '@/components/ui/RemoteImage'
import { formatPrice, getImageUrl } from '@/lib/utils'
import { useProductCatalog } from '@/providers/ProductTemplateCatalogProvider'
import { useOrderCartOptional } from '@/providers/OrderCartProvider'

type ProductCardData = {
  product: {
    id: string
    name: string
    price: number
    image?: string
    description?: string
    compareAtPrice?: number
    categoryName?: string
  }
  imageUrl: string | null
  accent: string
  compareAt: number | null
  categoryLabel: string
  onSale: boolean
  discountPct: number | null
  href: string
}

function resolveProductCardData(
  props: Record<string, unknown>,
  ctx: VariantComponentProps['ctx'],
  catalogGetProduct?: (id: string) => Product | undefined,
): ProductCardData | null {
  const id = props.productId as string
  if (!id) return null
  const product =
    catalogGetProduct?.(id) ?? ctx.store.products.find((p) => p.id === id)
  if (!product) return null

  const accent = ctx.store.store.primaryColor ?? '#F97316'
  const compareAtRaw = props.compareAtPrice ?? product.compareAtPrice
  const compareAt =
    compareAtRaw != null && Number(compareAtRaw) > product.price ? Number(compareAtRaw) : null
  const categoryLabel = String(props.categoryLabel ?? product.categoryName ?? 'Grocery')
  const onSale = compareAt != null
  const discountPct =
    onSale && compareAt ? Math.round(((compareAt - product.price) / compareAt) * 100) : null

  return {
    product,
    imageUrl: getImageUrl(product.image),
    accent,
    compareAt,
    categoryLabel,
    onSale,
    discountPct,
    href: `/products/${product.id}`,
  }
}

function preventNav(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
}

function AddToCartButton({
  productId,
  className,
  style,
  children,
  disabled,
}: {
  productId: string
  className?: string
  style?: CSSProperties
  children: ReactNode
  disabled?: boolean
}) {
  const orderCart = useOrderCartOptional()

  return (
    <button
      type="button"
      className={className}
      style={style}
      disabled={disabled || orderCart?.isMutating}
      aria-label="Add to cart"
      onClick={(e) => {
        preventNav(e)
        void orderCart?.addToCart(productId, 1)
      }}
    >
      {children}
    </button>
  )
}

/** Hook-aware resolver used by all product card variants */
function useProductCardData(props: Record<string, unknown>, ctx: VariantComponentProps['ctx']) {
  const catalog = useProductCatalog()
  return resolveProductCardData(props, ctx, catalog.getProduct)
}

/** V4 — Floating circle image card (5 desktop / 3 tablet / 2 mobile) */
export function ProductCardV4({ props, ctx }: VariantComponentProps) {
  const data = useProductCardData(props, ctx)
  if (!data) return null
  const { product, imageUrl, accent, compareAt, onSale } = data
  const borderColor = '#E8F5E8'

  return (
    <div className="group relative w-full transform cursor-pointer transition-all duration-300 hover:scale-[1.02]">
      <Link href={data.href} className="block">
        <div
          className="relative mt-10 flex h-[220px] w-full flex-col justify-end rounded-2xl border p-4 transition-all duration-300 hover:shadow-lg sm:mt-12 sm:h-[250px] sm:rounded-3xl sm:p-5 md:mt-16 md:h-[280px] md:p-6 lg:mt-20 lg:h-[310px]"
          style={{ backgroundColor: '#ffffff', borderColor }}
        >
          <div
            className="absolute left-1/2 top-[-32px] h-16 w-16 -translate-x-1/2 overflow-hidden rounded-full border-2 bg-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl sm:top-[-36px] sm:h-24 sm:w-24 sm:border-4 md:top-[-44px] md:h-28 md:w-28 lg:top-[-48px] lg:h-[8.5rem] lg:w-[8.5rem]"
            style={{ borderColor }}
          >
            {imageUrl && (
              <RemoteImage
                src={imageUrl}
                alt={product.name}
                width={200}
                height={200}
                className="h-full w-full rounded-full object-cover"
              />
            )}
          </div>

          <div className="flex flex-1 flex-col items-center justify-between pt-3 text-center sm:pt-4 md:pt-6">
            <h2 className="mb-2 mt-6 line-clamp-2 w-full text-xs font-medium leading-tight text-[#0F1419] sm:mt-14 sm:text-base md:text-lg lg:text-xl">
              {product.name}
            </h2>
            <div className="mb-3 text-sm font-semibold text-[#0F1419] sm:text-lg md:text-xl">
              {onSale && compareAt && (
                <span className="mr-3 text-sm font-light line-through opacity-60">
                  {formatPrice(compareAt)}
                </span>
              )}
              <span>{formatPrice(product.price)}</span>
            </div>
            <AddToCartButton
              productId={product.id}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:gap-2 sm:rounded-2xl sm:px-5 sm:py-2 sm:text-base"
              style={{ backgroundColor: accent }}
            >
              <span className="whitespace-nowrap font-bold text-white sm:text-base">Add To Cart</span>
            </AddToCartButton>
          </div>
        </div>
      </Link>
    </div>
  )
}

/** V5 — Bistro horizontal row (2 desktop / 2 tablet / 1 mobile) */
export function ProductCardV5({ props, ctx }: VariantComponentProps) {
  const data = useProductCardData(props, ctx)
  if (!data) return null
  const { product, imageUrl, accent, categoryLabel } = data
  const borderColor = `${accent}1a`

  return (
    <div
      className="group flex gap-3 py-4 sm:gap-4 sm:py-5"
      style={{ borderBottom: `1px solid ${borderColor}` }}
    >
      <Link
        href={data.href}
        className="relative h-[84px] w-[84px] min-w-[84px] flex-shrink-0 overflow-hidden"
      >
        {imageUrl && (
          <RemoteImage
            src={imageUrl}
            alt={product.name}
            fill
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-1">
            <span
              className="flex-shrink-0 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]"
              style={{ backgroundColor: accent, color: '#0c0c0c' }}
            >
              {categoryLabel}
            </span>
          </div>
          <div className="flex flex-shrink-0 items-baseline gap-1.5 text-right">
            <span className="text-sm font-bold" style={{ color: accent }}>
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
        <Link href={data.href}>
          <h3
            className="line-clamp-1 text-xs font-bold uppercase tracking-[0.05em] transition-opacity duration-200 group-hover:opacity-70 sm:text-sm"
            style={{ color: '#f5f0e8' }}
          >
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p
            className="line-clamp-2 text-[10px] leading-relaxed sm:text-xs"
            style={{ color: 'rgba(245, 240, 232, 0.5)' }}
          >
            {product.description}
          </p>
        )}
        <div className="mt-auto pt-1.5">
          <AddToCartButton
            productId={product.id}
            className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 sm:text-[10px]"
            style={{ border: `1px solid ${accent}`, color: accent, backgroundColor: 'transparent' }}
          >
            + Add to Cart
          </AddToCartButton>
        </div>
      </div>
    </div>
  )
}

/** V6 — Grocery shelf card with square image (5 / 3 / 2) */
export function ProductCardV6({ props, ctx }: VariantComponentProps) {
  const data = useProductCardData(props, ctx)
  if (!data) return null
  const { product, imageUrl, accent, compareAt, onSale, discountPct, categoryLabel } = data
  const green = '#6bb252'

  return (
    <div className="group relative h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-[#6bb252]/40 hover:shadow-[0_12px_36px_rgba(107,178,82,0.14)] dark:border-white/10 dark:bg-[#1a1f2e] dark:shadow-[0_2px_16px_rgba(0,0,0,0.4)] dark:hover:border-[#6bb252]/50 dark:hover:shadow-[0_12px_36px_rgba(107,178,82,0.18)]">
        <Link
          href={data.href}
          className="relative block aspect-square overflow-hidden bg-gradient-to-b from-[#f4faf1] to-white dark:from-white/5 dark:to-[#1a1f2e]"
        >
          {onSale && discountPct != null && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-[#e53935] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              {discountPct}% off
            </span>
          )}
          {imageUrl && (
            <RemoteImage
              src={imageUrl}
              alt={product.name}
              fill
              className="absolute inset-0 h-full w-full object-contain p-4 transition-all duration-500 group-hover:scale-105"
            />
          )}
        </Link>
        <div className="flex flex-1 flex-col p-4 pt-3">
          <p className="mb-1 line-clamp-1 text-[10px] font-bold uppercase tracking-widest text-[#6bb252]">
            {categoryLabel}
          </p>
          <Link href={data.href}>
            <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-[#0f2137] transition-colors group-hover:text-[#6bb252] dark:text-gray-100">
              {product.name}
            </h3>
          </Link>
          <div className="mt-2 flex items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <span className="text-base font-extrabold text-[#0f2137] dark:text-gray-100 sm:text-lg">
                {formatPrice(product.price)}
              </span>
              {onSale && compareAt && (
                <span className="text-xs text-[#9ca3af] line-through dark:text-gray-500 sm:text-sm">
                  {formatPrice(compareAt)}
                </span>
              )}
            </div>
            <AddToCartButton
              productId={product.id}
              className="inline-flex h-9 min-w-[56px] flex-shrink-0 items-center justify-center rounded-lg border-[1.5px] bg-white px-2.5 text-xs font-bold uppercase tracking-wide transition hover:bg-[#6bb252]/5 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-transparent sm:h-10 sm:min-w-[100px] sm:px-3 sm:text-sm"
              style={{ borderColor: green, color: green }}
            >
              ADD
            </AddToCartButton>
          </div>
        </div>
      </div>
    </div>
  )
}

/** V7 — Produce list row with sale badge (2 / 2 / 1) */
export function ProductCardV7({ props, ctx }: VariantComponentProps) {
  const data = useProductCardData(props, ctx)
  if (!data) return null
  const { product, imageUrl, accent, compareAt, onSale, categoryLabel } = data
  const borderColor = `${accent}1a`

  return (
    <div
      className="group flex gap-3 py-4 sm:gap-4 sm:py-5"
      style={{ borderBottom: `1px solid ${borderColor}` }}
    >
      <Link
        href={data.href}
        className="relative h-[84px] w-[84px] min-w-[84px] flex-shrink-0 overflow-hidden"
      >
        {imageUrl && (
          <RemoteImage
            src={imageUrl}
            alt={product.name}
            fill
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-1">
            <span
              className="flex-shrink-0 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]"
              style={{ backgroundColor: accent, color: '#232a60' }}
            >
              {categoryLabel}
            </span>
            {onSale && (
              <span
                className="flex-shrink-0 border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]"
                style={{
                  backgroundColor: `${accent}1a`,
                  color: accent,
                  borderColor: `${accent}4d`,
                }}
              >
                Sale
              </span>
            )}
          </div>
          <div className="flex flex-shrink-0 items-baseline gap-1.5 text-right">
            <span className="text-sm font-bold" style={{ color: accent }}>
              {formatPrice(product.price)}
            </span>
            {onSale && compareAt && (
              <span className="text-[10px] line-through" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                {formatPrice(compareAt)}
              </span>
            )}
          </div>
        </div>
        <Link href={data.href}>
          <h3 className="line-clamp-1 text-xs font-bold uppercase tracking-[0.05em] text-white transition-opacity duration-200 group-hover:opacity-70 sm:text-sm">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="line-clamp-2 text-[10px] leading-relaxed sm:text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {product.description}
          </p>
        )}
        <div className="mt-auto pt-1.5">
          <AddToCartButton
            productId={product.id}
            className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 sm:text-[10px]"
            style={{ border: `1px solid ${accent}`, color: accent, backgroundColor: 'transparent' }}
          >
            + Add to Cart
          </AddToCartButton>
        </div>
      </div>
    </div>
  )
}

/** V9 — Editorial spotlight card (3 / 2 / 1) */
export function ProductCardV9({ props, ctx }: VariantComponentProps) {
  const data = useProductCardData(props, ctx)
  if (!data) return null
  const { product, imageUrl, accent, compareAt, onSale, discountPct } = data

  return (
    <article className="group relative h-full overflow-hidden rounded-2xl bg-[#0f1419] shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)]">
      <Link href={data.href} className="relative block aspect-[4/5] overflow-hidden">
        {imageUrl && (
          <RemoteImage
            src={imageUrl}
            alt={product.name}
            fill
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
        {onSale && discountPct != null && (
          <span
            className="absolute left-4 top-4 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
            style={{ backgroundColor: accent }}
          >
            {discountPct}% off
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-white sm:text-lg">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/55 sm:text-sm">
              {product.description}
            </p>
          )}
          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-lg font-bold text-white sm:text-xl">{formatPrice(product.price)}</span>
              {onSale && compareAt && (
                <span className="text-sm text-white/40 line-through">{formatPrice(compareAt)}</span>
              )}
            </div>
            <AddToCartButton
              productId={product.id}
              className="flex-shrink-0 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition hover:brightness-110 disabled:opacity-60 sm:text-xs"
              style={{ backgroundColor: accent }}
            >
              Add to Cart
            </AddToCartButton>
          </div>
        </div>
      </Link>
    </article>
  )
}
