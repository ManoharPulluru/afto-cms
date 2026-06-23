'use client'

import type { CartDrawerConfig, CartDrawerTheme } from '@/components/cart/types'
import { CartStepNavWarm } from '@/components/cart/nav/CartStepNavWarm'

type StudioCartStepBarProps = {
  steps: CartDrawerConfig['steps']
  activeStep: number
  theme: CartDrawerTheme
  onStepChange: (step: number) => void
}

/** Studio-only step switcher so each checkout screen can be customized easily. */
export function StudioCartStepBar({
  steps,
  activeStep,
  theme,
  onStepChange,
}: StudioCartStepBarProps) {
  return (
    <div
      className="shrink-0 border-b px-3 py-2"
      style={{ borderColor: theme.border, backgroundColor: theme.surface }}
    >
      <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-teal-400/90">
        Preview checkout step
      </p>
      <CartStepNavWarm
        steps={steps}
        activeStep={activeStep}
        theme={theme}
        onStepClick={onStepChange}
      />
    </div>
  )
}
