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
import { getBusinessAccountId } from '@/lib/api'
import {
  addOrderItems,
  createOrder,
  deleteOrderItem,
  fetchOrder,
  OrderNotFoundError,
  updateOrderItemQuantity,
} from '@/lib/orders-client-api'
import {
  clearActiveOrderId,
  loadActiveOrderId,
  saveActiveOrderId,
} from '@/lib/order-session'
import type { Order } from '@/lib/types/order'
import { useCustomerAuthOptional } from '@/providers/CustomerAuthProvider'
import { useCartDrawerOptional } from '@/providers/CartDrawerProvider'

type OrderCartContextValue = {
  order: Order | null
  isLoading: boolean
  isMutating: boolean
  itemCount: number
  orderTotal: number
  addToCart: (productRetailerId: string, quantity?: number) => Promise<void>
  refreshOrder: () => Promise<void>
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
}

const OrderCartContext = createContext<OrderCartContextValue | null>(null)

type OrderCartProviderProps = {
  children: ReactNode
}

export function OrderCartProvider({ children }: OrderCartProviderProps) {
  const auth = useCustomerAuthOptional()
  const cartDrawer = useCartDrawerOptional()
  const businessAccountId = getBusinessAccountId()
  const isLoggedIn = auth?.isLoggedIn ?? false

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMutating, setIsMutating] = useState(false)

  const refreshOrder = useCallback(async () => {
    if (!isLoggedIn) {
      setOrder(null)
      return
    }
    const orderId = loadActiveOrderId(businessAccountId)
    if (!orderId) {
      setOrder(null)
      return
    }
    setIsLoading(true)
    try {
      const next = await fetchOrder(orderId)
      setOrder(next)
      saveActiveOrderId(businessAccountId, next.id)
    } catch (err) {
      if (err instanceof OrderNotFoundError) {
        clearActiveOrderId(businessAccountId)
        setOrder(null)
      } else {
        console.error('refreshOrder failed:', err)
      }
    } finally {
      setIsLoading(false)
    }
  }, [businessAccountId, isLoggedIn])

  useEffect(() => {
    if (isLoggedIn) {
      void refreshOrder()
    } else {
      setOrder(null)
    }
  }, [isLoggedIn, businessAccountId, refreshOrder])

  useEffect(() => {
    if (!cartDrawer?.isOpen || !isLoggedIn) return
    void refreshOrder()
  }, [cartDrawer?.isOpen, isLoggedIn, refreshOrder])

  const addToCart = useCallback(
    async (productRetailerId: string, quantity = 1) => {
      if (!isLoggedIn) {
        auth?.openLoginModal()
        return
      }

      const payload = {
        product_retailer_id: productRetailerId,
        quantity,
        applied_template: [] as unknown[],
      }

      setIsMutating(true)
      try {
        let orderId = loadActiveOrderId(businessAccountId)

        if (!orderId) {
          const created = await createOrder([payload])
          orderId = created.id
          saveActiveOrderId(businessAccountId, orderId)
        } else {
          try {
            await addOrderItems(orderId, [payload])
          } catch {
            const created = await createOrder([payload])
            orderId = created.id
            saveActiveOrderId(businessAccountId, orderId)
          }
        }

        const nextOrder = await fetchOrder(orderId)
        setOrder(nextOrder)
        cartDrawer?.openCartDrawer()
      } catch (err) {
        console.error('addToCart failed:', err)
      } finally {
        setIsMutating(false)
      }
    },
    [auth, businessAccountId, cartDrawer, isLoggedIn],
  )

  const updateItemQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      const orderId = order?.id ?? loadActiveOrderId(businessAccountId)
      if (!orderId || quantity < 1) return

      setIsMutating(true)
      try {
        await updateOrderItemQuantity(orderId, itemId, quantity)
        const next = await fetchOrder(orderId)
        setOrder(next)
      } catch (err) {
        console.error('updateItemQuantity failed:', err)
        await refreshOrder()
      } finally {
        setIsMutating(false)
      }
    },
    [businessAccountId, order?.id, refreshOrder],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      setIsMutating(true)
      try {
        await deleteOrderItem(itemId)
        const orderId = loadActiveOrderId(businessAccountId)
        if (!orderId) {
          setOrder(null)
          return
        }
        const next = await fetchOrder(orderId)
        setOrder(next.items.length === 0 ? null : next)
        if (next.items.length === 0) clearActiveOrderId(businessAccountId)
      } catch (err) {
        console.error('removeItem failed:', err)
      } finally {
        setIsMutating(false)
      }
    },
    [businessAccountId, refreshOrder],
  )

  const itemCount = useMemo(
    () => order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [order],
  )

  const value = useMemo<OrderCartContextValue>(
    () => ({
      order,
      isLoading,
      isMutating,
      itemCount,
      orderTotal: order?.total ?? 0,
      addToCart,
      refreshOrder,
      updateItemQuantity,
      removeItem,
    }),
    [
      order,
      isLoading,
      isMutating,
      itemCount,
      addToCart,
      refreshOrder,
      updateItemQuantity,
      removeItem,
    ],
  )

  return <OrderCartContext.Provider value={value}>{children}</OrderCartContext.Provider>
}

export function useOrderCart() {
  const ctx = useContext(OrderCartContext)
  if (!ctx) throw new Error('useOrderCart must be used within OrderCartProvider')
  return ctx
}

export function useOrderCartOptional() {
  return useContext(OrderCartContext)
}
