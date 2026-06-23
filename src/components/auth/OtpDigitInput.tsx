'use client'

import { useCallback, useRef, type KeyboardEvent, type ClipboardEvent } from 'react'

const OTP_LENGTH = 4

type OtpDigitInputProps = {
  value: string
  onChange: (value: string) => void
  accentColor: string
  borderColor: string
  backgroundColor: string
  textColor: string
  disabled?: boolean
}

export function OtpDigitInput({
  value,
  onChange,
  accentColor,
  borderColor,
  backgroundColor,
  textColor,
  disabled,
}: OtpDigitInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? '')

  const focusAt = useCallback((index: number) => {
    const el = inputsRef.current[index]
    el?.focus()
    el?.select()
  }, [])

  const updateDigit = useCallback(
    (index: number, char: string) => {
      const next = value.split('')
      next[index] = char
      const joined = next.join('').slice(0, OTP_LENGTH)
      onChange(joined)
      if (char && index < OTP_LENGTH - 1) focusAt(index + 1)
    },
    [value, onChange, focusAt],
  )

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (digits[index]) {
        updateDigit(index, '')
      } else if (index > 0) {
        updateDigit(index - 1, '')
        focusAt(index - 1)
      }
      return
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      focusAt(index - 1)
    }
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      e.preventDefault()
      focusAt(index + 1)
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (pasted) onChange(pasted)
  }

  return (
    <div className="mb-2.5 flex justify-between gap-1.5 sm:mb-6 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          disabled={disabled}
          value={digit}
          onChange={(e) => {
            const char = e.target.value.replace(/\D/g, '').slice(-1)
            updateDigit(index, char)
          }}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="h-14 w-14 rounded-lg border-2 text-center text-lg font-bold outline-none transition-all hover:border-opacity-70 focus:border-current sm:h-14 sm:w-14 md:h-16 md:w-16 sm:rounded-xl sm:text-2xl"
          style={{
            borderColor: borderColor,
            backgroundColor,
            color: textColor,
            boxShadow: digit ? `0 0 0 1px ${accentColor}40` : undefined,
          }}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  )
}

export const OTP_DIGIT_COUNT = OTP_LENGTH
