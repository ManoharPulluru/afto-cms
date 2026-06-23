import { StorePageView } from '@/lib/render-store-page'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ builder?: string; pageId?: string }>
}

export default async function StorefrontSlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const query = await searchParams
  const pagePath = `/${slug.join('/')}`

  return (
    <StorePageView
      pagePath={pagePath}
      builder={query.builder === '1'}
      pageId={query.pageId}
    />
  )
}
