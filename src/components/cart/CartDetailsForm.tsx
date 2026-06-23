'use client'

import type { CSSProperties, ReactNode } from 'react'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { CartDrawerTheme } from '@/components/cart/types'
import type { CustomerDetailsForm } from '@/lib/types/customer'

type CartDetailsFormProps = {
  theme: CartDrawerTheme
  accent: string
  form: CustomerDetailsForm
  onChange: (form: CustomerDetailsForm) => void
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

export function CartDetailsForm({
  theme,
  accent,
  form,
  onChange,
  isLoading,
  error,
  onRetry,
}: CartDetailsFormProps) {
  const inputStyle = {
    backgroundColor: theme.surface,
    color: theme.text,
    borderColor: theme.border,
    ['--tw-ring-color' as string]: accent,
  }

  const labelStyle = { color: theme.muted }

  if (isLoading && !form.name && !form.phone) {
    return (
      <div className="py-8 text-center text-sm" style={{ color: theme.muted }}>
        Loading your details…
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {error && (
        <div
          className="rounded-lg border px-3 py-2 text-xs"
          style={{ borderColor: '#fecaca', backgroundColor: '#fef2f2', color: '#b91c1c' }}
        >
          {error}
          {onRetry && (
            <button type="button" className="ml-2 underline" onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base font-semibold sm:text-lg" style={{ color: theme.text }}>
          Contact Info
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Name" htmlFor="cart-name" labelStyle={labelStyle}>
            <input
              id="cart-name"
              type="text"
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label="Phone" htmlFor="cart-phone" labelStyle={labelStyle}>
            <input
              id="cart-phone"
              type="tel"
              disabled
              value={form.phone}
              placeholder="+1 (123) 456-7890"
              className={`${inputClass} opacity-80`}
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label="Email" htmlFor="cart-email" labelStyle={labelStyle}>
          <input
            id="cart-email"
            type="email"
            value={form.email}
            onChange={(e) => onChange({ ...form, email: e.target.value })}
            className={inputClass}
            style={inputStyle}
          />
        </Field>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium sm:text-sm" style={labelStyle}>
            Shipping Address
          </span>
          <button
            type="button"
            disabled
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all hover:opacity-80 disabled:opacity-50 sm:text-xs"
            style={{ backgroundColor: `${accent}15`, color: accent }}
          >
            <DynamicIcon icon="lucide:map-pin" size={14} />
            Use my location
          </button>
        </div>
        <Field label="Address" htmlFor="cart-address" labelStyle={labelStyle}>
          <input
            id="cart-address"
            type="text"
            autoComplete="off"
            placeholder="Start typing your address..."
            value={form.address}
            onChange={(e) => onChange({ ...form, address: e.target.value })}
            className={inputClass}
            style={inputStyle}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="City" htmlFor="cart-city" labelStyle={labelStyle}>
            <input
              id="cart-city"
              type="text"
              value={form.city}
              onChange={(e) => onChange({ ...form, city: e.target.value })}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label="Postal Code" htmlFor="cart-pincode" labelStyle={labelStyle}>
            <input
              id="cart-pincode"
              type="text"
              value={form.postalCode}
              onChange={(e) => onChange({ ...form, postalCode: e.target.value })}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label="Province / State" htmlFor="cart-state" labelStyle={labelStyle}>
            <input
              id="cart-state"
              type="text"
              value={form.state}
              onChange={(e) => onChange({ ...form, state: e.target.value })}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
        </div>
      </div>
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border p-2.5 text-xs transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 sm:p-3 sm:text-sm'

function Field({
  label,
  htmlFor,
  labelStyle,
  children,
}: {
  label: string
  htmlFor: string
  labelStyle: CSSProperties
  children: ReactNode
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-xs font-medium sm:mb-1.5 sm:text-sm"
        style={labelStyle}
      >
        {label}
      </label>
      {children}
    </div>
  )
}
