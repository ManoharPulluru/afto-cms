import type { ResolvedLayoutBlock } from '@/lib/types/store'
import { HeroBanner } from '@/components/HeroBanner'
import { VideoBanner } from '@/components/VideoBanner'
import { ProductGridBlock } from '@/components/ProductGrid'
import { CategoriesBlockComponent } from '@/components/CategoriesBlock'
import { OffersCarousel } from '@/components/OffersCarousel'
import { Testimonials } from '@/components/Testimonials'

type PageRendererProps = {
  layout: ResolvedLayoutBlock[]
}

export function PageRenderer({ layout }: PageRendererProps) {
  return (
    <main>
      {layout.map((block, index) => {
        switch (block.blockType) {
          case 'heroBanner':
            return <HeroBanner key={index} block={block} />
          case 'videoBanner':
            return <VideoBanner key={index} block={block} />
          case 'productGrid':
            return <ProductGridBlock key={index} block={block} />
          case 'categoriesBlock':
            return <CategoriesBlockComponent key={index} block={block} />
          case 'offersCarousel':
            return <OffersCarousel key={index} block={block} />
          case 'testimonials':
            return <Testimonials key={index} block={block} />
          default:
            return null
        }
      })}
    </main>
  )
}
