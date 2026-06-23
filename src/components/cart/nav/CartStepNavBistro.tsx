'use client'

import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { CartDrawerConfig, CartDrawerTheme } from '@/components/cart/types'

type Props = {
  steps: CartDrawerConfig['steps']
  activeStep: number
  theme: CartDrawerTheme
  onStepClick: (index: number) => void
}

const STEP_ICONS = ['lucide:shopping-bag', 'lucide:user', 'lucide:truck', 'lucide:credit-card'] as const

export function CartStepNavBistro({ steps, activeStep, theme, onStepClick }: Props) {
  return (
    <nav aria-label="Order steps" className="grid grid-cols-4 gap-0">
      {steps.map((step, index) => {
        const isCompleted = index < activeStep
        const isActive = index === activeStep
        const isFuture = index > activeStep
        const icon = STEP_ICONS[index] ?? 'lucide:circle'

        return (
          <button
            key={step.id}
            type="button"
            disabled={isFuture}
            onClick={() => !isFuture && onStepClick(index)}
            className="relative flex flex-col items-center gap-1.5 border-b-2 px-1 py-3.5 transition-all disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              borderColor: isActive || isCompleted ? theme.accent : 'transparent',
              backgroundColor: isActive ? `${theme.accent}14` : 'transparent',
            }}
            aria-current={isActive ? 'step' : undefined}
          >
            <DynamicIcon
              icon={icon}
              size={18}
              style={{ color: isActive || isCompleted ? theme.accent : theme.muted }}
            />
            <span
              className="text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: isActive ? theme.text : theme.muted }}
            >
              {step.label}
            </span>
            {isCompleted && (
              <span
                className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full"
                style={{ backgroundColor: theme.accent }}
              >
                <DynamicIcon icon="lucide:check" size={8} style={{ color: '#1a1d24' }} />
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
