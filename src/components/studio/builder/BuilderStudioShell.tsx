'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PageNode, StoreData } from '@/lib/types/store'
import { NavigatorPanel } from '@/components/studio/builder/NavigatorPanel'
import { PreviewPanel } from '@/components/studio/builder/PreviewPanel'
import { PropertiesPanel } from '@/components/studio/builder/PropertiesPanel'
import { ResizableStudioPanels } from '@/components/studio/builder/ResizableStudioPanels'
import { ThemePanel } from '@/components/studio/ThemePanel'
import { IconButton } from '@/components/studio/builder/ui/PanelChrome'
import { StudioIcon } from '@/components/studio/builder/ui/StudioIcon'
import {
  findNodeInPage,
  reorderSiblings,
  updateNodeInTree,
  findPageById,
  getNodeAncestorExpandKeys,
  findParentNode,
  removeNodeFromTree,
  getAddSectionInsertIndex,
  pageHasSectionType,
  canDeleteNode,
  canToggleNodeVisibility,
  getNodeLabel,
} from '@/lib/tree-utils'
import { ensureHeaderChildren, isHeaderChildVisible } from '@/lib/header-children'
import { ensureHeroChildren, switchHeroVariantState } from '@/lib/hero-children'
import { ensureCartDrawerChildren, switchCartDrawerVariantState } from '@/lib/cart-drawer-children'
import { getDefaultHeaderVariantProps, snapshotHeaderAppearance, stripHeaderMeta, switchHeaderVariantState } from '@/lib/header-variant-theme'
import { getDefaultPropsForNode } from '@/lib/node-default-props'
import { createNode, createPage, migrateStore } from '@/lib/migrate-store'
import { fetchProductTemplateDetail } from '@/lib/product-template-api'
import { applyProductTemplateLink } from '@/lib/draft-store-utils'
import type { WhatsAppTemplateListItem } from '@/lib/types/product-template'
import { getDefaultVariant } from '@/lib/registry'
import { useStudioHistory, type HistoryMode } from '@/hooks/useStudioHistory'
import {
  loadDraftFromStorage,
  saveDraftToStorage,
  clearDraftFromStorage,
} from '@/lib/draft-storage'

