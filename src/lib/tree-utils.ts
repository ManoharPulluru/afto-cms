import type { PageNode, StorePage } from '@/lib/types/store'
import { getComponentType } from '@/lib/registry'

export type TreePath = number[]

export function findNodeById(nodes: PageNode[], nodeId: string): { node: PageNode; path: TreePath; parent: PageNode[] } | null {
  function walk(list: PageNode[], path: TreePath): { node: PageNode; path: TreePath; parent: PageNode[] } | null {
    for (let i = 0; i < list.length; i++) {
      const node = list[i]
      if (node.id === nodeId) return { node, path: [...path, i], parent: list }
      if (node.children?.length) {
        const found = walk(node.children, [...path, i])
        if (found) return found
      }
    }
    return null
  }
  return walk(nodes, [])
}

export function findNodeInPage(page: StorePage, nodeId: string) {
  if (!page.tree) return null
  return findNodeById(page.tree, nodeId)
}

/** Direct parent node in the tree, or null if the node is at the root. */
export function findParentNode(nodes: PageNode[], nodeId: string): PageNode | null {
  for (const node of nodes) {
    if (node.children?.some((child) => child.id === nodeId)) return node
    if (node.children?.length) {
      const found = findParentNode(node.children, nodeId)
      if (found) return found
    }
  }
  return null
}

/** Section whose variants should stay visible when a child component is selected. */
export function getSectionVariantNode(node: PageNode, tree: PageNode[]): PageNode {
  const parent = findParentNode(tree, node.id)
  if (parent && getComponentType(parent.type)?.category === 'section') {
    return parent
  }
  return node
}

export function updateNodeInTree(
  nodes: PageNode[],
  nodeId: string,
  updater: (node: PageNode) => PageNode,
): PageNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) return updater(node)
    if (node.children) {
      return { ...node, children: updateNodeInTree(node.children, nodeId, updater) }
    }
    return node
  })
}

export function removeNodeFromTree(nodes: PageNode[], nodeId: string): PageNode[] {
  return nodes
    .filter((n) => n.id !== nodeId)
    .map((n) => ({
      ...n,
      children: n.children ? removeNodeFromTree(n.children, nodeId) : undefined,
    }))
}

export function insertNodeInTree(
  nodes: PageNode[],
  parentId: string | null,
  node: PageNode,
  index?: number,
): PageNode[] {
  if (parentId === null) {
    const next = [...nodes]
    next.splice(index ?? next.length, 0, node)
    return next
  }

  return nodes.map((n) => {
    if (n.id === parentId) {
      const children = [...(n.children ?? [])]
      children.splice(index ?? children.length, 0, node)
      return { ...n, children }
    }
    if (n.children) {
      return { ...n, children: insertNodeInTree(n.children, parentId, node, index) }
    }
    return n
  })
}

export function reorderSiblings(nodes: PageNode[], parentId: string | null, activeId: string, overId: string): PageNode[] {
  const reorder = (list: PageNode[]) => {
    const oldIndex = list.findIndex((n) => n.id === activeId)
    const newIndex = list.findIndex((n) => n.id === overId)
    if (oldIndex === -1 || newIndex === -1) return list
    const next = [...list]
    const [removed] = next.splice(oldIndex, 1)
    next.splice(newIndex, 0, removed)
    return next
  }

  if (parentId === null) return reorder(nodes)

  return nodes.map((n) => {
    if (n.id === parentId && n.children) {
      return { ...n, children: reorder(n.children) }
    }
    if (n.children) {
      return { ...n, children: reorderSiblings(n.children, parentId, activeId, overId) }
    }
    return n
  })
}

export function flattenTree(nodes: PageNode[], depth = 0, parentId: string | null = null): Array<{
  node: PageNode
  depth: number
  parentId: string | null
}> {
  const result: Array<{ node: PageNode; depth: number; parentId: string | null }> = []
  for (const node of nodes) {
    result.push({ node, depth, parentId })
    if (node.children?.length) {
      result.push(...flattenTree(node.children, depth + 1, node.id))
    }
  }
  return result
}

export function getNodeLabel(node: PageNode): string {
  if (node.label) return node.label
  const typeConfig = getComponentType(node.type)
  const variant = typeConfig?.variants.find((v) => v.id === node.variant)
  return variant?.label ?? typeConfig?.label ?? node.type
}

