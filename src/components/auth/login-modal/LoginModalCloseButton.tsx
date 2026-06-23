'use client'

import { DynamicIcon } from '@/components/ui/DynamicIcon'

type LoginModalCloseButtonProps = {
  onClose: () => void
  backgroundColor?: string
  color?: string
  borderColor?: string
}

/** Close control rendered inside the modal card (top-right). */
export function LoginModalCloseButton({
  onClose,
  backgroundColor = '#ffffff',
  color = '#1A1F2E',
  borderColor = '#E8F5E8',
}: LoginModalCloseButtonProps) {
  return (
    <button
      type="button"
      aria-label="Close modal"
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
      className="absolute right-2 top-2 z-30 rounded-full p-1.5 shadow-lg transition-all hover:scale-110 hover:rotate-90 sm:right-3 sm:top-3 sm:p-2"
      style={{ backgroundColor, color, border: `2px solid ${borderColor}` }}
    >
      <DynamicIcon icon="lucide:x" size={16} className="sm:h-[18px] sm:w-[18px]" />
    </button>
  )
}
