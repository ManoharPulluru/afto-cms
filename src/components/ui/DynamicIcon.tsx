'use client'

import dynamic from 'next/dynamic'

const Icon = dynamic(() => import('@iconify/react').then((mod) => mod.Icon), {
  ssr: false,
  loading: () => <span className="inline-block shrink-0" aria-hidden />,
})

type DynamicIconProps = {
  icon?: string
  size?: number
  className?: string
  style?: React.CSSProperties
}

export function DynamicIcon({ icon, size = 18, className = '', style }: DynamicIconProps) {
  if (!icon) return null
  return <Icon icon={icon} width={size} height={size} className={className} style={style} aria-hidden />
}
