'use client'

import { Fragment } from 'react'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { CartDrawerConfig, CartDrawerTheme } from '@/components/cart/types'

type Props = {
  steps: CartDrawerConfig['steps']
  activeStep: number
  theme: CartDrawerTheme
  onStepClick: (index: number) => void
}

export function CartStepNavWarm({ steps, activeStep, theme, onStepClick }: Props) {
  return (
    <nav aria-label="Order steps">
      <ol className="flex w-full items-center">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep
          const isActive = index === activeStep
          const isFuture = index > activeStep
          const connectorFilled = index > 0 && index <= activeStep

          return (
            <Fragment key={step.id}>
              {index > 0 && (
                <li role="presentation" aria-hidden="true" className="min-w-[8px] flex-1">
                  <div
                    className="h-1 w-full rounded-full transition-colors"
                    style={{ backgroundColor: connectorFilled ? theme.accent : theme.border }}
                  />
                </li>
              )}
              <li>
                <button
                  type="button"
                  disabled={isFuture}
                  onClick={() => !isFuture && onStepClick(index)}
                  className="group flex flex-col items-center p-1 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shadow-sm transition-all"
                    style={
                      isCompleted
                        ? { backgroundColor: theme.accent, color: '#fff' }
                        : isActive
                          ? {
                              backgroundColor: `${theme.accent}15`,
                              color: theme.accent,
                              boxShadow: `0 0 0 2px ${theme.accent}`,
                            }
                          : { backgroundColor: theme.stepInactiveBg, color: theme.stepInactiveText }
                    }
                  >
                    {isCompleted ? <DynamicIcon icon="lucide:check" size={14} /> : index + 1}
                  </span>
                  <span
                    className="mt-1.5 text-[10px] font-semibold"
                    style={{ color: isActive ? theme.accent : theme.muted }}
                  >
                    {step.label}
                  </span>
                </button>
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
