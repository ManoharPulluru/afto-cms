'use client'

import { Fragment, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { PageNode, StorePage } from '@/lib/types/store'
import { filterNodesForNavigator } from '@/lib/header-children'
import {
  canDeleteNode,
  canReorderSiblings,
  canToggleNodeVisibility,
  getNodeLabel,
  getSiblingList,
  isNodeDraggable,
  isNodeVisibleInTree,
  pageHasSectionType,
} from '@/lib/tree-utils'
import { componentRegistry, getComponentType } from '@/lib/registry'
import { getNodeTypeIcon, SECTION_ADD_ICONS } from '@/components/studio/builder/node-icons'
import { PanelChrome, SectionBlock, IconButton } from '@/components/studio/builder/ui/PanelChrome'
import { StudioIcon } from '@/components/studio/builder/ui/StudioIcon'

type NavigatorPanelProps = {
  pages: StorePage[]
  activePageId: string
  selectedNodeId: string | null
  expanded: Record<string, boolean>
  onSelectPage: (pageId: string) => void
  onSelectNode: (nodeId: string) => void
  onToggleExpand: (key: string, defaultExpanded: boolean) => void
  onReorder: (parentId: string | null, activeId: string, overId: string) => void
  onDeleteNode: (nodeId: string) => void
  onToggleNodeVisibility: (nodeId: string) => void
  onAddPage: () => void
  onAddSection: (pageId: string, type: string, relativeToNodeId: string | null) => void
}

function SortableTreeItem({
  id,
  label,
  nodeType,
  depth,
  selected,
  expanded,
  hasChildren,
  draggable,
  deletable,
  visibilityToggle,
  visible,
  onSelect,
  onToggle,
  onDelete,
  onToggleVisibility,
}: {
  id: string
  label: string
  nodeType: string
  depth: number
  selected: boolean
  expanded: boolean
  hasChildren: boolean
  draggable: boolean
  deletable: boolean
  visibilityToggle: boolean
  visible: boolean
  onSelect: () => void
  onToggle: () => void
  onDelete: () => void
  onToggleVisibility: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !draggable,
  })
  const icon = getNodeTypeIcon(nodeType)

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        paddingLeft: depth * 14 + 8,
        opacity: isDragging ? 0.6 : 1,
      }}
      className={`group mb-0.5 flex items-center gap-1 rounded-lg pr-1.5 transition-colors ${
        selected
          ? 'bg-teal-500/15 text-teal-200 ring-1 ring-teal-500/40'
          : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
      } ${!visible && visibilityToggle ? 'opacity-50' : ''} ${isDragging ? 'z-10 shadow-lg shadow-black/40 ring-1 ring-zinc-600' : ''}`}
    >
      {hasChildren ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          className="flex h-7 w-6 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
        >
          <StudioIcon
            icon={expanded ? 'solar:alt-arrow-down-linear' : 'solar:alt-arrow-right-linear'}
            width={14}
            height={14}
          />
        </button>
      ) : (
        <span className="w-6 shrink-0" />
      )}

      {draggable ? (
        <button
          type="button"
          className="flex h-7 w-6 shrink-0 cursor-grab items-center justify-center rounded-md text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <StudioIcon icon="solar:hamburger-menu-linear" width={14} height={14} />
        </button>
      ) : (
        <span className="w-6 shrink-0" />
      )}

      <button type="button" className="flex min-w-0 flex-1 items-center gap-2 py-1.5 text-left" onClick={onSelect}>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
            selected ? 'bg-teal-500/20 text-teal-400' : 'bg-zinc-800/80 text-zinc-500'
          }`}
        >
          <StudioIcon icon={icon} width={13} height={13} />
        </span>
        <span className={`truncate text-[13px] font-medium ${!visible && visibilityToggle ? 'line-through' : ''}`}>
          {label}
        </span>
      </button>

      {visibilityToggle && (
        <button
          type="button"
          title={visible ? 'Hide on page' : 'Show on page'}
          onClick={(e) => {
            e.stopPropagation()
            onToggleVisibility()
          }}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
            visible
              ? 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
              : 'text-amber-500/80 hover:bg-amber-500/10 hover:text-amber-400'
          } ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <StudioIcon
            icon={visible ? 'solar:eye-linear' : 'solar:eye-closed-linear'}
            width={14}
            height={14}
          />
        </button>
      )}

      {deletable && (
        <button
          type="button"
          title="Remove from page"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-red-500/15 hover:text-red-400 ${
            depth > 0 || selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <StudioIcon icon="solar:trash-bin-trash-linear" width={14} height={14} />
        </button>
      )}
    </div>
  )
}

function TreeLevel({
  nodes,
  depth,
  parentKey,
  selectedNodeId,
  expanded,
  onSelectNode,
  onToggleExpand,
  onDeleteNode,
  onToggleNodeVisibility,
}: {
  nodes: PageNode[]
  depth: number
  parentKey: string
  selectedNodeId: string | null
  expanded: Record<string, boolean>
  onSelectNode: (nodeId: string) => void
  onToggleExpand: (key: string, defaultExpanded: boolean) => void
  onDeleteNode: (nodeId: string) => void
  onToggleNodeVisibility: (nodeId: string) => void
}) {
  const sortableIds = useMemo(() => nodes.map((node) => node.id), [nodes])

  return (
    <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
      {nodes.map((node) => {
        const key = `${parentKey}:${node.id}`
        const hasChildren = Boolean(node.children?.length)
        const isExpanded = expanded[key] ?? false

        return (
          <Fragment key={node.id}>
            <SortableTreeItem
              id={node.id}
              label={getNodeLabel(node)}
              nodeType={node.type}
              depth={depth}
              selected={selectedNodeId === node.id}
              expanded={isExpanded}
              hasChildren={hasChildren}
              draggable={isNodeDraggable(node)}
              deletable={canDeleteNode(node, depth)}
              visibilityToggle={canToggleNodeVisibility(depth)}
              visible={isNodeVisibleInTree(node)}
              onSelect={() => onSelectNode(node.id)}
              onToggle={() => onToggleExpand(key, false)}
              onDelete={() => onDeleteNode(node.id)}
              onToggleVisibility={() => onToggleNodeVisibility(node.id)}
            />
            {hasChildren && isExpanded && node.children && (
              <TreeLevel
                nodes={node.children}
                depth={depth + 1}
                parentKey={key}
                selectedNodeId={selectedNodeId}
                expanded={expanded}
                onSelectNode={onSelectNode}
                onToggleExpand={onToggleExpand}
                onDeleteNode={onDeleteNode}
                onToggleNodeVisibility={onToggleNodeVisibility}
              />
            )}
          </Fragment>
        )
      })}
    </SortableContext>
  )
}

export function NavigatorPanel({
  pages,
  activePageId,
  selectedNodeId,
  expanded,
  onSelectPage,
  onSelectNode,
  onToggleExpand,
  onReorder,
  onDeleteNode,
  onToggleNodeVisibility,
  onAddPage,
  onAddSection,
}: NavigatorPanelProps) {
  const activePage = pages.find((p) => p.id === activePageId)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const navigatorTree = useMemo(
    () => (activePage?.tree ? filterNodesForNavigator(activePage.tree) : []),
    [activePage?.tree],
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id || !activePage?.tree) return

    const activeId = String(active.id)
    const overId = String(over.id)
    const activeSiblings = getSiblingList(activePage.tree, activeId)
    const overSiblings = getSiblingList(activePage.tree, overId)
    if (!activeSiblings || !overSiblings) return
    if (activeSiblings.parentId !== overSiblings.parentId) return
    if (!canReorderSiblings(activePage.tree, activeSiblings.parentId, activeId, overId)) return

    onReorder(activeSiblings.parentId, activeId, overId)
  }

  const sectionTypes = useMemo(() => {
    const layoutFirst = ['header', 'footer']
    return componentRegistry
      .filter((c) => c.category === 'section')
      .sort((a, b) => {
        const ai = layoutFirst.indexOf(a.type)
        const bi = layoutFirst.indexOf(b.type)
        if (ai !== -1 && bi !== -1) return ai - bi
        if (ai !== -1) return -1
        if (bi !== -1) return 1
        return a.label.localeCompare(b.label)
      })
  }, [])

  const tree = activePage?.tree ?? []
  const hasHeader = pageHasSectionType(tree, 'header')
  const hasFooter = pageHasSectionType(tree, 'footer')

  const addSectionHint = selectedNodeId
    ? 'Inserts below the selected layer'
    : 'Inserts at the bottom of the page'

  return (
    <PanelChrome
      icon="solar:siderbar-bold-duotone"
      title="Navigator"
      subtitle="Pages & structure"
      className="border-r border-zinc-800/80"
      action={
        <IconButton icon="solar:add-circle-linear" label="Page" size="sm" variant="primary" onClick={onAddPage} />
      }
    >
      <SectionBlock label="Pages" icon="solar:documents-bold-duotone">
        <div className="space-y-1">
          {pages.map((page) => {
            const isActive = activePageId === page.id
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => onSelectPage(page.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                  isActive
                    ? 'border-teal-500/30 bg-teal-500/10 text-teal-100 shadow-sm shadow-teal-500/5'
                    : 'border-transparent bg-zinc-900/40 text-zinc-400 hover:border-zinc-700/60 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isActive ? 'bg-teal-500/20 text-teal-400' : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  <StudioIcon icon="solar:document-text-bold-duotone" width={16} height={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{page.title}</span>
                  <span className="block truncate text-[11px] text-zinc-600">{page.slug}</span>
                </span>
                {isActive && (
                  <StudioIcon icon="solar:check-circle-bold" width={16} height={16} className="shrink-0 text-teal-400" />
                )}
              </button>
            )
          })}
        </div>
      </SectionBlock>

      {activePage && (
        <>
          <SectionBlock label="Add section" icon="solar:add-square-bold-duotone">
            <p className="mb-2 text-[11px] text-zinc-600">{addSectionHint}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {sectionTypes.map((t) => {
                const onPage =
                  (t.type === 'header' && hasHeader) || (t.type === 'footer' && hasFooter)
                return (
                <button
                  key={t.type}
                  type="button"
                  disabled={onPage}
                  onClick={() => onAddSection(activePage.id, t.type, selectedNodeId)}
                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs transition ${
                    onPage
                      ? 'cursor-not-allowed border-zinc-800/40 bg-zinc-900/20 text-zinc-600'
                      : 'border-zinc-800/80 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/60 hover:text-zinc-200'
                  }`}
                  title={onPage ? `${t.label} is already on this page` : `Add ${t.label}`}
                >
                  <StudioIcon
                    icon={SECTION_ADD_ICONS[t.type] ?? 'solar:widget-add-bold-duotone'}
                    width={14}
                    height={14}
                    className="shrink-0 text-zinc-500"
                  />
                  <span className="truncate font-medium">{t.label}</span>
                </button>
                )
              })}
            </div>
          </SectionBlock>

          <SectionBlock label="Layer tree" icon="solar:layers-minimalistic-bold-duotone">
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-1.5">
              {navigatorTree.length === 0 && (
                <p className="px-2 py-4 text-center text-xs text-zinc-500">
                  No sections yet — use Add section above to start building.
                </p>
              )}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                {navigatorTree.length > 0 && (
                  <TreeLevel
                    nodes={navigatorTree}
                    depth={0}
                    parentKey={activePage.id}
                    selectedNodeId={selectedNodeId}
                    expanded={expanded}
                    onSelectNode={onSelectNode}
                    onToggleExpand={onToggleExpand}
                    onDeleteNode={onDeleteNode}
                    onToggleNodeVisibility={onToggleNodeVisibility}
                  />
                )}
              </DndContext>
            </div>
          </SectionBlock>
        </>
      )}
    </PanelChrome>
  )
}

export function getAllowedChildTypes(type: string): string[] {
  return getComponentType(type)?.allowedChildTypes ?? []
}
