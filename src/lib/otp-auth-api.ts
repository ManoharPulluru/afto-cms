/**
 * Adapter used by useOtpLogin — delegates to api.ts (single integration point).
 */
import {
  formatPhoneNumber,
  getBusinessAccountId,
  sendSmsOtp,
  verifySmsOtp,
} from '@/lib/api'
import { saveCustomerSession } from '@/lib/customer-session'
import { HttpServiceError } from '@/lib/http.service'

export type RequestOtpPayload = {
  dialCode: string
  mobile: string
  businessAccountId?: string
}

export type RequestOtpResult = {
  success: boolean
  message?: string
  customerId?: string
}

export type VerifyOtpPayload = {
  dialCode: string
  mobile: string
  otp: string
  customerId?: string
  businessAccountId?: string
}

export type VerifyOtpResult = {
  success: boolean
  message?: string
  accessToken?: string
  refreshToken?: string
  customerId?: string
  phoneNumber?: string
}

export async function requestOtp(payload: RequestOtpPayload): Promise<RequestOtpResult> {
  try {
    const businessAccountId = payload.businessAccountId || getBusinessAccountId()
    const phoneNumber = formatPhoneNumber(payload.dialCode, payload.mobile)
    const data = await sendSmsOtp(phoneNumber, businessAccountId)

    return {
      success: true,
      message: data.message,
      customerId: data.entity.customerId,
    }
  } catch (err) {
    const message =
      err instanceof HttpServiceError ? err.message : 'Could not send OTP. Please try again.'
    return { success: false, message }
  }
}

export async function verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResult> {
  try {
    const businessAccountId = payload.businessAccountId || getBusinessAccountId()
    const phoneNumber = formatPhoneNumber(payload.dialCode, payload.mobile)

    if (!payload.customerId) {
      return { success: false, message: 'Missing customer session. Request OTP again.' }
    }

    const data = await verifySmsOtp({
      otp: payload.otp,
      customerId: payload.customerId,
      phoneNumber,
      businessAccountId,
    })

    const { customerId, accessToken, refreshToken } = data.entity

    saveCustomerSession({
      customerId,
      phoneNumber,
      businessAccountId,
      accessToken,
      refreshToken,
    })

    return {
      success: true,
      message: data.message,
      accessToken,
      refreshToken,
      customerId,
      phoneNumber,
    }
  } catch (err) {
    const message =
      err instanceof HttpServiceError ? err.message : 'Verification failed. Please try again.'
    return { success: false, message }
  }
}
