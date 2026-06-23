'use client'

import type { ReactNode } from 'react'
import { DynamicIcon } from '@/components/ui/DynamicIcon'

type ModalBackdropProps = {
  onClose: () => void
  children: ReactNode
}

export function ModalBackdrop({ onClose, children }: ModalBackdropProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-2 backdrop-blur-md animate-fade-in sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="relative mx-auto w-full max-w-lg animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

type ModalCloseButtonProps = {
  onClose: () => void
  backgroundColor: string
  color: string
  borderColor: string
}

export function ModalCloseButton({ onClose, backgroundColor, color, borderColor }: ModalCloseButtonProps) {
  return (
    <button
      type="button"
      aria-label="Close modal"
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
      className="absolute right-2 top-2 z-30 rounded-full p-1.5 shadow-lg transition-all hover:scale-110 hover:rotate-90 sm:right-4 sm:top-4 sm:p-2"
      style={{ backgroundColor, color, border: `2px solid ${borderColor}` }}
    >
      <DynamicIcon icon="lucide:x" size={16} className="sm:h-[18px] sm:w-[18px]" />
    </button>
  )
}
