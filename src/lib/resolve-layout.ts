import type {
  StoreData,
  LayoutBlock,
  ResolvedLayoutBlock,
  Product,
  Category,
} from '@/lib/types/store'
import { findPageByPath } from '@/lib/tree-utils'

export function resolveBlock(block: LayoutBlock, store: StoreData): ResolvedLayoutBlock {
  switch (block.blockType) {
    case 'productGrid': {
      const products = block.productIds
        .map((id) => store.products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
      return { blockType: 'productGrid', title: block.title, products }
    }
    case 'categoriesBlock': {
      const categories = block.categoryIds
        .map((id) => store.categories.find((c) => c.id === id))
        .filter((c): c is Category => Boolean(c))
      return { blockType: 'categoriesBlock', title: block.title, categories }
    }
    default:
      return block
  }
}

export function resolvePageLayout(store: StoreData, path: string): ResolvedLayoutBlock[] {
  const page = findPageByPath(store.pages, path)
  if (!page?.layout) return []
  return page.layout.map((block) => resolveBlock(block, store))
}
