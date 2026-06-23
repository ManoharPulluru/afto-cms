import type { CSSProperties } from 'react'
import type { StoreInfo } from '@/lib/types/store'

export type TenantTheme = {
  primaryColor: string
  secondaryColor: string
}

export function getStoreTheme(store: StoreInfo): TenantTheme {
  return {
    primaryColor: store.primaryColor || '#000000',
    secondaryColor: store.secondaryColor || '#FFFFFF',
  }
}

export function themeToCssVariables(theme: TenantTheme): CSSProperties {
  return {
    '--color-primary': theme.primaryColor,
    '--color-secondary': theme.secondaryColor,
  } as CSSProperties
}

export function getContrastTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
