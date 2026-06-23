'use client'

import dynamic from 'next/dynamic'

type StudioIconProps = {
  icon: string
  className?: string
  width?: number
  height?: number
}

const Icon = dynamic(() => import('@iconify/react').then((mod) => mod.Icon), {
  ssr: false,
  loading: () => <span className="inline-block h-[18px] w-[18px] shrink-0" aria-hidden />,
})

export function StudioIcon({ icon, className = '', width = 18, height = 18 }: StudioIconProps) {
  return <Icon icon={icon} width={width} height={height} className={className} aria-hidden />
}
