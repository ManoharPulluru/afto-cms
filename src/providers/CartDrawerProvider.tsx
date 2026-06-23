'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartDrawerConfig } from '@/components/cart/types'
import type { CartDrawerVariantId } from '@/lib/cart-drawer-config'
import { CART_DRAWER_SECTION_DEFAULTS } from '@/lib/cart-drawer-config'
import { buildCartDrawerConfig } from '@/lib/resolve-cart-drawer-parts'
import { getStudioPreviewStepForCartChild } from '@/lib/cart-drawer-variant-config'
import type { PageNode, StoreData } from '@/lib/types/store'

export type RegisteredCartDrawer = {
  variantId: CartDrawerVariantId
  config: CartDrawerConfig
}

type StudioCartPreviewState = {
  active: boolean
  highlightPart: string | null
}

type CartDrawerContextValue = {
  isOpen: boolean
  hasCartDrawer: boolean
  registeredDrawer: RegisteredCartDrawer
  studioPreview: StudioCartPreviewState
  studioPreviewStep: number
  openCartDrawer: () => void
  closeCartDrawer: () => void
  registerCartDrawer: (drawer: RegisteredCartDrawer) => void
  unregisterCartDrawer: () => void
  setStudioCartPreview: (state: StudioCartPreviewState) => void
  setStudioPreviewStep: (step: number) => void
}

const CartDrawerContext = createContext<CartDrawerContextValue | null>(null)

export function findCartDrawerInTree(
  tree: PageNode[] | undefined,
  store: StoreData,
): RegisteredCartDrawer | null {
  if (!tree) return null
  for (const node of tree) {
    if (node.type !== 'cartDrawer') continue
    if (node.props?.enabled === false) continue
    return buildRegisteredDrawer(node.variant, node.props ?? {}, store, node.children)
  }
  return null
}

function findCartDrawerInStore(store: StoreData | undefined): RegisteredCartDrawer | null {
  if (!store) return null
  for (const page of store.pages) {
    const found = findCartDrawerInTree(page.tree, store)
    if (found) return found
  }
  return null
}

export function buildRegisteredDrawer(
  variantId: string,
  props: Record<string, unknown>,
  store: StoreData,
  childNodes?: PageNode[],
): RegisteredCartDrawer {
  const variant = (variantId as CartDrawerVariantId) || 'CartDrawerV1'
  const config = buildCartDrawerConfig(variant, props, childNodes, store)

  return {
    variantId: variant,
    config,
  }
}

function defaultRegisteredDrawer(store: StoreData): RegisteredCartDrawer {
  const fromStore = findCartDrawerInStore(store)
  if (fromStore) return fromStore
  return buildRegisteredDrawer('CartDrawerV1', CART_DRAWER_SECTION_DEFAULTS, store)
}

type CartDrawerProviderProps = {
  store: StoreData
  pageTree?: PageNode[]
  children: ReactNode
}

export function CartDrawerProvider({ store, pageTree, children }: CartDrawerProviderProps) {
  const drawerFromPageTree = useMemo(
    () => findCartDrawerInTree(pageTree, store) ?? findCartDrawerInStore(store),
    [pageTree, store],
  )

  const [isOpen, setIsOpen] = useState(false)
  const [hasCartDrawer, setHasCartDrawer] = useState(() => Boolean(drawerFromPageTree))
  const [registeredDrawer, setRegisteredDrawer] = useState<RegisteredCartDrawer>(
    () => drawerFromPageTree ?? defaultRegisteredDrawer(store),
  )
  const [studioPreview, setStudioPreview] = useState<StudioCartPreviewState>({
    active: false,
    highlightPart: null,
  })
  const [studioPreviewStep, setStudioPreviewStep] = useState(0)

  useEffect(() => {
    if (drawerFromPageTree) {
      setHasCartDrawer(true)
      setRegisteredDrawer(drawerFromPageTree)
    }
  }, [drawerFromPageTree])

  const openCartDrawer = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeCartDrawer = useCallback(() => setIsOpen(false), [])

  const registerCartDrawer = useCallback((drawer: RegisteredCartDrawer) => {
    setRegisteredDrawer(drawer)
    setHasCartDrawer(true)
  }, [])

  const unregisterCartDrawer = useCallback(() => {
    setIsOpen(false)
    setStudioPreview({ active: false, highlightPart: null })
  }, [])

  const setStudioCartPreview = useCallback((state: StudioCartPreviewState) => {
    setStudioPreview(state)
    if (state.active) {
      setStudioPreviewStep(getStudioPreviewStepForCartChild(state.highlightPart))
    }
  }, [])

  const value = useMemo<CartDrawerContextValue>(
    () => ({
      isOpen,
      hasCartDrawer,
      registeredDrawer,
      studioPreview,
      studioPreviewStep,
      openCartDrawer,
      closeCartDrawer,
      registerCartDrawer,
      unregisterCartDrawer,
      setStudioCartPreview,
      setStudioPreviewStep,
    }),
    [
      isOpen,
      hasCartDrawer,
      registeredDrawer,
      studioPreview,
      studioPreviewStep,
      openCartDrawer,
      closeCartDrawer,
      registerCartDrawer,
      unregisterCartDrawer,
      setStudioCartPreview,
    ],
  )

  return (
    <CartDrawerContext.Provider value={value}>{children}</CartDrawerContext.Provider>
  )
}

export function useCartDrawer() {
  const ctx = useContext(CartDrawerContext)
  if (!ctx) throw new Error('useCartDrawer must be used within CartDrawerProvider')
  return ctx
}

export function useCartDrawerOptional() {
  return useContext(CartDrawerContext)
}
