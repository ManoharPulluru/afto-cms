'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CartDrawerConfig } from '@/components/cart/types'
import { useCartDetailsForm } from '@/hooks/useCartDetailsForm'
import { useCartDeliveryStep } from '@/hooks/useCartDeliveryStep'
import { useCartPaymentStep } from '@/hooks/useCartPaymentStep'
import { getBusinessAccountId } from '@/lib/api'
import { clearActiveOrderId, loadCartStep, saveCartStep } from '@/lib/order-session'
import { resolveCartBill } from '@/lib/resolve-cart-bill'
import { useCartDrawerOptional } from '@/providers/CartDrawerProvider'
import { useOrderCartOptional } from '@/providers/OrderCartProvider'

type UseCartDrawerFlowOptions = {
  config: CartDrawerConfig
  onClose?: () => void
  studioPreviewStep?: number
}

export function useCartDrawerFlow({
  config,
  onClose,
  studioPreviewStep,
}: UseCartDrawerFlowOptions) {
  const [activeStep, setActiveStep] = useState(0)
  const orderCart = useOrderCartOptional()
  const cartDrawer = useCartDrawerOptional()
  const isStudioPreview = cartDrawer?.studioPreview.active ?? false
  const businessAccountId = getBusinessAccountId()
  const orderId = orderCart?.order?.id

  const resolvedStep =
    studioPreviewStep !== undefined
      ? studioPreviewStep
      : isStudioPreview
        ? cartDrawer?.studioPreviewStep ?? 0
        : activeStep

  const setStep = useCallback(
    (step: number) => {
      if (isStudioPreview || studioPreviewStep !== undefined) {
        cartDrawer?.setStudioPreviewStep(step)
        return
      }
      setActiveStep(step)
    },
    [cartDrawer, isStudioPreview, studioPreviewStep],
  )

  useEffect(() => {
    if (isStudioPreview || studioPreviewStep !== undefined || !orderId) return
    const saved = loadCartStep(businessAccountId, orderId)
    if (saved !== null) setActiveStep(saved)
  }, [businessAccountId, isStudioPreview, orderId, studioPreviewStep])

  useEffect(() => {
    if (isStudioPreview || studioPreviewStep !== undefined || !orderId) return
    saveCartStep(businessAccountId, orderId, activeStep)
  }, [activeStep, businessAccountId, isStudioPreview, orderId, studioPreviewStep])

  const detailsForm = useCartDetailsForm(resolvedStep === 1)
  const deliveryStep = useCartDeliveryStep({
    isActive: resolvedStep === 2,
    customerForm: detailsForm.form,
    storeAddress: config.storeAddress ?? '',
    orderId: orderCart?.order?.id,
    onOrderRefresh: orderCart?.refreshOrder,
  })

  const deliveryChargeAmount =
    deliveryStep.method === 'delivery' ? deliveryStep.deliveryCharge : null

  const bill = useMemo(
    () => resolveCartBill(config, deliveryChargeAmount, deliveryStep.method),
    [config, deliveryChargeAmount, deliveryStep.method],
  )

  const displayTotal = bill.total

  const paymentBill = useMemo(
    () => ({
      subtotal: bill.subtotal,
      subtotalAfterDiscount: bill.subtotalAfterDiscount,
      tax: bill.tax,
      deliveryCharge: bill.deliveryCharge,
      total: bill.total,
      hasCoupon: bill.hasCoupon,
    }),
    [bill],
  )

  const paymentStep = useCartPaymentStep({
    isActive: resolvedStep === 3,
    orderId: orderCart?.order?.id,
    bill: paymentBill,
    customerForm: detailsForm.form,
    deliveryMethod: deliveryStep.method,
    chargeInfo: deliveryStep.chargeInfo,
    onOrderRefresh: orderCart?.refreshOrder,
  })

  const itemCount = useMemo(
    () => config.items.reduce((sum, item) => sum + item.quantity, 0),
    [config.items],
  )

  const parts = config.parts

  const footerButtonLabel =
    resolvedStep === 0
      ? parts?.cta.cartButtonLabel ?? config.nextButtonLabel
      : resolvedStep === 1
        ? parts?.cta.detailsButtonLabel ?? 'Choose Delivery'
        : resolvedStep === 2
          ? parts?.cta.deliveryButtonLabel ?? 'Proceed to Payment'
          : 'Place Order'

  const footerDisabled =
    (resolvedStep === 0 && config.items.length === 0) ||
    (resolvedStep === 1 && (detailsForm.isLoading || detailsForm.isSaving)) ||
    (resolvedStep === 2 && (deliveryStep.isLoading || deliveryStep.isSubmitting))

  const footerLoading = detailsForm.isSaving || deliveryStep.isSubmitting

  const headerTitle =
    resolvedStep === 3
      ? parts?.header.paymentTitle ?? 'Complete Payment'
      : resolvedStep === 1
        ? parts?.header.detailsTitle ?? 'Your Details'
        : resolvedStep === 2
          ? parts?.header.deliveryTitle ?? 'How to Get It'
          : parts?.header.titlePrefix ?? config.titlePrefix

  const savingLabel = parts?.cta.savingLabel ?? 'Saving…'

  const handlePaymentSuccess = useCallback(async () => {
    await paymentStep.finalizeOrder()
    clearActiveOrderId(getBusinessAccountId())
    await orderCart?.refreshOrder()
    onClose?.()
  }, [onClose, orderCart, paymentStep])

  const handleFooterAction = useCallback(async () => {
    if (isStudioPreview || studioPreviewStep !== undefined) {
      if (resolvedStep < config.steps.length - 1) {
        setStep(resolvedStep + 1)
      }
      return
    }
    if (resolvedStep === 0) {
      setStep(1)
      return
    }
    if (resolvedStep === 1) {
      const saved = await detailsForm.saveProfile()
      if (saved) setStep(2)
      return
    }
    if (resolvedStep === 2) {
      const saved = await deliveryStep.submitDeliveryMethod()
      if (saved) setStep(3)
      return
    }
    if (resolvedStep < config.steps.length - 1) {
      setStep(resolvedStep + 1)
    }
  }, [
    config.steps.length,
    deliveryStep,
    detailsForm,
    isStudioPreview,
    resolvedStep,
    setStep,
    studioPreviewStep,
  ])

  return {
    activeStep: resolvedStep,
    setActiveStep: setStep,
    orderCart,
    detailsForm,
    deliveryStep,
    paymentStep,
    paymentBill,
    bill,
    deliveryChargeAmount: bill.deliveryCharge,
    displayTotal,
    itemCount,
    footerButtonLabel,
    footerDisabled,
    footerLoading,
    headerTitle,
    savingLabel,
    handlePaymentSuccess,
    handleFooterAction,
    isStudioPreview,
  }
}