export function pagePathToSlug(path: string): string {
  if (!path || path === '/') return '/'
  return path.startsWith('/') ? path : `/${path}`
}

export function slugToUrl(slug: string): string {
  return slug === '/' ? '/' : slug
}

export function findPageByPath(pages: StorePage[], path: string): StorePage | undefined {
  const normalized = pagePathToSlug(path === 'home' ? '/' : path)
  return pages.find(
    (p) =>
      p.slug === normalized ||
      p.slug === path ||
      p.id === path.replace(/^\//, '') ||
      (normalized === '/' && (p.id === 'home' || p.slug === 'home')),
  )
}

export function findPageById(pages: StorePage[], pageId: string): StorePage | undefined {
  return pages.find((p) => p.id === pageId)
}

export function getNodeAncestorExpandKeys(
  pageId: string,
  nodes: PageNode[],
  nodeId: string,
  parentKey = pageId,
): string[] | null {
  for (const node of nodes) {
    const key = `${parentKey}:${node.id}`
    if (node.id === nodeId) return []
    if (node.children?.length) {
      const childPath = getNodeAncestorExpandKeys(pageId, node.children, nodeId, key)
      if (childPath !== null) return [key, ...childPath]
    }
  }
  return null
}

export function nodeContainsId(node: PageNode, nodeId: string): boolean {
  if (node.id === nodeId) return true
  return node.children?.some((child) => nodeContainsId(child, nodeId)) ?? false
}

/** Root-level index for a node or any of its descendants. */
export function findTopLevelSectionIndex(tree: PageNode[], nodeId: string): number {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === nodeId) return i
    if (nodeContainsId(tree[i], nodeId)) return i
  }
  return -1
}

/** Where to insert a new page section (before footer when present). */
export function getSectionInsertIndex(tree: PageNode[], relativeToNodeId: string | null): number {
  const footerIdx = tree.findIndex((n) => n.type === 'footer')
  const endIndex = footerIdx === -1 ? tree.length : footerIdx

  if (!relativeToNodeId) return endIndex

  const topIdx = findTopLevelSectionIndex(tree, relativeToNodeId)
  if (topIdx === -1) return endIndex

  const insertAt = topIdx + 1
  if (footerIdx !== -1 && insertAt > footerIdx) return footerIdx
  return insertAt
}

/** Insert index for header (top) or footer (bottom); other types use getSectionInsertIndex. */
export function getAddSectionInsertIndex(
  tree: PageNode[],
  sectionType: string,
  relativeToNodeId: string | null,
): number {
  if (sectionType === 'header') return 0
  if (sectionType === 'footer') return tree.length
  return getSectionInsertIndex(tree, relativeToNodeId)
}

export function pageHasSectionType(tree: PageNode[], sectionType: string): boolean {
  return tree.some((n) => n.type === sectionType)
}

export function canDeleteNode(node: PageNode, depth = 0): boolean {
  if (depth > 0) return false
  if (node.type === 'header') return false
  const category = getComponentType(node.type)?.category
  return category === 'section' || category === 'component'
}

export function canToggleNodeVisibility(depth: number): boolean {
  return depth > 0
}

export function isNodeVisibleInTree(node: PageNode): boolean {
  return node.props?.visible !== false
}

export function isNodeDraggable(node: PageNode): boolean {
  return node.type !== 'header' && node.type !== 'footer'
}

export function canReorderSiblings(
  tree: PageNode[],
  parentId: string | null,
  activeId: string,
  overId: string,
): boolean {
  if (parentId !== null) return true

  const active = findNodeById(tree, activeId)
  const over = findNodeById(tree, overId)
  if (!active || !over) return false

  const locked = new Set(['header', 'footer'])
  if (locked.has(active.node.type) || locked.has(over.node.type)) return false
  return true
}

export function getSiblingList(nodes: PageNode[], nodeId: string): { list: PageNode[]; parentId: string | null } | null {
  const rootIdx = nodes.findIndex((n) => n.id === nodeId)
  if (rootIdx !== -1) return { list: nodes, parentId: null }

  function walk(list: PageNode[], parentId: string | null): { list: PageNode[]; parentId: string | null } | null {
    for (const node of list) {
      if (node.children?.some((c) => c.id === nodeId)) {
        return { list: node.children!, parentId: node.id }
      }
      if (node.children) {
        const found = walk(node.children, node.id)
        if (found) return found
      }
    }
    return null
  }

  return walk(nodes, null)
}
