'use client'

import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { CartDrawerTheme } from '@/components/cart/types'
import type { DeliveryMethod } from '@/lib/types/delivery'

type CartDeliveryStepProps = {
  theme: CartDrawerTheme
  accent: string
  method: DeliveryMethod
  onMethodChange: (method: DeliveryMethod) => void
  homeDeliveryAvailable: boolean
  unavailableMessage?: string | null
  storeAddress: string
  pickupInstructions: string
  onPickupInstructionsChange: (value: string) => void
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

export function CartDeliveryStep({
  theme,
  accent,
  method,
  onMethodChange,
  homeDeliveryAvailable,
  unavailableMessage,
  storeAddress,
  pickupInstructions,
  onPickupInstructionsChange,
  isLoading,
  error,
  onRetry,
}: CartDeliveryStepProps) {
  const pickupSelected = method === 'pickup'
  const deliverySelected = method === 'delivery'

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

      <h2 className="text-lg font-bold sm:text-xl" style={{ color: theme.text }}>
        Delivery Options
      </h2>

      {isLoading ? (
        <div className="py-6 text-center text-sm" style={{ color: theme.muted }}>
          Checking delivery options…
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={() => onMethodChange('pickup')}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-semibold transition-all sm:gap-3 sm:p-4"
              style={
                pickupSelected
                  ? {
                      backgroundColor: accent,
                      borderColor: accent,
                      color: '#ffffff',
                    }
                  : {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      color: theme.muted,
                    }
              }
            >
              <DynamicIcon icon="lucide:package" size={18} className="sm:h-5 sm:w-5" />
              <span>Store Pickup</span>
            </button>

            <button
              type="button"
              disabled={!homeDeliveryAvailable}
              onClick={() => homeDeliveryAvailable && onMethodChange('delivery')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-semibold transition-all sm:gap-3 sm:p-4 disabled:cursor-not-allowed"
              style={
                deliverySelected && homeDeliveryAvailable
                  ? {
                      backgroundColor: accent,
                      borderColor: accent,
                      color: '#ffffff',
                    }
                  : {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      color: theme.muted,
                      opacity: homeDeliveryAvailable ? 1 : 0.55,
                      cursor: homeDeliveryAvailable ? 'pointer' : 'not-allowed',
                    }
              }
            >
              <DynamicIcon icon="lucide:truck" size={18} className="sm:h-5 sm:w-5" />
              <div className="flex flex-col items-center leading-tight">
                <span>Home Delivery</span>
                {!homeDeliveryAvailable && (
                  <span className="mt-0.5 text-[10px] font-normal">Not available</span>
                )}
              </div>
            </button>
          </div>

          {!homeDeliveryAvailable && unavailableMessage && (
            <div
              className="flex items-start gap-2.5 rounded-lg px-3 py-2.5"
              style={{ backgroundColor: theme.surface }}
            >
              <DynamicIcon
                icon="lucide:circle-alert"
                size={15}
                className="mt-0.5 flex-shrink-0"
                style={{ color: theme.muted }}
              />
              <p className="text-xs font-medium" style={{ color: theme.text }}>
                {unavailableMessage}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {pickupSelected && storeAddress && (
              <div className="rounded-lg p-3 sm:p-4" style={{ backgroundColor: theme.surface }}>
                <h3 className="mb-2 text-xs font-bold sm:text-sm" style={{ color: theme.text }}>
                  Store Address
                </h3>
                <p
                  className="flex items-start gap-2 text-xs sm:text-sm"
                  style={{ color: theme.muted }}
                >
                  <DynamicIcon
                    icon="lucide:map-pin"
                    size={16}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: accent }}
                  />
                  <span>{storeAddress}</span>
                </p>
              </div>
            )}

            {pickupSelected && (
              <div
                className="rounded-xl p-3"
                style={{
                  backgroundColor: `${accent}0D`,
                  borderWidth: '1.5px 1.5px 1.5px 3px',
                  borderStyle: 'solid',
                  borderColor: `${accent}30 ${accent}30 ${accent}30 ${accent}`,
                }}
              >
                <div className="mb-2 flex items-center gap-1.5">
                  <DynamicIcon icon="lucide:message-square-plus" size={14} style={{ color: accent }} />
                  <span className="text-xs font-semibold" style={{ color: accent }}>
                    Pickup Instructions
                  </span>
                  <span className="text-[10px]" style={{ color: theme.muted }}>
                    (optional)
                  </span>
                </div>
                <textarea
                  rows={2}
                  placeholder="Any special instructions for your pickup..."
                  value={pickupInstructions}
                  onChange={(e) => onPickupInstructionsChange(e.target.value)}
                  className="w-full resize-none rounded-lg border px-2.5 py-2 text-xs outline-none"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: `${accent}30`,
                    color: theme.text,
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
