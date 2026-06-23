/**
 * All backend API functions live here.
 * HTTP transport: http.service.ts
 */
import { HttpServiceError, post } from '@/lib/http.service'

/** Standard Afto API envelope */
export type AftoApiResponse<TEntity> = {
  message: string
  status: boolean
  entity: TEntity
}

// ─── Customer OTP ───────────────────────────────────────────────────────────

export type SendSmsOtpRequest = {
  phoneNumber: string
  businessAccountId: string
}

export type SendSmsOtpEntity = {
  customerId: string
}

export type VerifySmsOtpRequest = {
  otp: string
  customerId: string
  phoneNumber: string
  businessAccountId: string
}

export type VerifySmsOtpEntity = {
  customerId: string
  accessToken: string
  refreshToken: string
}

export function getBusinessAccountId(): string {
  return (
    process.env.NEXT_PUBLIC_BUSINESS_ACCOUNT_ID ??
    process.env.NEXT_PUBLIC_BUSINESS_ID ??
    process.env.BUSINESS_ID ??
    ''
  )
}

/** Combine dial code + local digits → E.164 e.g. +916303411409 */
export function formatPhoneNumber(dialCode: string, mobile: string): string {
  const dial = dialCode.startsWith('+') ? dialCode : `+${dialCode}`
  const digits = mobile.replace(/\D/g, '')
  return `${dial}${digits}`
}

export async function sendSmsOtp(
  phoneNumber: string,
  businessAccountId?: string,
): Promise<AftoApiResponse<SendSmsOtpEntity>> {
  const businessId = businessAccountId || getBusinessAccountId()
  if (!businessId) {
    throw new Error('businessAccountId is not configured')
  }

  const data = await post<AftoApiResponse<SendSmsOtpEntity>, SendSmsOtpRequest>(
    '/customer/send-sms-otp',
    { phoneNumber, businessAccountId: businessId },
  )

  if (!data.status) {
    throw new HttpServiceError(data.message || 'Failed to send OTP', 400, data)
  }

  return data
}

export async function verifySmsOtp(
  payload: VerifySmsOtpRequest,
): Promise<AftoApiResponse<VerifySmsOtpEntity>> {
  const businessAccountId = payload.businessAccountId || getBusinessAccountId()
  if (!businessAccountId) {
    throw new Error('businessAccountId is not configured')
  }

  const data = await post<AftoApiResponse<VerifySmsOtpEntity>, VerifySmsOtpRequest>(
    '/customer/verify-sms-otp',
    { ...payload, businessAccountId },
  )

  if (!data.status) {
    throw new HttpServiceError(data.message || 'OTP verification failed', 400, data)
  }

  return data
}

// ─── Customer token refresh ─────────────────────────────────────────────────

export type RefreshCustomerTokenRequest = {
  refreshToken: string
}

export type RefreshCustomerTokenEntity = {
  accessToken: string
  refreshToken?: string
  customerId?: string
}

export async function refreshCustomerToken(
  refreshToken: string,
): Promise<AftoApiResponse<RefreshCustomerTokenEntity>> {
  const data = await post<AftoApiResponse<RefreshCustomerTokenEntity>, RefreshCustomerTokenRequest>(
    '/customer/refresh-token',
    { refreshToken },
  )

  if (!data.status) {
    throw new HttpServiceError(data.message || 'Token refresh failed', 401, data)
  }

  return data
}
