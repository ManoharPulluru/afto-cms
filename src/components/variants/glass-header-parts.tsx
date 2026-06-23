'use client'

import type { VariantComponentProps } from '@/lib/registry/types'
import { DynamicIcon } from '@/components/ui/DynamicIcon'

/** Mobile search icon button — props from search node */
export function GlassMobileSearchBtn({ props }: VariantComponentProps) {
  const icon = (props.mobileSearchIcon as string) || 'solar:magnifer-linear'
  const color = (props.mobileSearchIconColor as string) || '#0F1419'

  return (
    <button type="button" className="rounded-lg p-2 transition hover:bg-black/[0.04]" style={{ color }} aria-label="Search">
      <DynamicIcon icon={icon} size={20} />
    </button>
  )
}
