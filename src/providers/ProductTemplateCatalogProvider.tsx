'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { PageNode, Product } from '@/lib/types/store'
import { collectTemplateIdsFromTree } from '@/lib/sync-template-children'
import { fetchProductTemplateDetail } from '@/lib/product-template-api'
import { mapTemplateProduct } from '@/lib/map-template-product'

type ProductCatalogContextValue = {
  getProduct: (id: string) => Product | undefined
  isLoading: boolean
}

const ProductCatalogContext = createContext<ProductCatalogContextValue>({
  getProduct: () => undefined,
  isLoading: false,
})

export function useProductCatalog() {
  return useContext(ProductCatalogContext)
}

type ProductTemplateCatalogProviderProps = {
  tree: PageNode[]
  storeProducts: Product[]
  children: ReactNode
}

export function ProductTemplateCatalogProvider({
  tree,
  storeProducts,
  children,
}: ProductTemplateCatalogProviderProps) {
  const templateIds = useMemo(() => collectTemplateIdsFromTree(tree), [tree])
  const templateKey = templateIds.join(',')
  const [templateProducts, setTemplateProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!templateKey) {
      setTemplateProducts([])
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    Promise.all(templateIds.map((id) => fetchProductTemplateDetail(id)))
      .then((templates) => {
        if (cancelled) return
        const products: Product[] = []
        for (const template of templates) {
          for (const section of template.sections) {
            for (const item of section.items) {
              products.push(mapTemplateProduct(item.product))
            }
          }
        }
        setTemplateProducts(products)
      })
      .catch(() => {
        if (!cancelled) setTemplateProducts([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [templateKey, templateIds])

  const lookup = useMemo(() => {
    const map = new Map<string, Product>()
    for (const product of storeProducts) map.set(product.id, product)
    for (const product of templateProducts) map.set(product.id, product)
    return map
  }, [storeProducts, templateProducts])

  const value = useMemo<ProductCatalogContextValue>(
    () => ({
      getProduct: (id: string) => lookup.get(id),
      isLoading,
    }),
    [lookup, isLoading],
  )

  return <ProductCatalogContext.Provider value={value}>{children}</ProductCatalogContext.Provider>
}
