'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { StoreData } from '@/lib/types/store'
import { getStoreTheme, themeToCssVariables, type TenantTheme } from '@/lib/theme'

type StoreContextValue = {
  store: StoreData
  theme: TenantTheme
}

const StoreContext = createContext<StoreContextValue | null>(null)

type ThemeProviderProps = {
  store: StoreData
  children: ReactNode
}

export function ThemeProvider({ store, children }: ThemeProviderProps) {
  const theme = getStoreTheme(store.store)

  return (
    <StoreContext.Provider value={{ store, theme }}>
      <div
        style={themeToCssVariables(theme)}
        className="flex min-h-screen min-w-0 flex-col overflow-x-hidden overflow-y-auto scrollbar-none"
      >
        {children}
      </div>
    </StoreContext.Provider>
  )
}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within ThemeProvider')
  }
  return context
}

export function useTheme(): TenantTheme {
  return useStore().theme
}

/** @deprecated Use useStore */
export function useTenant() {
  const { store, theme } = useStore()
  return { tenant: store.store, theme }
}
