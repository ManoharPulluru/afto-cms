'use client'

import type { ResolvedCartBill } from '@/lib/resolve-cart-bill'
import type { CartDrawerTheme } from '@/components/cart/types'
import { formatPrice } from '@/lib/utils'

export type CartBillLabels = {
  subtotal?: string
  tax?: string
  delivery?: string
  total?: string
  pickup?: string
  discount?: string
}

export type CartBillFooterProps = {
  theme: CartDrawerTheme
  bill: ResolvedCartBill
  showDelivery: boolean
  deliveryMethod: 'pickup' | 'delivery'
  couponBadge?: string
  labels?: CartBillLabels
}

function deliveryValue(
  bill: ResolvedCartBill,
  deliveryMethod: 'pickup' | 'delivery',
  showDelivery: boolean,
  pickupLabel: string,
): string | null {
  if (!showDelivery) return null
  if (deliveryMethod === 'delivery' && bill.deliveryCharge > 0) {
    return formatPrice(bill.deliveryCharge)
  }
  if (deliveryMethod === 'pickup') return pickupLabel
  return '—'
}

export function CartBillFooter({
  theme,
  bill,
  showDelivery,
  deliveryMethod,
  couponBadge,
  labels = {},
}: CartBillFooterProps) {
  const delivery = deliveryValue(
    bill,
    deliveryMethod,
    showDelivery,
    labels.pickup ?? 'Free pickup',
  )

  return (
    <div
      className="mb-4 w-full space-y-2 rounded-xl p-3"
      style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}
    >
      {couponBadge && (
        <div className="flex justify-end">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ backgroundColor: theme.successBg, color: theme.success }}
          >
            {couponBadge}
          </span>
        </div>
      )}

      <BillRow
        label={labels.subtotal ?? 'Subtotal'}
        value={formatPrice(bill.subtotalAfterDiscount)}
        muted={theme.muted}
      />

      {bill.hasCoupon && bill.subtotal > bill.subtotalAfterDiscount && (
        <BillRow
          label={labels.discount ?? 'Discount'}
          value={`−${formatPrice(bill.subtotal - bill.subtotalAfterDiscount)}`}
          muted={theme.muted}
        />
      )}

      <BillRow label={labels.tax ?? 'Tax'} value={formatPrice(bill.tax)} muted={theme.muted} />

      {delivery !== null && (
        <BillRow label={labels.delivery ?? 'Delivery'} value={delivery} muted={theme.muted} />
      )}

      <div
        className="flex items-center justify-between border-t pt-2.5 text-base font-bold"
        style={{ borderColor: theme.border, color: theme.text }}
      >
        <span>{labels.total ?? 'Total'}</span>
        <span style={{ color: theme.accent }}>{formatPrice(bill.total)}</span>
      </div>
    </div>
  )
}

function BillRow({
  label,
  value,
  muted,
}: {
  label: string
  value: string
  muted?: string
}) {
  return (
    <div className="flex w-full items-center justify-between gap-6 text-sm">
      <span className="flex-shrink-0" style={{ color: muted ?? 'inherit' }}>
        {label}
      </span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}
