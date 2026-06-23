'use client'

import type { ReactNode } from 'react'
import { StudioIcon } from '@/components/studio/builder/ui/StudioIcon'

type PanelChromeProps = {
  icon: string
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function PanelChrome({ icon, title, subtitle, action, children, className = '' }: PanelChromeProps) {
  return (
    <div className={`flex h-full min-h-0 flex-col bg-zinc-950 ${className}`}>
      <div className="flex shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-zinc-900/40 px-4 py-3 backdrop-blur-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/80 text-teal-400 ring-1 ring-zinc-700/50">
          <StudioIcon icon={icon} width={16} height={16} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold tracking-tight text-zinc-100">{title}</h2>
          {subtitle && <p className="truncate text-xs text-zinc-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
    </div>
  )
}

type SectionBlockProps = {
  label: string
  icon?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionBlock({ label, icon, action, children, className = '' }: SectionBlockProps) {
  return (
    <section className={`border-b border-zinc-800/60 px-4 py-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon && (
            <StudioIcon icon={icon} width={14} height={14} className="text-zinc-500" />
          )}
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{label}</span>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

type IconButtonProps = {
  icon: string
  label: string
  onClick?: () => void
  variant?: 'ghost' | 'primary' | 'danger' | 'muted'
  size?: 'sm' | 'md'
  disabled?: boolean
}

const btnVariants = {
  ghost: 'border-zinc-700/80 bg-zinc-900/50 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white',
  primary: 'border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 hover:border-teal-400/50',
  danger: 'border-red-500/20 bg-red-500/5 text-red-300 hover:bg-red-500/10',
  muted: 'border-transparent bg-transparent text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300',
}

export function IconButton({
  icon,
  label,
  onClick,
  variant = 'ghost',
  size = 'md',
  disabled,
}: IconButtonProps) {
  const sizeClass = size === 'sm' ? 'h-7 gap-1.5 px-2 text-xs' : 'h-8 gap-2 px-3 text-sm'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${sizeClass} ${btnVariants[variant]}`}
    >
      <StudioIcon icon={icon} width={size === 'sm' ? 14 : 16} height={size === 'sm' ? 14 : 16} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

type EmptyStateProps = {
  icon: string
  title: string
  description: string
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 ring-1 ring-zinc-800">
        <StudioIcon icon={icon} width={28} height={28} className="text-zinc-600" />
      </div>
      <p className="text-sm font-medium text-zinc-400">{title}</p>
      <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-zinc-600">{description}</p>
    </div>
  )
}
