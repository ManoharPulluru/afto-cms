'use client'

import type { CartDrawerConfig, CartDrawerTheme } from '@/components/cart/types'
import { CartBillFooter } from '@/components/cart/CartBillFooter'
import { CartDetailsForm } from '@/components/cart/CartDetailsForm'
import { CartDeliveryStep } from '@/components/cart/CartDeliveryStep'
import { CartPaymentStep } from '@/components/cart/CartPaymentStep'
import { CartStepNavBistro } from '@/components/cart/nav/CartStepNavBistro'
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

export function CartDrawerDarkPanel({
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
      className={`relative z-20 ml-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden sm:max-w-lg ${className}`}
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        borderLeft: `1px solid ${theme.accent}33`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-40"
        style={{ background: `linear-gradient(to bottom, ${theme.accent}18, transparent)` }}
      />

      {header?.visible !== false && (
      <StudioCartPartOutline part="cartDrawerHeader" highlightPart={studioHighlightPart}>
      <header
        className="relative flex flex-shrink-0 items-start justify-between border-b px-5 py-4"
        style={{ borderColor: theme.border }}
      >
        <div className="min-w-0 pr-10">
          <h1 className="text-xl font-semibold tracking-tight">
            {flow.headerTitle}
          </h1>
          {header?.showOrderBadge !== false && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
              style={{ backgroundColor: `${theme.accent}22`, color: theme.accent }}
            >
              <DynamicIcon icon="lucide:receipt" size={13} />
              {header?.orderBadgePrefix ?? 'Order #'}{config.orderNumber}
            </span>
            <span
              className="rounded-lg px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: theme.surface, color: theme.text }}
            >
              {flow.itemCount} {flow.itemCount === 1 ? itemSuffix.replace(/s$/, '') : itemSuffix}
            </span>
          </div>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:opacity-80"
            aria-label="Close cart"
            onClick={onClose}
            style={{ backgroundColor: theme.surface, color: theme.text }}
          >
            <DynamicIcon icon="lucide:x" size={18} />
          </button>
        )}
      </header>
      </StudioCartPartOutline>
      )}

      {stepNav?.visible !== false && (
      <StudioCartPartOutline part="cartStepNav" highlightPart={studioHighlightPart}>
      <div className="flex-shrink-0 border-b" style={{ borderColor: theme.border }}>
        <CartStepNavBistro
          steps={config.steps}
          activeStep={flow.activeStep}
          theme={stepNav?.accentColor ? { ...theme, accent: stepNav.accentColor } : theme}
          onStepClick={flow.setActiveStep}
        />
      </div>
      </StudioCartPartOutline>
      )}

      <StudioCartPartOutline part="cartLineItem" highlightPart={studioHighlightPart} className="relative min-h-0 flex-1 overflow-hidden">
      <main className="h-full overflow-y-auto px-5 py-4" style={{ scrollbarWidth: 'none' }}>
        {flow.activeStep === 1 && (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: theme.muted }}>
              We&apos;ll use this to reach you about your order.
            </p>
            <CartDetailsForm
              theme={theme}
              accent={theme.accent}
              form={flow.detailsForm.form}
              onChange={flow.detailsForm.setForm}
              isLoading={flow.detailsForm.isLoading}
              error={flow.detailsForm.error}
              onRetry={() => void flow.detailsForm.loadProfile()}
            />
          </div>
        )}
        {flow.activeStep === 0 && parts?.lineItem?.visible !== false && (
          <BistroCartStep config={config} theme={theme} isLoading={isLoading} isMutating={isMutating} />
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
          className="flex-shrink-0 border-t px-6 py-4"
          style={{ borderColor: theme.border, backgroundColor: theme.footerBg }}
        >
          {coupon?.visible !== false && config.couponCode && (coupon?.showOnCartStepOnly === false || flow.activeStep === 0) && (
            <StudioCartPartOutline part="cartCoupon" highlightPart={studioHighlightPart} className="mb-4">
            <div
              className="flex items-center justify-between rounded-lg border px-3 py-2.5"
              style={{ borderColor: `${theme.accent}44`, backgroundColor: `${theme.accent}12` }}
            >
              <span className="text-sm font-medium" style={{ color: theme.accent }}>{config.couponCode}</span>
              <span className="text-xs" style={{ color: theme.text }}>{config.couponSavings}</span>
            </div>
            </StudioCartPartOutline>
          )}

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
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              backgroundColor: cta?.backgroundColor || theme.accent,
              color: cta?.textColor ?? '#ffffff',
            }}
          >
            {flow.footerLoading ? flow.savingLabel : flow.footerButtonLabel}
            <DynamicIcon icon="lucide:arrow-right" size={14} />
          </button>
          )}
          </StudioCartPartOutline>
        </footer>
      )}
    </div>
  )
}

