'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchCustomerProfile } from '@/lib/customers-client-api'
import { prepareOrderPayment } from '@/lib/payment-client-api'
import type { PaymentBillSummary, PaymentIntentSetup } from '@/lib/types/payment'
import type { DeliveryChargeInfo } from '@/lib/types/delivery'
import type { CustomerDetailsForm } from '@/lib/types/customer'
import { formatCustomerAddress } from '@/lib/map-delivery-response'

type UseCartPaymentStepOptions = {
  isActive: boolean
  orderId?: string | null
  bill: PaymentBillSummary
  customerForm: CustomerDetailsForm
  deliveryMethod: 'pickup' | 'delivery'
  chargeInfo: DeliveryChargeInfo | null
  onOrderRefresh?: () => Promise<void>
}

export function useCartPaymentStep({
  isActive,
  orderId,
  bill,
  customerForm,
  deliveryMethod,
  chargeInfo,
  onOrderRefresh,
}: UseCartPaymentStepOptions) {
  const [paymentSetup, setPaymentSetup] = useState<PaymentIntentSetup | null>(null)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [loyaltyActive, setLoyaltyActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buildConfirmPayload = useCallback(() => {
    const payload = {
      customer_details: { email: customerForm.email.trim() },
      ...(deliveryMethod === 'delivery'
        ? {
            delivery_details: {
              validated_address:
                chargeInfo?.validatedAddress ?? formatCustomerAddress(customerForm),
              city: chargeInfo?.city ?? customerForm.city,
              pincode: chargeInfo?.postalCode ?? customerForm.postalCode,
              province_or_territory: chargeInfo?.province ?? customerForm.state,
              delivery_charges: chargeInfo?.deliveryCharge ?? bill.deliveryCharge,
              delivery_service_name: chargeInfo?.serviceName ?? 'Local Courier',
              map_url: '',
            },
          }
        : {}),
    }
    return payload
  }, [customerForm, deliveryMethod, chargeInfo, bill.deliveryCharge])

  const loadPaymentStep = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const profile = await fetchCustomerProfile()
      setLoyaltyPoints(profile.loyalty_points ?? 0)
      setLoyaltyActive((profile.loyalty_points ?? 0) > 0)

      if (orderId) {
        try {
          const setup = await prepareOrderPayment(orderId, buildConfirmPayload())
          setPaymentSetup(setup)
        } catch (intentErr) {
          setPaymentSetup(null)
          setError(
            intentErr instanceof Error
              ? intentErr.message
              : 'Unable to start payment for this order',
          )
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment details')
    } finally {
      setIsLoading(false)
    }
  }, [orderId, buildConfirmPayload])

  useEffect(() => {
    if (isActive) void loadPaymentStep()
  }, [isActive, loadPaymentStep])

  const finalizeOrder = useCallback(async () => {
    await onOrderRefresh?.()
  }, [onOrderRefresh])

  return {
    paymentSetup,
    loyaltyPoints,
    loyaltyActive,
    isLoading,
    error,
    loadPaymentStep,
    finalizeOrder,
  }
}
