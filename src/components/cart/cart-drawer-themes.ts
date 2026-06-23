import type { CartDrawerTheme } from '@/components/cart/types'

export function getWarmCartTheme(accent: string): CartDrawerTheme {
  return {
    accent,
    background: '#ffffff',
    text: '#0f1419',
    muted: '#64748b',
    border: '#e2e8f0',
    surface: '#f8fafc',
    stepInactiveBg: '#f1f5f9',
    stepInactiveText: '#94a3b8',
    success: '#15803d',
    successBg: '#dcfce7',
    successBorder: '#86efac',
    footerBg: '#ffffff',
  }
}

export function getDarkCartTheme(accent: string): CartDrawerTheme {
  return {
    accent,
    background: '#1a1d24',
    text: '#f8f9fb',
    muted: 'rgba(248, 249, 251, 0.72)',
    border: 'rgba(248, 249, 251, 0.14)',
    surface: '#252932',
    stepInactiveBg: '#2d323c',
    stepInactiveText: 'rgba(248, 249, 251, 0.5)',
    success: accent,
    successBg: `${accent}22`,
    successBorder: `${accent}55`,
    footerBg: '#1e2129',
  }
}

export function getMinimalCartTheme(accent: string): CartDrawerTheme {
  return {
    accent,
    background: '#ffffff',
    text: '#111827',
    muted: '#6b7280',
    border: '#e5e7eb',
    surface: '#f9fafb',
    stepInactiveBg: '#f3f4f6',
    stepInactiveText: '#9ca3af',
    success: '#059669',
    successBg: '#ecfdf5',
    successBorder: '#a7f3d0',
    footerBg: '#ffffff',
  }
}
