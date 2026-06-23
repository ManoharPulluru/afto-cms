import Image from 'next/image'
import type { Product } from '@/lib/types/store'
import { getImageUrl, formatPrice } from '@/lib/utils'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getImageUrl(product.image)

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{product.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-tenant-primary">{formatPrice(product.price)}</span>
          <button
            type="button"
            className="rounded-lg bg-tenant-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}
