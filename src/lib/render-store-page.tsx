import { Suspense } from 'react'
import { loadStore } from '@/lib/store'
import { findPageByPath } from '@/lib/tree-utils'
import { BuilderPreview } from '@/components/builder/BuilderPreview'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { PageTreeRenderer } from '@/components/builder/PageTreeRenderer'
import { PageRenderer } from '@/components/PageRenderer'
import { resolvePageLayout } from '@/lib/resolve-layout'

type StorePageViewProps = {
  pagePath: string
  builder?: boolean
  pageId?: string
}

export async function StorePageView({ pagePath, builder, pageId }: StorePageViewProps) {
  const store = await loadStore()
  const page = findPageByPath(store.pages, pagePath)

  if (!page) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        Page not found
      </div>
    )
  }

  if (builder) {
    return (
      <Suspense fallback={<div className="p-8 text-gray-400">Loading preview...</div>}>
        <BuilderPreview initialStore={store} pagePath={pagePath} />
      </Suspense>
    )
  }

  if (page.tree && page.tree.length > 0) {
    return (
      <ThemeProvider store={store}>
        <PageTreeRenderer tree={page.tree} store={store} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider store={store}>
      <main>
        <PageRenderer layout={resolvePageLayout(store, pagePath)} />
      </main>
    </ThemeProvider>
  )
}
