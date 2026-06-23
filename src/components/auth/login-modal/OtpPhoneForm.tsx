'use client'

import type { FormEvent, ReactNode } from 'react'
import { CountryDialSelect } from '@/components/auth/login-modal/CountryDialSelect'
import { OtpDigitInput } from '@/components/auth/OtpDigitInput'
import type { OtpLoginController } from '@/hooks/useOtpLogin'

export type OtpPhoneFormTheme = {
  accentColor: string
  mobilePlaceholder: string
  otpButtonLabel: string
  labelColor: string
  inputBorderColor: string
  inputBg: string
  inputTextColor: string
  /** V1 warm card uses dedicated verify-OTP chrome */
  uiVariant?: 'warm' | 'default'
}

type OtpPhoneFormProps = {
  theme: OtpPhoneFormTheme
  otp: OtpLoginController
  /** Optional slot above the form (variant-specific header) */
  header?: ReactNode
  /** Shown on OTP step for warm variant instead of phone header */
  otpHeader?: ReactNode
}

/**
 * Presentational OTP form — no API calls here.
 * Logic lives in useOtpLogin + lib/otp-auth-api.ts.
 */
export function OtpPhoneForm({ theme, otp, header, otpHeader }: OtpPhoneFormProps) {
  const {
    accentColor,
    mobilePlaceholder,
    otpButtonLabel,
    labelColor,
    inputBorderColor,
    inputBg,
    inputTextColor,
    uiVariant = 'default',
  } = theme

  const isWarm = uiVariant === 'warm'
  const showHeader = otp.step === 'otp' && otpHeader ? otpHeader : header

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    void otp.submit()
  }

  const verifyDisabled = otp.loading || (otp.step === 'otp' && !otp.otpComplete)

  return (
    <>
      {showHeader}
      <form className="relative z-10 space-y-3 sm:space-y-6" onSubmit={handleSubmit}>
        {otp.step === 'phone' ? (
          <div>
            <label
              htmlFor="login-mobile"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider sm:mb-3 sm:text-sm"
              style={{ color: labelColor }}
            >
              Mobile Number
            </label>
            <div className="flex w-full items-stretch overflow-hidden rounded-xl transition-all focus-within:ring-2 focus-within:ring-opacity-50">
              <CountryDialSelect
                value={otp.dial}
                onChange={otp.setDial}
                borderColor={inputBorderColor}
                backgroundColor={inputBg}
                textColor={inputTextColor}
              />
              <input
                id="login-mobile"
                type="tel"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                value={otp.mobile}
                onChange={(e) => otp.setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder={mobilePlaceholder}
                className="block h-full min-h-[50px] w-full flex-1 rounded-r-xl border-2 border-l-0 px-3 py-3 text-sm font-medium outline-none transition-all focus:border-current sm:px-4 sm:text-base"
                style={{
                  borderColor: inputBorderColor,
                  backgroundColor: inputBg,
                  color: inputTextColor,
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            <label
              htmlFor="login-otp-0"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider sm:mb-3 sm:text-sm"
              style={{ color: labelColor }}
            >
              {isWarm ? 'Enter 4-Digit Code' : 'Enter OTP'}
            </label>
            {!isWarm && (
              <p className="mb-3 text-xs sm:text-sm" style={{ color: labelColor, opacity: 0.8 }}>
                Sent to {otp.phoneNumber}
              </p>
            )}
            <OtpDigitInput
              value={otp.otp}
              onChange={otp.setOtp}
              accentColor={accentColor}
              borderColor={inputBorderColor}
              backgroundColor={inputBg}
              textColor={inputTextColor}
              disabled={otp.loading}
            />
            <div className="mb-2 flex items-center justify-center sm:mb-4">
              <button
                type="button"
                disabled={otp.resendSeconds > 0 || otp.loading}
                onClick={() => void otp.resendOtp()}
                className="text-xs font-medium transition hover:underline disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                style={{ color: accentColor }}
              >
                {otp.resendSeconds > 0 ? `Resend OTP in ${otp.resendSeconds}s` : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}

        {otp.error && (
          <p className="text-center text-sm text-red-500" role="alert">
            {otp.error}
          </p>
        )}

        {otp.successMessage && !otp.error && otp.step === 'phone' && (
          <p className="text-center text-sm text-emerald-600" role="status">
            {otp.successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={verifyDisabled}
          className="w-full transform rounded-lg py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl sm:py-4 sm:text-lg"
          style={{
            backgroundColor: accentColor,
            boxShadow: `${accentColor}33 0px 8px 16px`,
          }}
        >
          {otp.loading
            ? 'Please wait…'
            : otp.step === 'phone'
              ? otpButtonLabel
              : 'Verify & Continue'}
        </button>

        {otp.step === 'otp' && (
          <button
            type="button"
            className="w-full text-xs font-medium hover:underline sm:text-sm"
            style={{ color: labelColor }}
            onClick={otp.resetToPhone}
          >
            ← Change Number
          </button>
        )}
      </form>
    </>
  )
}