export function BuilderStudioShell() {
  const [publishedStore, setPublishedStore] = useState<StoreData | null>(null)
  const {
    present: draftStore,
    mutate: mutateDraft,
    undo,
    redo,
    resetHistory,
    flushDebounced,
    canUndo,
    canRedo,
  } = useStudioHistory<StoreData>(null)
  const [activePageId, setActivePageId] = useState('home')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false)
  const [error, setError] = useState('')
  const [showTheme, setShowTheme] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipPersistRef = useRef(true)

  useEffect(() => {
    fetch('/api/store')
      .then((r) => r.json())
      .then((raw: StoreData) => {
        const published = migrateStore(raw)
        setPublishedStore(published)
        const localDraft = loadDraftFromStorage(published.store.slug)
        const initialDraft = localDraft ? migrateStore(localDraft) : structuredClone(published)
        resetHistory(initialDraft)
        skipPersistRef.current = true
        setActivePageId(initialDraft.pages[0]?.id ?? 'home')
        setHasUnpublishedChanges(localDraft !== null)
        if (localDraft) saveDraftToStorage(initialDraft)
      })
      .catch(() => setError('Failed to load store data'))
  }, [resetHistory])

  const persistDraftLocally = useCallback((draft: StoreData) => {
    saveDraftToStorage(draft)
    setHasUnpublishedChanges(true)
  }, [])

  const updateDraft = useCallback(
    (updater: (prev: StoreData) => StoreData, mode: HistoryMode = 'debounced') => {
      mutateDraft(updater, mode)
      setPublished(false)
    },
    [mutateDraft],
  )

  useEffect(() => {
    if (!draftStore) return
    if (skipPersistRef.current) {
      skipPersistRef.current = false
      return
    }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => persistDraftLocally(draftStore), 150)
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [draftStore, persistDraftLocally])

  const activePage = useMemo(
    () => (draftStore ? findPageById(draftStore.pages, activePageId) : undefined),
    [draftStore, activePageId],
  )

  const selectedNode = useMemo(() => {
    if (!activePage || !selectedNodeId) return null
    return findNodeInPage(activePage, selectedNodeId)?.node ?? null
  }, [activePage, selectedNodeId])

  useEffect(() => {
    if (!selectedNodeId || !activePage?.tree) return
    const keys = getNodeAncestorExpandKeys(activePageId, activePage.tree, selectedNodeId)
    if (!keys?.length) return
    setExpanded((prev) => {
      const next = { ...prev }
      for (const key of keys) next[key] = true
      return next
    })
  }, [selectedNodeId, activePageId, activePage?.tree])

  useEffect(() => {
    if (!selectedNodeId || !activePage?.tree) return
    const parent = findParentNode(activePage.tree, selectedNodeId)
    if (parent?.type !== 'header') return
    const child = findNodeInPage(activePage, selectedNodeId)?.node
    if (!child || isHeaderChildVisible(parent.variant, child.type, child)) return
    setSelectedNodeId(parent.id)
  }, [selectedNodeId, activePage, activePageId])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      const key = e.key.toLowerCase()
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo])

  async function handlePublish() {
    if (!draftStore) return
    flushDebounced()
    setPublishing(true)
    setError('')
    try {
      const res = await fetch('/api/store', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(migrateStore(draftStore)),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Publish failed')
      }
      setPublishedStore(structuredClone(draftStore))
      clearDraftFromStorage(draftStore.store.slug)
      skipPersistRef.current = true
      setHasUnpublishedChanges(false)
      setPublished(true)
      setTimeout(() => setPublished(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish failed')
    } finally {
      setPublishing(false)
    }
  }

  function handleDiscardDraft() {
    if (!publishedStore) return
    if (!confirm('Discard all unpublished changes and restore the last published version?')) return
    const restored = structuredClone(publishedStore)
    skipPersistRef.current = true
    resetHistory(restored)
    clearDraftFromStorage(restored.store.slug)
    setHasUnpublishedChanges(false)
    setSelectedNodeId(null)
  }

  function updatePageTree(
    pageId: string,
    updater: (tree: PageNode[]) => PageNode[],
    mode: HistoryMode = 'debounced',
  ) {
    updateDraft(
      (prev) => ({
        ...prev,
        pages: prev.pages.map((p) =>
          p.id === pageId ? { ...p, tree: updater(p.tree ?? []) } : p,
        ),
      }),
      mode,
    )
  }

  function handleUpdateProps(nodeId: string, props: Record<string, unknown>) {
    updatePageTree(activePageId, (tree) =>
      updateNodeInTree(tree, nodeId, (node) => {
        let next: PageNode = { ...node, props }
        if (node.type === 'header') {
          const appearance = stripHeaderMeta(props)
          const appearanceByVariant = snapshotHeaderAppearance(
            { ...(node.props ?? {}), ...appearance },
            node.variant,
          )
          next = {
            ...node,
            props: {
              ...appearance,
              appearanceByVariant,
              childrenByVariant: node.props?.childrenByVariant,
            },
          }
        }
        if (node.type === 'productSection' && props.productCardVariant) {
          const variant = props.productCardVariant as string
          next.children = syncProductSectionCardVariants(node.children, variant)
        }
        return next
      }),
    )
    setSelectedNodeId(nodeId)
  }

  function handleResetProps(nodeId: string) {
    if (!draftStore || !activePage) return
    const found = findNodeInPage(activePage, nodeId)
    if (!found) return
    if (found.node.type === 'header') {
      const defaults = getDefaultPropsForNode(found.node, draftStore)
      updatePageTree(
        activePageId,
        (tree) =>
          updateNodeInTree(tree, nodeId, (node) => {
            const childrenByVariant = {
              ...((node.props?.childrenByVariant as Record<string, PageNode[]> | undefined) ?? {}),
            }
            delete childrenByVariant[node.variant]
            const next = ensureHeaderChildren(
              {
                ...node,
                props: { ...defaults, childrenByVariant },
                children: undefined,
              },
              draftStore!,
              { resetChildProps: true },
            )
            return {
              ...next,
              props: {
                ...next.props,
                childrenByVariant: {
                  ...childrenByVariant,
                  [node.variant]: next.children ?? [],
                },
              },
            }
          }),
        'immediate',
      )
      setSelectedNodeId(nodeId)
      return
    }
    if (found.node.type === 'cartDrawer') {
      const defaults = getDefaultPropsForNode(found.node, draftStore)
      updatePageTree(
        activePageId,
        (tree) =>
          updateNodeInTree(tree, nodeId, (node) => {
            const childrenByVariant = {
              ...((node.props?.childrenByVariant as Record<string, PageNode[]> | undefined) ?? {}),
            }
            delete childrenByVariant[node.variant]
            const next = ensureCartDrawerChildren(
              {
                ...node,
                props: { ...defaults, childrenByVariant },
                children: undefined,
              },
              draftStore!,
            )
            return {
              ...next,
              props: {
                ...next.props,
                childrenByVariant: {
                  ...childrenByVariant,
                  [node.variant]: next.children ?? [],
                },
              },
            }
          }),
        'immediate',
      )
      setSelectedNodeId(nodeId)
      return
    }
    const defaults = getDefaultPropsForNode(found.node, draftStore)
    updatePageTree(
      activePageId,
      (tree) => updateNodeInTree(tree, nodeId, (node) => ({ ...node, props: defaults })),
      'immediate',
    )
    setSelectedNodeId(nodeId)
  }

  function handleChangeVariant(nodeId: string, variant: string) {
    updatePageTree(activePageId, (tree) =>
      updateNodeInTree(tree, nodeId, (node) => {
        if (!draftStore) return { ...node, variant }
        if (node.type === 'header') {
          const switched = switchHeaderVariantState(node, variant, draftStore)
          const hasSavedChildren = Boolean(switched.children?.length)
          const next = ensureHeaderChildren(
            {
              ...node,
              variant,
              props: switched.props,
              children: switched.children,
            },
            draftStore,
            { resetChildProps: !hasSavedChildren },
          )
          const childrenByVariant = {
            ...((next.props?.childrenByVariant as Record<string, PageNode[]> | undefined) ?? {}),
            [variant]: next.children ?? [],
          }
          return {
            ...next,
            props: { ...next.props, childrenByVariant },
          }
        }
        if (node.type === 'hero') {
          const switched = switchHeroVariantState(node, variant)
          const hasSavedChildren = Boolean(switched.children?.length)
          const next = ensureHeroChildren(
            {
              ...node,
              variant,
              props: switched.props,
              children: switched.children,
            },
            draftStore,
          )
          const childrenByVariant = {
            ...((next.props?.childrenByVariant as Record<string, PageNode[]> | undefined) ?? {}),
            [variant]: next.children ?? [],
          }
          return {
            ...next,
            props: { ...next.props, childrenByVariant },
          }
        }
        if (node.type === 'cartDrawer') {
          const switched = switchCartDrawerVariantState(node, variant)
          const hasSavedChildren = Boolean(switched.children?.length)
          const next = ensureCartDrawerChildren({
            ...node,
            variant,
            props: switched.props,
            children: hasSavedChildren ? switched.children : undefined,
          }, draftStore)
          const childrenByVariant = {
            ...((next.props?.childrenByVariant as Record<string, PageNode[]> | undefined) ?? {}),
            [variant]: next.children ?? [],
          }
          return {
            ...next,
            props: { ...next.props, childrenByVariant },
          }
        }
        return {
          ...node,
          variant,
          props: getDefaultPropsForNode({ ...node, variant }, draftStore),
        }
      }),
      'immediate',
    )
    setSelectedNodeId(nodeId)
  }

  function syncProductSectionCardVariants(
    children: PageNode[] | undefined,
    variant: string,
  ): PageNode[] | undefined {
    return children?.map((child) => {
      if (child.type === 'productCard') return { ...child, variant }
      if (child.type === 'templateSection') {
        return {
          ...child,
          props: { ...child.props, productCardVariant: variant },
          children: child.children?.map((c) =>
            c.type === 'productCard' ? { ...c, variant } : c,
          ),
        }
      }
      return child
    })
  }

  function handleChangeProductCardVariant(sectionNodeId: string, variant: string) {
    updatePageTree(
      activePageId,
      (tree) =>
        updateNodeInTree(tree, sectionNodeId, (node) => ({
          ...node,
          props: { ...node.props, productCardVariant: variant },
          children: syncProductSectionCardVariants(node.children, variant),
        })),
      'immediate',
    )
    setSelectedNodeId(sectionNodeId)
  }

  async function handleLinkProductTemplate(
    sectionNodeId: string,
    template: WhatsAppTemplateListItem | null,
  ) {
    if (!draftStore) return

    if (!template) {
      const nextStore = applyProductTemplateLink(draftStore, activePageId, sectionNodeId, {
        action: 'unlink',
      })
      updateDraft(() => nextStore, 'immediate')
      saveDraftToStorage(nextStore)
      setHasUnpublishedChanges(true)
      setPublished(false)
      setSelectedNodeId(sectionNodeId)
      return
    }

    try {
      const detail = await fetchProductTemplateDetail(template.id)
      const sectionNode = activePage
        ? findNodeInPage(activePage, sectionNodeId)?.node
        : undefined
      const productCardVariant = String(
        sectionNode?.props?.productCardVariant ?? 'ProductCardV4',
      )

      const nextStore = applyProductTemplateLink(draftStore, activePageId, sectionNodeId, {
        action: 'link',
        templateId: template.id,
        templateName: template.name,
        headerText: template.headerText,
        detail,
        productCardVariant,
      })

      updateDraft(() => nextStore, 'immediate')
      saveDraftToStorage(nextStore)
      setHasUnpublishedChanges(true)
      setPublished(false)
      setSelectedNodeId(sectionNodeId)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to link template')
    }
  }

  function handleReorder(parentId: string | null, activeId: string, overId: string) {
    updatePageTree(activePageId, (tree) => reorderSiblings(tree, parentId, activeId, overId), 'immediate')
  }

  function syncParentChildrenSnapshot(tree: PageNode[], parent: PageNode | null): PageNode[] {
    if (!parent || (parent.type !== 'header' && parent.type !== 'hero' && parent.type !== 'cartDrawer')) return tree
    return updateNodeInTree(tree, parent.id, (section) => ({
      ...section,
      props: {
        ...section.props,
        childrenByVariant: {
          ...((section.props?.childrenByVariant as Record<string, PageNode[]> | undefined) ?? {}),
          [section.variant]: section.children ?? [],
        },
      },
    }))
  }

  function handleToggleNodeVisibility(nodeId: string) {
    if (!activePage?.tree) return
    const found = findNodeInPage(activePage, nodeId)
    if (!found) return
    const depth = found.path.length - 1
    if (!canToggleNodeVisibility(depth)) return

    const parent = findParentNode(activePage.tree, nodeId)

    updatePageTree(
      activePageId,
      (tree) => {
        let next = updateNodeInTree(tree, nodeId, (node) => ({
          ...node,
          props: {
            ...node.props,
            visible: node.props?.visible === false,
          },
        }))
        next = syncParentChildrenSnapshot(next, parent)
        return next
      },
      'immediate',
    )
    setSelectedNodeId(nodeId)
  }

  function handleDeleteNode(nodeId: string) {
    if (!activePage?.tree) return
    const found = findNodeInPage(activePage, nodeId)
    if (!found || !canDeleteNode(found.node, found.path.length - 1)) return
    const label = getNodeLabel(found.node)
    if (!confirm(`Remove "${label}" from this page?`)) return

    const parent = findParentNode(activePage.tree, nodeId)

    updatePageTree(
      activePageId,
      (tree) => {
        let next = removeNodeFromTree(tree, nodeId)
        next = syncParentChildrenSnapshot(next, parent)
        return next
      },
      'immediate',
    )
    if (selectedNodeId === nodeId) setSelectedNodeId(null)
  }

  function handleAddSection(pageId: string, type: string, relativeToNodeId: string | null = null) {
    if (!draftStore) return

    const activePage = draftStore.pages.find((p) => p.id === pageId)
    const tree = activePage?.tree ?? []

    if ((type === 'header' || type === 'footer') && pageHasSectionType(tree, type)) {
      const existing = tree.find((n) => n.type === type)
      if (existing) setSelectedNodeId(existing.id)
      return
    }

    const variant = getDefaultVariant(type)
    let node = createNode(type, variant?.label, draftStore)
    if (type === 'header') {
      node = ensureHeaderChildren(node, draftStore)
    }
    if (type === 'productSection') {
      node.props = {
        ...node.props,
        title: '',
        productCardVariant: 'ProductCardV4',
      }
      node.children = []
      node.label = 'Product Template'
    }
    if (type === 'loginModal') {
      node.props = {
        ...node.props,
        enabled: true,
        displayAsOverlay: true,
        modalTitle: 'Welcome Back',
        modalSubtitle: 'Sign in to access your account',
        otpButtonLabel: 'Get OTP',
        mobilePlaceholder: '98765 43210',
      }
    }
    if (type === 'cartDrawer') {
      node = ensureCartDrawerChildren(
        {
          ...node,
          props: {
            ...node.props,
            enabled: true,
            displayAsOverlay: true,
            orderNumber: '28390',
          },
        },
        draftStore,
      )
    }

    updatePageTree(pageId, (currentTree) => {
      const idx = getAddSectionInsertIndex(currentTree, type, relativeToNodeId)
      const next = [...currentTree]
      next.splice(idx, 0, node)
      return next
    }, 'immediate')
    setSelectedNodeId(node.id)
  }

  function handleAddPage() {
    const title = prompt('Page title:', 'New Page')
    if (!title) return
    const slug = prompt('Page path (e.g. /about):', '/about')
    if (!slug) return
    const page = createPage(title, slug)
    page.tree = [
      createNode('header', 'Header', draftStore ?? undefined),
      createNode('footer', 'Footer', draftStore ?? undefined),
    ]
    updateDraft((prev) => ({ ...prev, pages: [...prev.pages, page] }), 'immediate')
    setActivePageId(page.id)
  }

  if (!draftStore) {
    return (
      <div className="studio-shell flex h-screen flex-col items-center justify-center gap-4 bg-zinc-950 text-zinc-500">
        <StudioIcon icon="solar:refresh-circle-bold-duotone" width={40} height={40} className="animate-spin text-teal-500/60" />
        <p className="text-sm font-medium">{error || 'Loading studio…'}</p>
      </div>
    )
  }

  return (
    <div className="studio-shell flex h-screen flex-col bg-zinc-950">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-zinc-800/80 bg-zinc-900/50 px-4 py-2.5 backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-violet-500/20 ring-1 ring-zinc-700/60">
            <StudioIcon icon="solar:palette-round-bold-duotone" width={20} height={20} className="text-teal-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-zinc-100">Afto Studio</span>
              <span className="hidden rounded-md bg-zinc-800/80 px-2 py-0.5 text-[11px] font-medium text-zinc-400 sm:inline">
                {draftStore.store.name}
              </span>
            </div>
            <p className="truncate text-[11px] text-zinc-600">Visual page builder</p>
          </div>
          {hasUnpublishedChanges && (
            <span className="hidden items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-300 md:inline-flex">
              <StudioIcon icon="solar:cloud-storage-bold-duotone" width={12} height={12} />
              Unsaved draft
            </span>
          )}
          {published && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
              <StudioIcon icon="solar:check-circle-bold" width={12} height={12} />
              Published
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {error && (
            <span className="hidden max-w-[180px] truncate text-xs text-red-400 lg:inline">{error}</span>
          )}
          <IconButton
            icon="solar:undo-left-round-linear"
            label="Undo"
            size="sm"
            variant="ghost"
            disabled={!canUndo}
            onClick={undo}
          />
          <IconButton
            icon="solar:redo-round-linear"
            label="Redo"
            size="sm"
            variant="ghost"
            disabled={!canRedo}
            onClick={redo}
          />
          <IconButton
            icon={showTheme ? 'solar:close-circle-linear' : 'solar:pallete-2-bold-duotone'}
            label="Theme"
            size="sm"
            variant={showTheme ? 'primary' : 'ghost'}
            onClick={() => setShowTheme((v) => !v)}
          />
          {hasUnpublishedChanges && (
            <IconButton
              icon="solar:trash-bin-trash-linear"
              label="Discard"
              size="sm"
              variant="danger"
              onClick={handleDiscardDraft}
            />
          )}
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing || !hasUnpublishedChanges}
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-teal-500/40 bg-teal-500 px-3 text-sm font-semibold text-zinc-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-600"
          >
            <StudioIcon
              icon={publishing ? 'solar:refresh-linear' : 'solar:upload-minimalistic-bold'}
              width={16}
              height={16}
              className={publishing ? 'animate-spin' : ''}
            />
            {publishing ? 'Publishing…' : 'Publish'}
          </button>
          <IconButton
            icon="solar:logout-2-linear"
            label="Logout"
            size="sm"
            variant="muted"
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              window.location.href = '/studio/login'
            }}
          />
        </div>
      </header>

      {showTheme && (
        <div className="shrink-0 border-b border-zinc-800/80 bg-zinc-900/40 px-4 py-4">
          <ThemePanel
            store={draftStore.store}
            onChange={(storeInfo) => updateDraft((prev) => ({ ...prev, store: storeInfo }))}
          />
        </div>
      )}

      <ResizableStudioPanels
        left={
          <NavigatorPanel
            pages={draftStore.pages}
            activePageId={activePageId}
            selectedNodeId={selectedNodeId}
            expanded={expanded}
            onSelectPage={(id) => {
              setActivePageId(id)
              setSelectedNodeId(null)
            }}
            onSelectNode={setSelectedNodeId}
            onToggleExpand={(key, defaultExpanded) =>
              setExpanded((e) => ({ ...e, [key]: !(e[key] ?? defaultExpanded) }))
            }
            onReorder={handleReorder}
            onDeleteNode={handleDeleteNode}
            onToggleNodeVisibility={handleToggleNodeVisibility}
            onAddPage={handleAddPage}
            onAddSection={handleAddSection}
          />
        }
        center={
          <PreviewPanel
            draftStore={draftStore}
            pageId={activePageId}
            selectedNodeId={selectedNodeId}
            hoveredNodeId={hoveredNodeId}
            onSelectNode={setSelectedNodeId}
            onHoverNode={setHoveredNodeId}
          />
        }
        right={
          <PropertiesPanel
            node={selectedNode}
            pageTree={activePage?.tree}
            store={draftStore}
            onUpdateProps={handleUpdateProps}
            onResetProps={handleResetProps}
            onChangeVariant={handleChangeVariant}
            onChangeProductCardVariant={handleChangeProductCardVariant}
            onLinkProductTemplate={handleLinkProductTemplate}
          />
        }
      />
    </div>
  )
}
