'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js'
import type { CartDrawerTheme } from '@/components/cart/types'
import type { PaymentBillSummary, PaymentIntentSetup } from '@/lib/types/payment'
import { formatPrice } from '@/lib/utils'

type CartPaymentStepProps = {
  theme: CartDrawerTheme
  accent: string
  bill: PaymentBillSummary
  loyaltyPoints: number
  loyaltyActive: boolean
  paymentSetup: PaymentIntentSetup | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  onPaymentSuccess?: () => void | Promise<void>
}

export function CartPaymentStep({
  theme,
  accent,
  bill,
  loyaltyPoints,
  loyaltyActive,
  paymentSetup,
  isLoading,
  error,
  onRetry,
  onPaymentSuccess,
}: CartPaymentStepProps) {
  const stripePromise = useMemo(() => {
    if (!paymentSetup?.publishableKey) return null
    return loadStripe(
      paymentSetup.publishableKey,
      paymentSetup.stripeAccountId ? { stripeAccount: paymentSetup.stripeAccountId } : undefined,
    )
  }, [paymentSetup])

  const elementsOptions = useMemo<StripeElementsOptions | undefined>(() => {
    if (!paymentSetup?.clientSecret) return undefined
    return {
      clientSecret: paymentSetup.clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: accent,
          colorText: theme.text,
          colorBackground: theme.background,
          borderRadius: '8px',
        },
      },
    }
  }, [paymentSetup, accent, theme])

  return (
    <div className="w-full">
      <h2 className="mb-4 text-xl font-bold" style={{ color: theme.text }}>
        Payment Details
      </h2>

      {error && (
        <div
          className="mb-4 rounded-lg border px-3 py-2 text-xs"
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

      <PaymentSummaryCard theme={theme} bill={bill} />

      <LoyaltySection
        theme={theme}
        accent={accent}
        loyaltyPoints={loyaltyPoints}
        loyaltyActive={loyaltyActive}
      />

      {isLoading ? (
        <div className="py-6 text-center text-sm" style={{ color: theme.muted }}>
          Preparing secure checkout…
        </div>
      ) : paymentSetup && stripePromise && elementsOptions ? (
        <Elements stripe={stripePromise} options={elementsOptions}>
          <StripePaymentForm
            theme={theme}
            accent={accent}
            total={bill.total}
            onPaymentSuccess={onPaymentSuccess}
          />
        </Elements>
      ) : (
        <div
          className="rounded-lg border px-3 py-4 text-xs"
          style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.muted }}
        >
          Card payment will appear here once the order is ready for checkout.
        </div>
      )}
    </div>
  )
}

function PaymentSummaryCard({
  theme,
  bill,
}: {
  theme: CartDrawerTheme
  bill: PaymentBillSummary
}) {
  return (
    <div
      className="mb-6 space-y-2 rounded-lg border p-4"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
    >
      <div className="flex items-center justify-between text-xs" style={{ color: theme.muted }}>
        <span>Subtotal</span>
        <span className="flex items-center gap-1">
          {bill.hasCoupon && bill.subtotal > bill.subtotalAfterDiscount && (
            <span className="text-gray-400 line-through">{formatPrice(bill.subtotal)}</span>
          )}
          <span className="font-semibold text-green-600">
            {formatPrice(bill.subtotalAfterDiscount)}
          </span>
          {bill.hasCoupon && (
            <span className="rounded bg-green-100 px-1 py-0.5 text-[10px] font-semibold text-green-700">
              Coupon
            </span>
          )}
        </span>
      </div>
      <div className="flex justify-between text-xs" style={{ color: theme.muted }}>
        <span>Delivery</span>
        <span>{formatPrice(bill.deliveryCharge)}</span>
      </div>
      <div className="flex justify-between text-xs" style={{ color: theme.muted }}>
        <span>Tax</span>
        <span>{formatPrice(bill.tax)}</span>
      </div>
      <div className="my-2 border-t" style={{ borderColor: theme.border }} />
      <div className="flex justify-between text-sm font-bold" style={{ color: theme.text }}>
        <span>Total</span>
        <span>{formatPrice(bill.total)}</span>
      </div>
    </div>
  )
}

function LoyaltySection({
  theme,
  accent,
  loyaltyPoints,
  loyaltyActive,
}: {
  theme: CartDrawerTheme
  accent: string
  loyaltyPoints: number
  loyaltyActive: boolean
}) {
  return (
    <div className="mb-4">
      <div
        className="mt-1 overflow-hidden rounded-lg"
        style={{
          backgroundColor: `${accent}08`,
          border: `1px dashed ${accent}30`,
        }}
      >
        <div className="px-2.5 py-2">
          <div className="mb-1 flex items-center gap-1.5">
            <img src="/loyalty-coin.svg" alt="" width={16} height={16} />
            <span className="text-xs font-bold" style={{ color: theme.text }}>
              Redeem <span style={{ color: accent }}>Loyalty Points</span>
            </span>
          </div>
          <p className="text-[11px]" style={{ color: theme.muted }}>
            {loyaltyActive
              ? `You have ${loyaltyPoints} points available.`
              : 'Loyalty program is not currently active.'}
          </p>
        </div>
      </div>
    </div>
  )
}

function StripePaymentForm({
  theme,
  accent,
  total,
  onPaymentSuccess,
}: {
  theme: CartDrawerTheme
  accent: string
  total: number
  onPaymentSuccess?: () => void | Promise<void>
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isPaying, setIsPaying] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsPaying(true)
    setPayError(null)
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: typeof window !== 'undefined' ? window.location.href : undefined,
        },
        redirect: 'if_required',
      })
      if (error) {
        setPayError(error.message ?? 'Payment failed')
        return
      }
      await onPaymentSuccess?.()
    } catch (err) {
      setPayError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 border-t" style={{ borderColor: theme.border }} />
        <span className="text-xs" style={{ color: theme.muted }}>
          Or pay with card
        </span>
        <div className="flex-1 border-t" style={{ borderColor: theme.border }} />
      </div>

      <div className="mb-4">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {payError && (
        <p className="mb-3 text-xs" style={{ color: '#b91c1c' }}>
          {payError}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isPaying}
        className="flex w-full items-center justify-center rounded-lg py-3 text-base font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ backgroundColor: accent, color: '#ffffff' }}
      >
        {isPaying ? 'Processing…' : `Pay ${formatPrice(total)}`}
      </button>
    </form>
  )
}