function BistroCartStep({
  config,
  theme,
  isLoading,
  isMutating,
}: {
  config: CartDrawerConfig
  theme: CartDrawerTheme
  isLoading?: boolean
  isMutating?: boolean
}) {
  const lineItem = config.parts?.lineItem
  const emptyMessage = lineItem?.emptyMessage ?? 'Nothing in your cart yet'
  const loadingMessage = lineItem?.loadingMessage ?? 'Preparing your order…'
  const imageRadius = lineItem?.imageRadius ?? 8

  if (isLoading && config.items.length === 0) {
    return (
      <p className="py-12 text-center text-sm" style={{ color: theme.muted }}>
        {loadingMessage}
      </p>
    )
  }

  if (config.items.length === 0) {
    return (
      <p className="py-12 text-center text-sm" style={{ color: theme.muted }}>
        {emptyMessage}
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {config.items.map((item) => (
        <BistroLineItem
          key={item.id}
          item={item}
          theme={theme}
          disabled={isMutating}
          imageRadius={imageRadius}
          showUnitPrice={lineItem?.showUnitPrice !== false}
          showRemove={lineItem?.showRemove !== false}
        />
      ))}
    </ul>
  )
}

function BistroLineItem({
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
    <li
      className="flex items-center gap-4 rounded-xl p-3"
      style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}
    >
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{ borderRadius: imageRadius, border: `1px solid ${theme.border}` }}
      >
        <RemoteImage src={item.imageUrl} alt={item.name} width={56} height={56} className="h-14 w-14 object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold leading-snug" style={{ color: theme.text }}>
          {item.name}
        </h3>
        {showUnitPrice && (
        <p className="mt-0.5 text-xs" style={{ color: theme.muted }}>
          {formatPrice(item.unitPrice)} each
        </p>
        )}
        <div className="mt-2.5 flex items-center gap-3">
          <button
            type="button"
            disabled={disabled || item.quantity <= 1}
            className="flex h-7 w-7 items-center justify-center rounded-md text-base font-semibold disabled:opacity-30"
            style={{ backgroundColor: `${theme.accent}22`, color: theme.accent }}
            onClick={() => void orderCart?.updateItemQuantity(item.id, item.quantity - 1)}
          >
            −
          </button>
          <span className="min-w-[20px] text-center text-sm font-semibold" style={{ color: theme.text }}>
            {item.quantity}
          </span>
          <button
            type="button"
            disabled={disabled}
            className="flex h-7 w-7 items-center justify-center rounded-md text-base font-semibold disabled:opacity-30"
            style={{ backgroundColor: `${theme.accent}22`, color: theme.accent }}
            onClick={() => void orderCart?.updateItemQuantity(item.id, item.quantity + 1)}
          >
            +
          </button>
          {showRemove && (
          <button
            type="button"
            disabled={disabled}
            className="ml-1 text-xs font-medium underline-offset-2 hover:underline disabled:opacity-30"
            style={{ color: theme.muted }}
            onClick={() => void orderCart?.removeItem(item.id)}
          >
            Remove
          </button>
          )}
        </div>
      </div>
      <span className="flex-shrink-0 text-sm font-bold" style={{ color: theme.accent }}>
        {formatPrice(item.unitPrice * item.quantity)}
      </span>
    </li>
  )
}
