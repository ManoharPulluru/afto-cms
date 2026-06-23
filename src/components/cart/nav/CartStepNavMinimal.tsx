'use client'

import type { CartDrawerConfig, CartDrawerTheme } from '@/components/cart/types'

type Props = {
  steps: CartDrawerConfig['steps']
  activeStep: number
  theme: CartDrawerTheme
  onStepClick: (index: number) => void
}

export function CartStepNavMinimal({ steps, activeStep, theme, onStepClick }: Props) {
  return (
    <nav aria-label="Order steps" className="flex flex-col gap-0">
      {steps.map((step, index) => {
        const isCompleted = index < activeStep
        const isActive = index === activeStep
        const isFuture = index > activeStep
        const isLast = index === steps.length - 1

        return (
          <button
            key={step.id}
            type="button"
            disabled={isFuture}
            onClick={() => !isFuture && onStepClick(index)}
            className="group relative flex items-stretch gap-3 py-2 text-left disabled:cursor-not-allowed disabled:opacity-40"
            aria-current={isActive ? 'step' : undefined}
          >
            <div className="flex flex-col items-center">
              <span
                className="flex h-2.5 w-2.5 flex-shrink-0 rounded-full transition-all"
                style={{
                  backgroundColor: isActive || isCompleted ? theme.text : theme.border,
                  transform: isActive ? 'scale(1.3)' : 'scale(1)',
                }}
              />
              {!isLast && (
                <span
                  className="mt-1 w-px flex-1 min-h-[20px]"
                  style={{
                    backgroundColor: isCompleted ? theme.text : theme.border,
                  }}
                />
              )}
            </div>
            <div className="pb-3 pt-0.5">
              <span
                className="block text-[10px] font-medium uppercase tracking-[0.2em]"
                style={{ color: isActive ? theme.text : theme.muted }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span
                className="block text-sm font-medium"
                style={{
                  color: isActive ? theme.text : theme.muted,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {step.label}
              </span>
            </div>
          </button>
        )
      })}
    </nav>
  )
}
