export type DevicePresetId = 'desktop' | 'tablet' | 'mobile' | 'custom'

export type DevicePreset = {
  id: DevicePresetId
  label: string
  width: number
  height: number
  icon: string
}

export const DEVICE_PRESETS: Record<Exclude<DevicePresetId, 'custom'>, DevicePreset> = {
  desktop: {
    id: 'desktop',
    label: 'Desktop',
    width: 1440,
    height: 900,
    icon: 'solar:monitor-bold-duotone',
  },
  tablet: {
    id: 'tablet',
    label: 'Tablet',
    width: 768,
    height: 1024,
    icon: 'solar:tablet-bold-duotone',
  },
  mobile: {
    id: 'mobile',
    label: 'Mobile',
    width: 390,
    height: 844,
    icon: 'solar:smartphone-bold-duotone',
  },
}

export const ALL_DEVICE_IDS = ['desktop', 'tablet', 'mobile'] as const

export type AllDeviceId = (typeof ALL_DEVICE_IDS)[number]
