'use client'

import type { CartDrawerConfig, CartDrawerTheme } from '@/components/cart/types'

type Props = {
  steps: CartDrawerConfig['steps']
  activeStep: number
  theme: CartDrawerTheme
  onStepClick: (index: number) => void
}

export function CartStepNavPills({ steps, activeStep, theme, onStepClick }: Props) {
  return (
    <nav aria-label="Order steps" className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: theme.surface }}>
      {steps.map((step, index) => {
        const isCompleted = index < activeStep
        const isActive = index === activeStep
        const isFuture = index > activeStep

        return (
          <button
            key={step.id}
            type="button"
            disabled={isFuture}
            onClick={() => !isFuture && onStepClick(index)}
            className="flex-1 rounded-md px-2 py-2 text-center text-[11px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40"
            style={
              isActive
                ? { backgroundColor: theme.background, color: theme.text, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }
                : isCompleted
                  ? { color: theme.accent }
                  : { color: theme.muted }
            }
            aria-current={isActive ? 'step' : undefined}
          >
            {step.label}
          </button>
        )
      })}
    </nav>
  )
}
