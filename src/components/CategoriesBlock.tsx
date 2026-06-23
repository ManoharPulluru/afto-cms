import type { ResolvedCategoriesBlock } from '@/lib/types/store'
import { CategoryCard } from '@/components/CategoryCard'

type CategoriesBlockProps = {
  block: ResolvedCategoriesBlock
}

export function CategoriesBlockComponent({ block }: CategoriesBlockProps) {
  const categories = block.categories || []

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">{block.title}</h2>
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No categories available.</p>
        )}
      </div>
    </section>
  )
}
