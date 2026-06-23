import { StorePageView } from '@/lib/render-store-page'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ builder?: string; pageId?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <StorePageView
      pagePath="/"
      builder={params.builder === '1'}
      pageId={params.pageId}
    />
  )
}
