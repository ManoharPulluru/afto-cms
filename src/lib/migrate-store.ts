import type { LayoutBlock, PageNode, StoreData, StorePage } from '@/lib/types/store'
import { getDefaultVariant } from '@/lib/registry'
import { getDefaultNodeProps } from '@/lib/resolve-props'
import { defaultHeaderChildren, ensureHeaderChildren } from '@/lib/header-children'
import { defaultHeroChildren, ensureHeroChildren } from '@/lib/hero-children'
import { defaultCartDrawerChildren, ensureCartDrawerChildren } from '@/lib/cart-drawer-children'

let nodeCounter = 0
function nid(prefix: string): string {
  nodeCounter += 1
  return `${prefix}-${nodeCounter}`
}

function normalizeHeaderVariant(node: PageNode, store: StoreData): PageNode {
  let variant = node.variant
  if (variant === 'Centered Logo') {
    variant = 'HeaderV3'
  } else if (variant === 'Classic Bar' || variant === 'Minimal Strip') {
    variant = 'HeaderV1'
  }
  let next = variant !== node.variant ? { ...node, variant } : node
  next = ensureHeaderChildren(next, store)
  if (next.children?.length) {
    return { ...next, children: next.children.map((c) => normalizeTreeNode(c, store)) }
  }
  return next
}

function normalizeTreeNode(node: PageNode, store: StoreData): PageNode {
  if (node.type === 'header') return normalizeHeaderVariant(node, store)
  if (node.type === 'hero') {
    const next = ensureHeroChildren(node, store)
    if (next.children?.length) {
      return { ...next, children: next.children.map((c) => normalizeTreeNode(c, store)) }
    }
    return next
  }
  if (node.type === 'cartDrawer') {
    const next = ensureCartDrawerChildren(node, store)
    if (next.children?.length) {
      return { ...next, children: next.children.map((c) => normalizeTreeNode(c, store)) }
    }
    return next
  }
  if (node.children?.length) {
    return { ...node, children: node.children.map((c) => normalizeTreeNode(c, store)) }
  }
  return node
}

function normalizePageTree(tree: PageNode[], store: StoreData): PageNode[] {
  const normalized = tree.map((n) => normalizeTreeNode(n, store))
  return ensureOverlaySectionsOnTree(normalized, store)
}

function headerNode(store: StoreData): PageNode {
  return {
    id: nid('header'),
    type: 'header',
    variant: 'HeaderV1',
    label: 'Grocery Nav Bar',
    props: getDefaultNodeProps('header', store),
    children: defaultHeaderChildren(store),
  }
}

function footerNode(): PageNode {
  return {
    id: nid('footer'),
    type: 'footer',
    variant: 'FooterV1',
    label: 'Footer',
  }
}

function cartDrawerNode(store: StoreData): PageNode {
  return ensureCartDrawerChildren(
    {
      id: nid('cartDrawer'),
      type: 'cartDrawer',
      variant: 'CartDrawerV1',
      label: 'Cart Drawer',
      props: getDefaultNodeProps('cartDrawer', store),
      children: defaultCartDrawerChildren(store),
    },
    store,
  )
}

function loginModalNode(store: StoreData): PageNode {
  return {
    id: nid('loginModal'),
    type: 'loginModal',
    variant: 'LoginModalV1',
    label: 'Login Modal',
    props: getDefaultNodeProps('loginModal', store),
    children: [],
  }
}

function insertBeforeFooter(tree: PageNode[], node: PageNode): PageNode[] {
  const footerIdx = tree.findIndex((n) => n.type === 'footer')
  if (footerIdx === -1) return [...tree, node]
  const next = [...tree]
  next.splice(footerIdx, 0, node)
  return next
}

/** Ensures login modal + cart drawer exist on every page (before footer). */
function ensureOverlaySectionsOnTree(tree: PageNode[], store: StoreData): PageNode[] {
  let next = tree
  if (!next.some((n) => n.type === 'loginModal')) {
    next = insertBeforeFooter(next, loginModalNode(store))
  }
  if (!next.some((n) => n.type === 'cartDrawer')) {
    next = insertBeforeFooter(next, cartDrawerNode(store))
  }
  return next
}

