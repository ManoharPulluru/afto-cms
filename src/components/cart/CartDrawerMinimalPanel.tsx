'use client'

import type { ReactNode } from 'react'
import type { CartDrawerConfig, CartDrawerTheme } from '@/components/cart/types'
import { CartBillFooter } from '@/components/cart/CartBillFooter'
import { CartDetailsForm } from '@/components/cart/CartDetailsForm'
import { CartDeliveryStep } from '@/components/cart/CartDeliveryStep'
import { CartPaymentStep } from '@/components/cart/CartPaymentStep'
import { CartStepNavPills } from '@/components/cart/nav/CartStepNavPills'
import { RemoteImage } from '@/components/ui/RemoteImage'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import { useCartDrawerFlow } from '@/hooks/useCartDrawerFlow'
import { formatPrice } from '@/lib/utils'
import { StudioCartPartOutline } from '@/components/cart/StudioCartPartOutline'
import { useOrderCartOptional } from '@/providers/OrderCartProvider'

type Props = {
  config: CartDrawerConfig
  theme: CartDrawerTheme
  onClose?: () => void
  className?: string
  isLoading?: boolean
  isMutating?: boolean
  studioHighlightPart?: string
  studioPreviewStep?: number
}

export function CartDrawerMinimalPanel({
  config,
  theme,
  onClose,
  className = '',
  isLoading,
  isMutating,
  studioHighlightPart,
  studioPreviewStep,
}: Props) {
  const flow = useCartDrawerFlow({ config, onClose, studioPreviewStep })
  const parts = config.parts
  const header = parts?.header
  const bill = parts?.bill
  const cta = parts?.cta
  const stepNav = parts?.stepNav
  const itemSuffix = header?.itemCountSuffix ?? 'items'
  const billLabels = bill
    ? {
        subtotal: bill.subtotalLabel,
        tax: bill.taxLabel,
        delivery: bill.deliveryLabel,
        total: bill.totalLabel,
        pickup: bill.pickupLabel,
        discount: bill.discountLabel,
      }
    : undefined

  return (
    <div
      className={`relative z-20 ml-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden shadow-xl ${className}`}
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {header?.visible !== false && (
      <StudioCartPartOutline part="cartDrawerHeader" highlightPart={studioHighlightPart}>
      <header
        className="flex flex-shrink-0 items-center justify-between border-b px-5 py-4"
        style={{ borderColor: theme.border, backgroundColor: theme.surface }}
      >
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{flow.headerTitle}</h1>
          <p className="text-xs" style={{ color: theme.muted }}>
            {header?.orderBadgePrefix ?? 'Order #'}{config.orderNumber} · {flow.itemCount} {flow.itemCount === 1 ? itemSuffix.replace(/s$/, '') : itemSuffix}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: theme.background, color: theme.muted }}
            aria-label="Close cart"
            onClick={onClose}
          >
            <DynamicIcon icon="lucide:x" size={18} />
          </button>
        )}
      </header>
      </StudioCartPartOutline>
      )}

      {stepNav?.visible !== false && (
      <StudioCartPartOutline part="cartStepNav" highlightPart={studioHighlightPart}>
      <div className="flex-shrink-0 px-5 py-3">
        <CartStepNavPills
          steps={config.steps}
          activeStep={flow.activeStep}
          theme={stepNav?.accentColor ? { ...theme, accent: stepNav.accentColor } : theme}
          onStepClick={flow.setActiveStep}
        />
      </div>
      </StudioCartPartOutline>
      )}

      <StudioCartPartOutline part="cartLineItem" highlightPart={studioHighlightPart} className="min-h-0 flex-1 overflow-hidden">
      <main className="h-full overflow-y-auto px-5 pb-4" style={{ scrollbarWidth: 'none' }}>
        {flow.activeStep === 0 && parts?.lineItem?.visible !== false && (
          <MinimalCartStep config={config} theme={theme} isLoading={isLoading} isMutating={isMutating} studioHighlightPart={studioHighlightPart} />
        )}
        {flow.activeStep === 1 && (
          <CartDetailsForm
            theme={theme}
            accent={theme.accent}
            form={flow.detailsForm.form}
            onChange={flow.detailsForm.setForm}
            isLoading={flow.detailsForm.isLoading}
            error={flow.detailsForm.error}
            onRetry={() => void flow.detailsForm.loadProfile()}
          />
        )}
        {flow.activeStep === 2 && (
          <CartDeliveryStep
            theme={theme}
            accent={theme.accent}
            method={flow.deliveryStep.method}
            onMethodChange={flow.deliveryStep.setMethod}
            homeDeliveryAvailable={flow.deliveryStep.homeDeliveryAvailable}
            unavailableMessage={flow.deliveryStep.unavailableMessage}
            storeAddress={flow.deliveryStep.displayStoreAddress}
            pickupInstructions={flow.deliveryStep.pickupInstructions}
            onPickupInstructionsChange={flow.deliveryStep.setPickupInstructions}
            isLoading={flow.deliveryStep.isLoading}
            error={flow.deliveryStep.error}
            onRetry={() => void flow.deliveryStep.loadDeliveryInfo()}
          />
        )}
        {flow.activeStep === 3 && (
          <CartPaymentStep
            theme={theme}
            accent={theme.accent}
            bill={flow.paymentBill}
            loyaltyPoints={flow.paymentStep.loyaltyPoints}
            loyaltyActive={flow.paymentStep.loyaltyActive}
            paymentSetup={flow.paymentStep.paymentSetup}
            isLoading={flow.paymentStep.isLoading}
            error={flow.paymentStep.error}
            onRetry={() => void flow.paymentStep.loadPaymentStep()}
            onPaymentSuccess={() => void flow.handlePaymentSuccess()}
          />
        )}
      </main>
      </StudioCartPartOutline>

      {flow.activeStep < 3 && (
        <footer
          className="flex-shrink-0 border-t px-5 py-4"
          style={{ borderColor: theme.border, backgroundColor: theme.surface }}
        >
          <StudioCartPartOutline part="cartBill" highlightPart={studioHighlightPart}>
          {bill?.visible !== false && (
          <CartBillFooter
            theme={theme}
            bill={flow.bill}
            showDelivery={flow.activeStep >= 2}
            deliveryMethod={flow.deliveryStep.method}
            couponBadge={config.couponBadge}
            labels={billLabels}
          />
          )}
          </StudioCartPartOutline>
          <StudioCartPartOutline part="cartCta" highlightPart={studioHighlightPart} className="mt-4">
          {cta?.visible !== false && (
          <button
            type="button"
            disabled={flow.footerDisabled}
            onClick={() => void flow.handleFooterAction()}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              backgroundColor: cta?.backgroundColor || theme.accent,
              color: cta?.textColor ?? '#ffffff',
            }}
          >
            {flow.footerLoading ? flow.savingLabel : flow.footerButtonLabel}
            <DynamicIcon icon="lucide:arrow-right" size={16} />
          </button>
          )}
          </StudioCartPartOutline>
        </footer>
      )}
    </div>
  )
}

