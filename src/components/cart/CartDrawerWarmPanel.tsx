'use client'

import type { ReactNode } from 'react'
import type { CartDrawerConfig, CartDrawerTheme } from '@/components/cart/types'
import { CartBillFooter } from '@/components/cart/CartBillFooter'
import { CartDetailsForm } from '@/components/cart/CartDetailsForm'
import { CartDeliveryStep } from '@/components/cart/CartDeliveryStep'
import { CartPaymentStep } from '@/components/cart/CartPaymentStep'
import { CartStepNavWarm } from '@/components/cart/nav/CartStepNavWarm'
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

export function CartDrawerWarmPanel({
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
  const coupon = parts?.coupon
  const style = parts?.style
  const stepNav = parts?.stepNav
  const showAccentBar = style?.showTopAccentBar ?? true
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
      className={`relative z-20 ml-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden rounded-l-3xl shadow-2xl sm:max-w-lg ${className}`}
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {showAccentBar && (
        <div className="h-1.5 flex-shrink-0" style={{ backgroundColor: theme.accent }} />
      )}

      {header?.visible !== false && (
      <StudioCartPartOutline part="cartDrawerHeader" highlightPart={studioHighlightPart}>
      <header className="flex flex-shrink-0 items-center justify-between px-5 py-4">
        <div>
          {header?.eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: theme.muted }}>
            {header.eyebrow}
          </p>
          )}
          <h1 className="text-xl font-bold">
            {flow.headerTitle}
            {header?.showOrderBadge !== false && (
            <span
              className="ml-2 rounded-full px-2 py-0.5 text-xs font-bold"
              style={{ backgroundColor: `${theme.accent}18`, color: theme.accent }}
            >
              {header?.orderBadgePrefix ?? 'Order #'}{config.orderNumber}
            </span>
            )}
          </h1>
        </div>
        {onClose && (
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: theme.surface, color: theme.muted }}
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
      <StudioCartPartOutline part="cartStepNav" highlightPart={studioHighlightPart} className="flex-shrink-0 px-5 pb-4">
      <div className="pb-0">
        <CartStepNavWarm
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
        {parts?.lineItem?.visible !== false &&
          renderStep(flow, config, theme, isLoading, isMutating, studioHighlightPart)}
      </main>
      </StudioCartPartOutline>

      {flow.activeStep < 3 && (
        <footer
          className="flex-shrink-0 border-t px-5 py-4"
          style={{ borderColor: theme.border, backgroundColor: theme.footerBg }}
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
          <StudioCartPartOutline part="cartCta" highlightPart={studioHighlightPart} className={bill?.visible !== false ? 'mt-4' : ''}>
          {cta?.visible !== false && (
          <button
            type="button"
            disabled={flow.footerDisabled}
            onClick={() => void flow.handleFooterAction()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
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

function renderStep(
  flow: ReturnType<typeof useCartDrawerFlow>,
  config: CartDrawerConfig,
  theme: CartDrawerTheme,
  isLoading?: boolean,
  isMutating?: boolean,
  studioHighlightPart?: string,
) {
  if (flow.activeStep === 0) {
    return (
      <WarmCartStep
        config={config}
        theme={theme}
        itemCount={flow.itemCount}
        isLoading={isLoading}
        isMutating={isMutating}
        studioHighlightPart={studioHighlightPart}
      />
    )
  }
  if (flow.activeStep === 1) {
    return (
      <CartDetailsForm
        theme={theme}
        accent={theme.accent}
        form={flow.detailsForm.form}
        onChange={flow.detailsForm.setForm}
        isLoading={flow.detailsForm.isLoading}
        error={flow.detailsForm.error}
        onRetry={() => void flow.detailsForm.loadProfile()}
      />
    )
  }
  if (flow.activeStep === 2) {
    return (
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
    )
  }
  if (flow.activeStep === 3) {
    return (
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
    )
  }
  return null
}

function WarmCartStep({
  config,
  theme,
  itemCount,
  isLoading,
  isMutating,
  studioHighlightPart,
}: {
  config: CartDrawerConfig
  theme: CartDrawerTheme
  itemCount: number
  isLoading?: boolean
  isMutating?: boolean
  studioHighlightPart?: string
  studioPreviewStep?: number
}) {
  const lineItem = config.parts?.lineItem
  const coupon = config.parts?.coupon
  const emptyMessage = lineItem?.emptyMessage ?? 'Your cart is empty'
  const loadingMessage = lineItem?.loadingMessage ?? 'Loading cart…'
  const imageRadius = lineItem?.imageRadius ?? 12
  const itemSuffix = config.parts?.header?.itemCountSuffix ?? 'items'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">
          {itemCount} {itemCount === 1 ? itemSuffix.replace(/s$/, '') : itemSuffix}
        </span>
      </div>

      <div className="space-y-3">
        {isLoading && config.items.length === 0 ? (
          <div className="rounded-2xl p-8 text-center text-sm" style={{ color: theme.muted, backgroundColor: theme.surface }}>
            {loadingMessage}
          </div>
        ) : config.items.length === 0 ? (
          <div className="rounded-2xl p-8 text-center text-sm" style={{ color: theme.muted, backgroundColor: theme.surface }}>
            <DynamicIcon icon="lucide:shopping-bag" size={32} className="mx-auto mb-2 opacity-40" />
            {emptyMessage}
          </div>
        ) : (
          config.items.map((item) => (
            <WarmLineItem
              key={item.id}
              item={item}
              theme={theme}
              disabled={isMutating}
              imageRadius={imageRadius}
              showUnitPrice={lineItem?.showUnitPrice !== false}
              showRemove={lineItem?.showRemove !== false}
            />
          ))
        )}
      </div>

      {coupon?.visible !== false && config.couponCode && (
        <StudioCartPartOutline part="cartCoupon" highlightPart={studioHighlightPart}>
        <div
          className="flex items-center gap-3 rounded-2xl p-3"
          style={{ backgroundColor: theme.successBg, border: `1px solid ${theme.successBorder}` }}
        >
          <DynamicIcon icon="lucide:tag" size={18} style={{ color: theme.success }} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold" style={{ color: theme.success }}>
              {config.couponCode} applied
            </p>
            <p className="text-[11px]" style={{ color: theme.success }}>{config.couponSavings}</p>
          </div>
        </div>
        </StudioCartPartOutline>
      )}
    </div>
  )
}

function WarmLineItem({
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
      className="flex gap-3 rounded-2xl p-3"
      style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}
    >
      <div className="flex-shrink-0 overflow-hidden" style={{ borderRadius: imageRadius }}>
      <RemoteImage
        src={item.imageUrl}
        alt={item.name}
        width={72}
        height={72}
        className="h-[72px] w-[72px] object-cover"
      />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold leading-tight">{item.name}</h3>
        {showUnitPrice && (
        <p className="mt-0.5 text-xs" style={{ color: theme.muted }}>
          {formatPrice(item.unitPrice)} each
        </p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <div
            className="inline-flex items-center gap-2 rounded-full px-1 py-0.5"
            style={{ backgroundColor: theme.background, border: `1px solid ${theme.border}` }}
          >
            <QtyBtn
              label="Decrease"
              disabled={disabled || item.quantity <= 1}
              onClick={() => void orderCart?.updateItemQuantity(item.id, item.quantity - 1)}
              theme={theme}
            >
              −
            </QtyBtn>
            <span className="min-w-[20px] text-center text-sm font-bold">{item.quantity}</span>
            <QtyBtn
              label="Increase"
              disabled={disabled}
              onClick={() => void orderCart?.updateItemQuantity(item.id, item.quantity + 1)}
              theme={theme}
            >
              +
            </QtyBtn>
          </div>
          {showRemove && (
          <button
            type="button"
            disabled={disabled}
            className="ml-auto text-xs underline disabled:opacity-40"
            style={{ color: theme.muted }}
            onClick={() => void orderCart?.removeItem(item.id)}
          >
            Remove
          </button>
          )}
        </div>
      </div>
      <p className="flex-shrink-0 text-sm font-bold">{formatPrice(item.unitPrice * item.quantity)}</p>
    </div>
  )
}

function QtyBtn({
  children,
  label,
  disabled,
  onClick,
  theme,
}: {
  children: ReactNode
  label: string
  disabled?: boolean
  onClick: () => void
  theme: CartDrawerTheme
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
      className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold disabled:opacity-40"
      style={{ backgroundColor: theme.accent, color: '#fff' }}
    >
      {children}
    </button>
  )
}
