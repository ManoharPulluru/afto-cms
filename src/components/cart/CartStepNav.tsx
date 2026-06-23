'use client'

import { Fragment } from 'react'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { CartDrawerConfig, CartDrawerTheme } from '@/components/cart/types'

type CartStepNavProps = {
  steps: CartDrawerConfig['steps']
  activeStep: number
  theme: CartDrawerTheme
  onStepClick: (index: number) => void
}

export function CartStepNav({ steps, activeStep, theme, onStepClick }: CartStepNavProps) {
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
                <li
                  role="presentation"
                  aria-hidden="true"
                  className="min-w-[8px] flex-1 sm:min-w-[12px]"
                >
                  <div
                    className="h-0.5 w-full transition-colors"
                    style={{
                      backgroundColor: connectorFilled ? theme.accent : theme.border,
                    }}
                  />
                </li>
              )}
              <li>
                <button
                  type="button"
                  disabled={isFuture}
                  onClick={() => !isFuture && onStepClick(index)}
                  className="group flex flex-col items-center justify-center p-1 transition-opacity disabled:cursor-not-allowed disabled:opacity-50 sm:p-2"
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all sm:h-8 sm:w-8 sm:text-sm"
                    style={
                      isCompleted
                        ? {
                            backgroundColor: theme.accent,
                            color: '#ffffff',
                            borderColor: theme.accent,
                          }
                        : isActive
                          ? {
                              backgroundColor: theme.background,
                              color: theme.accent,
                              borderColor: theme.accent,
                              borderWidth: 2,
                            }
                          : {
                              backgroundColor: theme.stepInactiveBg,
                              color: theme.stepInactiveText,
                              borderColor: theme.border,
                            }
                    }
                  >
                    {isCompleted ? (
                      <DynamicIcon icon="lucide:check" size={14} className="sm:h-4 sm:w-4" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className="mt-1 whitespace-nowrap text-[10px] font-semibold sm:mt-2 sm:text-xs md:text-sm"
                    style={{
                      color: isActive ? theme.accent : theme.text,
                      fontWeight: isActive ? 600 : 500,
                    }}
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
