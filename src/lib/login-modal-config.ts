import type { PropField } from '@/lib/registry'

export const LOGIN_MODAL_VARIANTS = [
  { id: 'LoginModalV1', label: 'Warm Card (OTP)' },
  { id: 'LoginModalV2', label: 'Dark Glass (OTP)' },
  { id: 'LoginModalV3', label: 'Split Brand (OTP)' },
] as const

export type LoginModalVariantId = (typeof LOGIN_MODAL_VARIANTS)[number]['id']

export const LOGIN_MODAL_SECTION_FIELDS: PropField[] = [
  { key: 'enabled', label: 'Show login modal', type: 'boolean' },
  {
    key: 'displayAsOverlay',
    label: 'Full-screen overlay',
    type: 'boolean',
  },
  { key: 'modalTitle', label: 'Title', type: 'text' },
  { key: 'modalSubtitle', label: 'Subtitle', type: 'text' },
  { key: 'otpButtonLabel', label: 'OTP button label', type: 'text' },
  { key: 'mobilePlaceholder', label: 'Mobile placeholder', type: 'text' },
]

export const LOGIN_MODAL_SECTION_DEFAULTS = {
  enabled: true,
  displayAsOverlay: true,
  modalTitle: 'Welcome Back',
  modalSubtitle: 'Sign in to access your account',
  otpButtonLabel: 'Get OTP',
  mobilePlaceholder: '98765 43210',
}