function MinimalCartStep({
  config,
  theme,
  isLoading,
  isMutating,
  studioHighlightPart,
}: {
  config: CartDrawerConfig
  theme: CartDrawerTheme
  isLoading?: boolean
  isMutating?: boolean
  studioHighlightPart?: string
}) {
  const lineItem = config.parts?.lineItem
  const coupon = config.parts?.coupon
  const emptyMessage = lineItem?.emptyMessage ?? 'Your cart is empty'
  const loadingMessage = lineItem?.loadingMessage ?? 'Loading cart…'
  const imageRadius = lineItem?.imageRadius ?? 8

  if (isLoading && config.items.length === 0) {
    return <p className="py-16 text-center text-sm" style={{ color: theme.muted }}>{loadingMessage}</p>
  }

  if (config.items.length === 0) {
    return (
      <div className="py-16 text-center">
        <DynamicIcon icon="lucide:shopping-cart" size={36} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm" style={{ color: theme.muted }}>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {config.items.map((item) => (
        <MinimalLineItem
          key={item.id}
          item={item}
          theme={theme}
          disabled={isMutating}
          imageRadius={imageRadius}
          showUnitPrice={lineItem?.showUnitPrice !== false}
          showRemove={lineItem?.showRemove !== false}
        />
      ))}
      {coupon?.visible !== false && config.couponCode && (
        <StudioCartPartOutline part="cartCoupon" highlightPart={studioHighlightPart}>
        <div
          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs"
          style={{ backgroundColor: theme.background, border: `1px solid ${theme.border}` }}
        >
          <span className="font-medium">{config.couponCode}</span>
          <span style={{ color: theme.success }}>{config.couponSavings}</span>
        </div>
        </StudioCartPartOutline>
      )}
    </div>
  )
}

function MinimalLineItem({
  item,
  theme,
  disabled,
  imageRadius,
  showUnitPrice,
  showRemove,
}: {
  item: CartDrawerConfig['items'][number]
  theme: CartDrawerTheme
  disabled?: boolean
  imageRadius: number
  showUnitPrice: boolean
  showRemove: boolean
}) {
  const orderCart = useOrderCartOptional()

  return (
    <div
      className="flex gap-3 rounded-xl p-3"
      style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}
    >
      <div className="flex-shrink-0 overflow-hidden" style={{ borderRadius: imageRadius }}>
        <RemoteImage
          src={item.imageUrl}
          alt={item.name}
          width={64}
          height={64}
          className="h-16 w-16 object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-snug">{item.name}</h3>
          <span className="flex-shrink-0 text-sm font-semibold">
            {formatPrice(item.unitPrice * item.quantity)}
          </span>
        </div>
        {showUnitPrice && (
        <p className="mt-0.5 text-xs" style={{ color: theme.muted }}>
          {formatPrice(item.unitPrice)} × {item.quantity}
        </p>
        )}
        <div className="mt-2 flex items-center gap-1.5">
          <MinimalQtyBtn
            disabled={disabled || item.quantity <= 1}
            onClick={() => void orderCart?.updateItemQuantity(item.id, item.quantity - 1)}
            theme={theme}
          >
            −
          </MinimalQtyBtn>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <MinimalQtyBtn
            disabled={disabled}
            onClick={() => void orderCart?.updateItemQuantity(item.id, item.quantity + 1)}
            theme={theme}
          >
            +
          </MinimalQtyBtn>
          {showRemove && (
          <button
            type="button"
            disabled={disabled}
            className="ml-auto rounded-md px-2 py-1 text-[11px] disabled:opacity-30"
            style={{ color: theme.muted }}
            onClick={() => void orderCart?.removeItem(item.id)}
          >
            Remove
          </button>
          )}
        </div>
      </div>
    </div>
  )
}

function MinimalQtyBtn({
  children,
  disabled,
  onClick,
  theme,
}: {
  children: ReactNode
  disabled?: boolean
  onClick: () => void
  theme: CartDrawerTheme
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md border text-sm font-medium disabled:opacity-30"
      style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.background }}
    >
      {children}
    </button>
  )
}