function layoutBlockToNode(block: LayoutBlock, store: StoreData): PageNode {
  switch (block.blockType) {
    case 'heroBanner':
      return ensureHeroChildren(
        {
          id: nid('hero'),
          type: 'hero',
          variant: 'HeroV1',
          label: 'Hero Media',
          props: {
            title: block.title,
            subtitle: block.subtitle,
            buttonText: block.buttonText,
            buttonLink: block.buttonLink,
            backgroundImage: block.backgroundImage,
          },
        },
        store,
      )
    case 'categoriesBlock':
      return {
        id: nid('categories'),
        type: 'categories',
        variant: 'CategoriesV1',
        label: 'Categories',
        props: { title: block.title, categoryIds: block.categoryIds },
      }
    case 'offersCarousel':
      return {
        id: nid('offers'),
        type: 'offers',
        variant: 'OffersV1',
        label: 'Offers Carousel',
        props: { title: block.title, slides: block.slides },
      }
    case 'productGrid':
      return {
        id: nid('products'),
        type: 'productSection',
        variant: 'ProductSectionV1',
        label: 'Product Template',
        props: { title: block.title, productCardVariant: 'ProductCardV4' },
        children: [],
      }
    case 'testimonials':
      return {
        id: nid('testimonials'),
        type: 'testimonials',
        variant: 'TestimonialsV1',
        label: 'Testimonials',
        props: { title: block.title, items: block.items },
      }
    case 'videoBanner':
      return ensureHeroChildren(
        {
          id: nid('hero'),
          type: 'hero',
          variant: 'HeroV1',
          label: 'Hero Media',
          props: { title: block.title, videoUrl: block.videoUrl },
        },
        store,
      )
    default:
      return {
        id: nid('unknown'),
        type: 'hero',
        variant: 'HeroV1',
        label: 'Section',
        props: {},
      }
  }
}

export function layoutToTree(layout: LayoutBlock[], store: StoreData): PageNode[] {
  nodeCounter = 0
  return [headerNode(store), ...layout.map((b) => layoutBlockToNode(b, store)), footerNode()]
}

export function createDefaultPageTree(pageId: string, store: StoreData): PageNode[] {
  nodeCounter = 0
  if (pageId === 'products') {
    return [
      headerNode(store),
      {
        id: nid('products'),
        type: 'productSection',
        variant: 'ProductSectionV1',
        label: 'Product Template',
        props: { title: 'All Products', productCardVariant: 'ProductCardV4' },
        children: [],
      },
      footerNode(),
    ]
  }
  if (pageId === 'orders') {
    return [
      headerNode(store),
      {
        id: nid('orders'),
        type: 'orders',
        variant: 'OrdersV1',
        label: 'Orders',
        props: { title: 'Your Orders' },
      },
      footerNode(),
    ]
  }
  return [headerNode(store), footerNode()]
}

export function normalizePageSlug(slug: string): string {
  if (!slug || slug === 'home') return '/'
  return slug.startsWith('/') ? slug : `/${slug}`
}

function isBlankCanvasStore(store: StoreData): boolean {
  return Boolean(store.store.blankCanvas)
}

export function migratePage(page: StorePage, store: StoreData): StorePage {
  const id = page.id || (page.slug === 'home' || page.slug === '/' ? 'home' : page.slug.replace(/^\//, ''))
  const slug = normalizePageSlug(page.slug)

  if (page.tree && page.tree.length > 0) {
    return { ...page, id, slug, tree: normalizePageTree(page.tree, store) }
  }

  if (page.layout && page.layout.length > 0) {
    return { ...page, id, slug, tree: layoutToTree(page.layout, store), layout: page.layout }
  }

  if (isBlankCanvasStore(store)) {
    return { ...page, id, slug, tree: [] }
  }

  return { ...page, id, slug, tree: createDefaultPageTree(id, store) }
}

const DEFAULT_PAGES: Omit<StorePage, 'tree' | 'layout'>[] = [
  { id: 'home', title: 'Home', slug: '/' },
  { id: 'products', title: 'Products', slug: '/products' },
  { id: 'orders', title: 'Orders', slug: '/orders' },
]

export function migrateStore(data: StoreData): StoreData {
  const blank = isBlankCanvasStore(data)
  let pages = data.pages.map((p) => migratePage(p, data))

  if (blank) {
    if (!pages.some((p) => p.id === 'home')) {
      pages.push({ id: 'home', title: 'Home', slug: '/', tree: [] })
    }
  } else {
    for (const def of DEFAULT_PAGES) {
      if (!pages.some((p) => p.id === def.id)) {
        pages.push({
          ...def,
          tree: createDefaultPageTree(def.id, data),
        })
      }
    }
  }

  pages = pages.map((p) => migratePage(p, data))

  return { ...data, pages }
}

export function createPage(title: string, slug: string): StorePage {
  const id = slug.replace(/^\//, '').replace(/\//g, '-') || 'page'
  return {
    id: `${id}-${Date.now()}`,
    title,
    slug: normalizePageSlug(slug),
    tree: [],
  }
}

export function createNode(type: string, label?: string, store?: StoreData): PageNode {
  const variant = getDefaultVariant(type)
  const props = store ? getDefaultNodeProps(type, store) : { ...(variant?.defaultProps ?? {}) }
  const node: PageNode = {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    variant: variant?.id ?? `${type}V1`,
    label: label ?? getDefaultVariant(type)?.label ?? type,
    props,
    children: [],
  }
  if (type === 'hero' && store) {
    return ensureHeroChildren({ ...node, label: label ?? 'Hero Media' }, store)
  }
  return node
}
