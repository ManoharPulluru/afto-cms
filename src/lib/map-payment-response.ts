import type { PaymentIntentSetup } from '@/lib/types/payment'

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

function pickString(obj: Record<string, unknown>, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const v = obj[key]
    if (typeof v === 'string' && v.trim()) return v
  }
  return fallback
}

export type PaymentIntentMapResult =
  | { ok: true; setup: PaymentIntentSetup }
  | { ok: false; reason: 'invalid_response' | 'missing_client_secret' | 'missing_publishable_key' }

export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? ''
}

export function mapPaymentIntentResponse(data: unknown): PaymentIntentMapResult {
  const root = asRecord(data)
  if (!root) return { ok: false, reason: 'invalid_response' }

  const dataEntity = asRecord(root.data) ?? root
  const paymentIntentBlock =
    asRecord(dataEntity.payment_intent) ??
    asRecord(dataEntity.paymentIntent) ??
    asRecord(root.payment_intent) ??
    asRecord(root.paymentIntent)

  const entity =
    paymentIntentBlock ??
    asRecord(dataEntity.payment_intent) ??
    asRecord(dataEntity.entity) ??
    dataEntity

  const nestedIntent =
    asRecord(entity.payment_intent) ??
    asRecord(entity.paymentIntent) ??
    asRecord(entity.intent) ??
    paymentIntentBlock

  const clientSecret =
    pickString(entity, ['client_secret', 'clientSecret']) ||
    pickString(nestedIntent ?? {}, ['client_secret', 'clientSecret'])

  const publishableKey =
    pickString(entity, [
      'publishable_key',
      'publishableKey',
      'stripe_publishable_key',
      'stripePublishableKey',
    ]) || getStripePublishableKey()

  const stripeAccountId =
    pickString(entity, ['stripe_account_id', 'stripeAccountId', 'connected_account_id']) ||
    pickString(nestedIntent ?? {}, ['stripe_account_id', 'stripeAccountId']) ||
    process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID ||
    undefined

  if (!clientSecret) return { ok: false, reason: 'missing_client_secret' }
  if (!publishableKey) return { ok: false, reason: 'missing_publishable_key' }

  return {
    ok: true,
    setup: { clientSecret, publishableKey, stripeAccountId: stripeAccountId || undefined },
  }
}
