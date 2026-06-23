'use client'

import { useCustomerAuthOptional } from '@/providers/CustomerAuthProvider'

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length <= 4) return phone
  return `•••• ${digits.slice(-4)}`
}

/** Merges CMS account props with live customer session from localStorage */
export function useHeaderAccountState(props: Record<string, unknown>) {
  const auth = useCustomerAuthOptional()
  const isLoggedIn = auth?.isLoggedIn ?? Boolean(props.isLoggedIn)
  const phoneNumber = auth?.phoneNumber ?? null
  const displayPhone = phoneNumber ? maskPhone(phoneNumber) : ''
  const userName =
    isLoggedIn && displayPhone
      ? displayPhone
      : ((props.userName as string) || '')
  const userEmail =
    isLoggedIn && phoneNumber
      ? phoneNumber
      : ((props.userEmail as string) || '')

  const openLogin = () => {
    if (auth?.hasLoginModal) auth.openLoginModal()
  }

  return { isLoggedIn, userName, userEmail, phoneNumber, openLogin }
}
