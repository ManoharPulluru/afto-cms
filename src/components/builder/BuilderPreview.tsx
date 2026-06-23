'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import type { StoreData } from '@/lib/types/store'
import type { BuilderMessage } from '@/lib/types/store'
import { PageTreeRenderer } from '@/components/builder/PageTreeRenderer'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { findPageById } from '@/lib/tree-utils'
import { PageRenderer } from '@/components/PageRenderer'
import { resolvePageLayout } from '@/lib/resolve-layout'

type BuilderPreviewProps = {
  initialStore: StoreData
  pagePath: string
}

export function BuilderPreview({ initialStore, pagePath }: BuilderPreviewProps) {
  const searchParams = useSearchParams()
  const isBuilder = searchParams.get('builder') === '1'
  const pageIdParam = searchParams.get('pageId')

  const [inFrame, setInFrame] = useState(false)
  const [draftSynced, setDraftSynced] = useState(false)
  const [store, setStore] = useState(initialStore)
  const [pageId, setPageId] = useState(pageIdParam || 'home')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  const postToParent = useCallback((msg: BuilderMessage) => {
    if (window.parent !== window) {
      window.parent.postMessage(msg, window.location.origin)
    }
  }, [])

  useEffect(() => {
    const framed = window.parent !== window
    setInFrame(framed)
    if (!framed || !isBuilder) {
      setDraftSynced(true)
    }
  }, [isBuilder])

  useEffect(() => {
    if (!inFrame || !isBuilder) return
    document.documentElement.classList.add('builder-preview-frame')
    document.body.classList.add('builder-preview-frame')
    return () => {
      document.documentElement.classList.remove('builder-preview-frame')
      document.body.classList.remove('builder-preview-frame')
    }
  }, [inFrame, isBuilder])

  useEffect(() => {
    if (!isBuilder) return

    postToParent({ type: 'BUILDER_READY' })

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      const msg = event.data as BuilderMessage
      if (msg.type === 'BUILDER_INIT' || msg.type === 'BUILDER_UPDATE') {
        setStore(msg.store)
        setPageId(msg.pageId)
        setSelectedNodeId(msg.selectedNodeId)
        setDraftSynced(true)
      }
      if (msg.type === 'BUILDER_SELECT') {
        setSelectedNodeId(msg.nodeId)
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [isBuilder, postToParent])

  const page = findPageById(store.pages, pageId) ?? store.pages[0]
  const useTree = Boolean(page?.tree?.length)

  const handleSelect = useCallback(
    (nodeId: string) => {
      setSelectedNodeId(nodeId)
      postToParent({ type: 'BUILDER_SELECT', nodeId })
    },
    [postToParent],
  )

  const handleHover = useCallback(
    (nodeId: string | null) => {
      setHoveredNodeId(nodeId)
      if (inFrame) postToParent({ type: 'BUILDER_HOVER', nodeId })
    },
    [inFrame, postToParent],
  )

  if (!page) {
    return <div className="p-8 text-gray-500">Page not found</div>
  }

  if (inFrame && isBuilder && !draftSynced) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-zinc-50 text-sm text-zinc-500">
        Loading draft preview…
      </div>
    )
  }

  return (
    <ThemeProvider store={store}>
      {useTree ? (
        <PageTreeRenderer
          tree={page.tree!}
          store={store}
          ctx={{
            builderMode: isBuilder,
            previewInFrame: inFrame && isBuilder,
            selectedNodeId,
            hoveredNodeId,
            onSelectNode: isBuilder ? handleSelect : undefined,
            onHoverNode: isBuilder ? handleHover : undefined,
          }}
        />
      ) : (
        <>
          {!isBuilder && (
            <div className="legacy-layout-warning hidden" />
          )}
          <main>
            <PageRenderer layout={resolvePageLayout(store, pagePath)} />
          </main>
        </>
      )}
    </ThemeProvider>
  )
}
