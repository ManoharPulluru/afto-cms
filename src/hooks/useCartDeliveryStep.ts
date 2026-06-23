'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  fetchDeliveryCharges,
  submitOrderDelivery,
  submitOrderPickup,
} from '@/lib/delivery-client-api'
import { formatCustomerAddress } from '@/lib/map-delivery-response'
import type { CustomerDetailsForm } from '@/lib/types/customer'
import type { DeliveryChargeInfo, DeliveryMethod } from '@/lib/types/delivery'
import { loadActiveOrderId } from '@/lib/order-session'
import { getBusinessAccountId } from '@/lib/api'

type UseCartDeliveryStepOptions = {
  isActive: boolean
  customerForm: CustomerDetailsForm
  storeAddress: string
  orderId?: string | null
  onOrderRefresh?: () => Promise<void>
}

export function useCartDeliveryStep({
  isActive,
  customerForm,
  storeAddress,
  orderId,
  onOrderRefresh,
}: UseCartDeliveryStepOptions) {
  const [method, setMethod] = useState<DeliveryMethod>('pickup')
  const [pickupInstructions, setPickupInstructions] = useState('')
  const [chargeInfo, setChargeInfo] = useState<DeliveryChargeInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resolvedOrderId =
    orderId ?? loadActiveOrderId(getBusinessAccountId()) ?? null

  const loadDeliveryInfo = useCallback(async () => {
    if (!resolvedOrderId) {
      setChargeInfo({
        deliveryCharge: null,
        homeDeliveryAvailable: false,
        unavailableMessage: 'Delivery is not available for your address currently',
        storeAddress: storeAddress || null,
        serviceName: null,
        validatedAddress: null,
        city: null,
        postalCode: null,
        province: null,
      })
      return
    }

    const destination = formatCustomerAddress(customerForm)
    if (!destination.trim()) {
      setChargeInfo({
        deliveryCharge: null,
        homeDeliveryAvailable: false,
        unavailableMessage: 'Add your shipping address on the Details step first.',
        storeAddress: storeAddress || null,
        serviceName: null,
        validatedAddress: null,
        city: null,
        postalCode: null,
        province: null,
      })
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const info = await fetchDeliveryCharges(resolvedOrderId, destination, storeAddress)
      setChargeInfo(info)
      if (!info.homeDeliveryAvailable) {
        setMethod((current) => (current === 'delivery' ? 'pickup' : current))
      }
    } catch (err) {
      setChargeInfo({
        deliveryCharge: null,
        homeDeliveryAvailable: false,
        unavailableMessage:
          err instanceof Error ? err.message : 'Delivery is not available for your address currently',
        storeAddress: storeAddress || null,
        serviceName: null,
        validatedAddress: null,
        city: null,
        postalCode: null,
        province: null,
      })
    } finally {
      setIsLoading(false)
    }
  }, [resolvedOrderId, customerForm, storeAddress])

  useEffect(() => {
    if (isActive) void loadDeliveryInfo()
  }, [isActive, loadDeliveryInfo])

  const submitDeliveryMethod = useCallback(async () => {
    if (!resolvedOrderId) return true

    setIsSubmitting(true)
    setError(null)
    try {
      if (method === 'pickup') {
        await submitOrderPickup(resolvedOrderId, pickupInstructions)
      } else {
        const details = chargeInfo
        await submitOrderDelivery(resolvedOrderId, {
          delivery_details: {
            validated_address:
              details?.validatedAddress ?? formatCustomerAddress(customerForm),
            city: details?.city ?? customerForm.city,
            pincode: details?.postalCode ?? customerForm.postalCode,
            province_or_territory: details?.province ?? customerForm.state,
            delivery_charges: details?.deliveryCharge ?? 0,
            delivery_service_name: details?.serviceName ?? 'Local Courier',
            map_url: '',
          },
        })
      }
      await onOrderRefresh?.()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save delivery option')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [
    resolvedOrderId,
    method,
    pickupInstructions,
    chargeInfo,
    customerForm,
    onOrderRefresh,
  ])

  const displayStoreAddress = chargeInfo?.storeAddress || storeAddress

  const deliveryCharge =
    method === 'delivery' && chargeInfo?.homeDeliveryAvailable
      ? (chargeInfo.deliveryCharge ?? 0)
      : null

  return {
    method,
    setMethod,
    pickupInstructions,
    setPickupInstructions,
    chargeInfo,
    displayStoreAddress,
    deliveryCharge,
    isLoading,
    isSubmitting,
    error,
    loadDeliveryInfo,
    submitDeliveryMethod,
    homeDeliveryAvailable: chargeInfo?.homeDeliveryAvailable ?? false,
    unavailableMessage: chargeInfo?.unavailableMessage,
  }
}
