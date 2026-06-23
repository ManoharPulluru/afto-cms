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
import { useRouter } from 'next/navigation'
import { getBusinessAccountId } from '@/lib/api'
import {
  clearCustomerSession,
  loadCustomerSession,
  type CustomerSession,
} from '@/lib/customer-session'
import { clearActiveOrderId } from '@/lib/order-session'
import { startCustomerTokenRefreshLoop } from '@/lib/customer-token-refresh'
import type { LoginModalConfig } from '@/components/auth/login-modal/types'
import type { LoginModalVariantId } from '@/lib/login-modal-config'
import { LOGIN_MODAL_SECTION_DEFAULTS } from '@/lib/login-modal-config'
import type { StoreData } from '@/lib/types/store'
import { LoginModalOverlay } from '@/components/auth/login-modal/LoginModalOverlay'

export type RegisteredLoginModal = {
  variantId: LoginModalVariantId
  config: LoginModalConfig
}

type CustomerAuthContextValue = {
  session: CustomerSession | null
  isLoggedIn: boolean
  phoneNumber: string | null
  isModalOpen: boolean
  /** True when the current page has an enabled login modal section */
  hasLoginModal: boolean
  registeredModal: RegisteredLoginModal
  openLoginModal: () => void
  closeLoginModal: () => void
  logout: () => void
  onLoginSuccess: () => void
  registerLoginModal: (modal: RegisteredLoginModal) => void
  unregisterLoginModal: () => void
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null)

function findLoginModalInStore(store: StoreData | undefined): RegisteredLoginModal | null {
  if (!store) return null
  for (const page of store.pages) {
    for (const node of page.tree ?? []) {
      if (node.type !== 'loginModal') continue
      const accent = store.store.primaryColor ?? '#F97316'
      return {
        variantId: (node.variant as LoginModalVariantId) || 'LoginModalV1',
        config: {
          variant: (node.variant as LoginModalVariantId) || 'LoginModalV1',
          title: String(node.props?.modalTitle ?? 'Welcome Back'),
          subtitle: String(node.props?.modalSubtitle ?? 'Sign in to access your account'),
          accentColor: String(node.props?.accentColor ?? accent),
          otpButtonLabel: String(node.props?.otpButtonLabel ?? 'Get OTP'),
          mobilePlaceholder: String(node.props?.mobilePlaceholder ?? '98765 43210'),
          storeName: store.store.name,
          logoUrl: store.store.logo,
        },
      }
    }
  }
  return null
}

function defaultRegisteredModal(store: StoreData | undefined): RegisteredLoginModal {
  const fromStore = findLoginModalInStore(store)
  if (fromStore) return fromStore
  const accent = store?.store.primaryColor ?? '#F97316'
  return {
    variantId: 'LoginModalV1',
    config: {
      variant: 'LoginModalV1',
      title: LOGIN_MODAL_SECTION_DEFAULTS.modalTitle,
      subtitle: LOGIN_MODAL_SECTION_DEFAULTS.modalSubtitle,
      accentColor: accent,
      otpButtonLabel: LOGIN_MODAL_SECTION_DEFAULTS.otpButtonLabel,
      mobilePlaceholder: LOGIN_MODAL_SECTION_DEFAULTS.mobilePlaceholder,
      storeName: store?.store.name,
      logoUrl: store?.store.logo,
    },
  }
}

type CustomerAuthProviderProps = {
  children: ReactNode
  store?: StoreData
  businessAccountId?: string
}

export function CustomerAuthProvider({
  children,
  store,
  businessAccountId: businessAccountIdProp,
}: CustomerAuthProviderProps) {
  const router = useRouter()
  const businessAccountId = businessAccountIdProp ?? getBusinessAccountId()
  const [session, setSession] = useState<CustomerSession | null>(() =>
    typeof window !== 'undefined' ? loadCustomerSession(businessAccountIdProp ?? getBusinessAccountId()) : null,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasLoginModal, setHasLoginModal] = useState(() => Boolean(findLoginModalInStore(store)))
  const [registeredModal, setRegisteredModal] = useState<RegisteredLoginModal>(() =>
    defaultRegisteredModal(store),
  )

  useEffect(() => {
    setRegisteredModal(defaultRegisteredModal(store))
    setHasLoginModal(Boolean(findLoginModalInStore(store)))
  }, [store])

  useEffect(() => {
    setSession(loadCustomerSession(businessAccountId))
  }, [businessAccountId])

  // Refresh access token before JWT expiry
  useEffect(() => {
    if (!session?.accessToken || !session.refreshToken) return

    return startCustomerTokenRefreshLoop(businessAccountId, {
      onUpdated: (updated) => setSession(updated),
      onExpired: () => {
        clearCustomerSession(businessAccountId)
        clearActiveOrderId(businessAccountId)
        setSession(null)
        setIsModalOpen(false)
      },
    })
  }, [businessAccountId, session?.accessToken, session?.refreshToken])

  const refreshSession = useCallback(() => {
    setSession(loadCustomerSession(businessAccountId))
  }, [businessAccountId])

  const openLoginModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])
  const closeLoginModal = useCallback(() => setIsModalOpen(false), [])

  const logout = useCallback(() => {
    clearCustomerSession(businessAccountId)
    clearActiveOrderId(businessAccountId)
    setSession(null)
    setIsModalOpen(false)
  }, [businessAccountId])

  const onLoginSuccess = useCallback(() => {
    refreshSession()
    setIsModalOpen(false)
    router.push('/')
  }, [refreshSession, router])

  const registerLoginModal = useCallback((modal: RegisteredLoginModal) => {
    setRegisteredModal(modal)
    setHasLoginModal(true)
  }, [])

  const unregisterLoginModal = useCallback(() => {
    setHasLoginModal(false)
    setIsModalOpen(false)
  }, [])

  const value = useMemo<CustomerAuthContextValue>(
    () => ({
      session,
      isLoggedIn: Boolean(session?.accessToken),
      phoneNumber: session?.phoneNumber ?? null,
      isModalOpen,
      hasLoginModal,
      registeredModal,
      openLoginModal,
      closeLoginModal,
      logout,
      onLoginSuccess,
      registerLoginModal,
      unregisterLoginModal,
    }),
    [
      session,
      isModalOpen,
      hasLoginModal,
      registeredModal,
      openLoginModal,
      closeLoginModal,
      logout,
      onLoginSuccess,
      registerLoginModal,
      unregisterLoginModal,
    ],
  )

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
      {isModalOpen && (
        <LoginModalOverlay
          variant={registeredModal.variantId}
          config={registeredModal.config}
          onClose={closeLoginModal}
          onSuccess={onLoginSuccess}
        />
      )}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth(): CustomerAuthContextValue {
  const ctx = useContext(CustomerAuthContext)
  if (!ctx) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider')
  }
  return ctx
}

/** Safe for header parts that may render in builder without provider */
export function useCustomerAuthOptional(): CustomerAuthContextValue | null {
  return useContext(CustomerAuthContext)
}
