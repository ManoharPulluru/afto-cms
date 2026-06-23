import type { ResolvedProductGridBlock } from '@/lib/types/store'
import { ProductCard } from '@/components/ProductCard'

type ProductGridProps = {
  block: ResolvedProductGridBlock
}

export function ProductGridBlock({ block }: ProductGridProps) {
  const products = block.products || []

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">{block.title}</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products available.</p>
        )}
      </div>
    </section>
  )
}
