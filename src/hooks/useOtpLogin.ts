'use client'

import { useCallback, useEffect, useState } from 'react'
import { formatPhoneNumber, getBusinessAccountId } from '@/lib/api'
import { requestOtp, verifyOtp } from '@/lib/otp-auth-api'

export type OtpLoginStep = 'phone' | 'otp'

const RESEND_COOLDOWN_SEC = 30

export type UseOtpLoginOptions = {
  /** Afto business account id for customer OTP */
  businessAccountId?: string
  /** @deprecated use businessAccountId */
  businessId?: string
  onSuccess?: (result: {
    accessToken?: string
    refreshToken?: string
    customerId?: string
    phoneNumber?: string
  }) => void
}

/** Shared OTP state machine — used by every login modal variant. */
export function useOtpLogin(options: UseOtpLoginOptions = {}) {
  const [dial, setDial] = useState('+91')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<OtpLoginStep>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [customerId, setCustomerId] = useState<string | undefined>()
  const [successMessage, setSuccessMessage] = useState('')
  const [resendSeconds, setResendSeconds] = useState(0)

  const businessAccountId =
    options.businessAccountId ?? options.businessId ?? getBusinessAccountId()

  const phoneNumber = formatPhoneNumber(dial, mobile)
  const otpComplete = otp.length === 4

  useEffect(() => {
    if (resendSeconds <= 0) return
    const timer = window.setInterval(() => {
      setResendSeconds((s) => (s <= 1 ? 0 : s - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [resendSeconds])

  const resetToPhone = useCallback(() => {
    setStep('phone')
    setOtp('')
    setError('')
    setSuccessMessage('')
    setCustomerId(undefined)
    setResendSeconds(0)
  }, [])

  const sendOtpRequest = useCallback(async () => {
    const result = await requestOtp({
      dialCode: dial,
      mobile,
      businessAccountId,
    })
    if (!result.success) {
      setError(result.message ?? 'Could not send OTP')
      return false
    }
    setCustomerId(result.customerId)
    setSuccessMessage(result.message ?? 'OTP sent')
    setResendSeconds(RESEND_COOLDOWN_SEC)
    return true
  }, [dial, mobile, businessAccountId])

  const resendOtp = useCallback(async () => {
    if (resendSeconds > 0 || loading) return
    setError('')
    setLoading(true)
    try {
      await sendOtpRequest()
    } finally {
      setLoading(false)
    }
  }, [resendSeconds, loading, sendOtpRequest])

  const submit = useCallback(async () => {
    setError('')
    setSuccessMessage('')
    setLoading(true)
    try {
      if (step === 'phone') {
        const ok = await sendOtpRequest()
        if (ok) setStep('otp')
        return
      }

      if (!otpComplete) {
        setError('Enter the 4-digit code')
        return
      }

      const result = await verifyOtp({
        dialCode: dial,
        mobile,
        otp,
        customerId,
        businessAccountId,
      })
      if (!result.success) {
        setError(result.message ?? 'Verification failed')
        return
      }
      setSuccessMessage(result.message ?? 'Signed in successfully')
      options.onSuccess?.({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        customerId: result.customerId,
        phoneNumber: result.phoneNumber,
      })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [
    step,
    dial,
    mobile,
    otp,
    customerId,
    businessAccountId,
    otpComplete,
    sendOtpRequest,
    options,
  ])

  return {
    dial,
    setDial,
    mobile,
    setMobile,
    otp,
    setOtp,
    step,
    loading,
    error,
    successMessage,
    phoneNumber,
    otpComplete,
    resendSeconds,
    resendOtp,
    submit,
    resetToPhone,
  }
}

export type OtpLoginController = ReturnType<typeof useOtpLogin>
