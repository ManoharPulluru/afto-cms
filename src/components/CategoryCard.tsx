import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@/lib/types/store'
import { getImageUrl } from '@/lib/utils'

type CategoryCardProps = {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const imageUrl = getImageUrl(category.image)

  return (
    <Link
      href={`/categories/${category.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-tenant-primary/10 text-sm font-medium text-tenant-primary">
            {category.name}
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold text-gray-900 group-hover:text-tenant-primary">{category.name}</h3>
      </div>
    </Link>
  )
}
