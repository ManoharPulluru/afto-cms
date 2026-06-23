'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { StoreData } from '@/lib/types/store'
import type { BuilderMessage } from '@/lib/types/store'

type UsePreviewSyncOptions = {
  draftStore: StoreData
  pageId: string
  selectedNodeId: string | null
  onSelectNode: (nodeId: string) => void
  onHoverNode: (nodeId: string | null) => void
}

export function usePreviewSync({
  draftStore,
  pageId,
  selectedNodeId,
  onSelectNode,
  onHoverNode,
}: UsePreviewSyncOptions) {
  const iframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map())
  const readyFrames = useRef<Set<string>>(new Set())

  const broadcast = useCallback(
    (msg: BuilderMessage) => {
      if (typeof window === 'undefined') return
      iframeRefs.current.forEach((iframe) => {
        iframe.contentWindow?.postMessage(msg, window.location.origin)
      })
    },
    [],
  )

  const pushDraft = useCallback(() => {
    broadcast({
      type: 'BUILDER_UPDATE',
      store: draftStore,
      pageId,
      selectedNodeId,
    })
  }, [broadcast, draftStore, pageId, selectedNodeId])

  useEffect(() => {
    pushDraft()
  }, [pushDraft])

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      const msg = event.data as BuilderMessage
      if (msg.type === 'BUILDER_READY') {
        pushDraft()
      }
      if (msg.type === 'BUILDER_SELECT') {
        onSelectNode(msg.nodeId)
      }
      if (msg.type === 'BUILDER_HOVER') {
        onHoverNode(msg.nodeId)
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [onHoverNode, onSelectNode, pushDraft])

  function registerIframe(key: string, el: HTMLIFrameElement | null) {
    if (el) iframeRefs.current.set(key, el)
    else iframeRefs.current.delete(key)
  }

  return { registerIframe, pushDraft }
}
