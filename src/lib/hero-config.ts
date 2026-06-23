import type { PropField } from '@/lib/registry'

/** Standard bottom-button hero (V1–V3). */
export const HERO_STANDARD_SLOTS = [
  'heroMedia',
  'heroOverlay',
  'heroTitle',
  'heroSubtitle',
  'heroButton',
] as const

/** Bistro centered overlay hero (V4). */
export const HERO_BISTRO_SLOTS = [
  'heroMedia',
  'heroOverlay',
  'heroLogo',
  'heroEyebrow',
  'heroTitle',
  'heroButton',
] as const

export const HERO_VARIANT_SLOTS: Record<string, readonly string[]> = {
  HeroV1: HERO_STANDARD_SLOTS,
  HeroV2: HERO_STANDARD_SLOTS,
  HeroV3: HERO_STANDARD_SLOTS,
  HeroV4: HERO_BISTRO_SLOTS,
}

export type HeroStandardChildType = (typeof HERO_STANDARD_SLOTS)[number]
export type HeroBistroChildType = (typeof HERO_BISTRO_SLOTS)[number] | 'heroFeature'
export type HeroChildType = HeroStandardChildType | 'heroLogo' | 'heroEyebrow' | 'heroFeature'

export const HERO_CHILD_META: Record<string, { label: string }> = {
  heroMedia: { label: 'Media' },
  heroOverlay: { label: 'Overlay' },
  heroTitle: { label: 'Title' },
  heroSubtitle: { label: 'Subtitle' },
  heroButton: { label: 'Button' },
  heroLogo: { label: 'Logo' },
  heroEyebrow: { label: 'Eyebrow' },
  heroFeature: { label: 'Feature' },
}

const SHARED_MEDIA_FIELDS: PropField[] = [
  {
    key: 'mediaType',
    label: 'Media type',
    type: 'select',
    options: [
      { value: 'image', label: 'Image' },
      { value: 'video', label: 'Video' },
    ],
  },
  { key: 'imageUrl', label: 'Image URL', type: 'url' },
  { key: 'videoUrl', label: 'Video URL', type: 'url' },
  { key: 'alt', label: 'Alt text', type: 'text' },
  {
    key: 'objectFit',
    label: 'Object fit',
    type: 'select',
    options: [
      { value: 'cover', label: 'Cover' },
      { value: 'contain', label: 'Contain' },
      { value: 'fill', label: 'Fill' },
    ],
  },
]

const HERO_FIELDS: Record<string, PropField[]> = {
  heroMedia: SHARED_MEDIA_FIELDS,
  heroOverlay: [
    { key: 'overlayColor', label: 'Overlay color', type: 'color' },
    { key: 'overlayOpacity', label: 'Overlay opacity (0–100)', type: 'number' },
    { key: 'enableGradient', label: 'Bottom gradient', type: 'boolean' },
    { key: 'gradientColor', label: 'Gradient color', type: 'color' },
  ],
  heroTitle: [
    { key: 'text', label: 'Title', type: 'text' },
    { key: 'visible', label: 'Visible', type: 'boolean' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'fontSize', label: 'Font size mobile / min (px)', type: 'number' },
    { key: 'fontSizeMobile', label: 'Font size mobile (standard px)', type: 'number' },
    { key: 'fontSizeDesktop', label: 'Font size desktop / max (px)', type: 'number' },
    { key: 'fontWeight', label: 'Font weight', type: 'number' },
    { key: 'fontFamily', label: 'Font family (bistro)', type: 'text' },
    { key: 'letterSpacing', label: 'Letter spacing (em)', type: 'number' },
    { key: 'lineHeight', label: 'Line height', type: 'number' },
    { key: 'textShadow', label: 'Text shadow CSS', type: 'text' },
    { key: 'maxWidth', label: 'Max width (px)', type: 'number' },
  ],
  heroSubtitle: [
    { key: 'text', label: 'Subtitle', type: 'textarea' },
    { key: 'visible', label: 'Visible', type: 'boolean' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'fontSize', label: 'Font size (desktop px)', type: 'number' },
    { key: 'fontSizeMobile', label: 'Font size (mobile px)', type: 'number' },
    { key: 'maxWidth', label: 'Max width (px)', type: 'number' },
  ],
  heroButton: [
    { key: 'label', label: 'Button label', type: 'text' },
    { key: 'href', label: 'Link URL', type: 'text' },
    { key: 'visible', label: 'Visible', type: 'boolean' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'borderColor', label: 'Border color', type: 'color' },
    { key: 'borderRadius', label: 'Border radius (px)', type: 'number' },
    { key: 'fontSize', label: 'Font size (desktop px)', type: 'number' },
    { key: 'fontSizeMobile', label: 'Font size (mobile px)', type: 'number' },
    { key: 'paddingX', label: 'Padding X (px)', type: 'number' },
    { key: 'paddingY', label: 'Padding Y (px)', type: 'number' },
    { key: 'letterSpacing', label: 'Letter spacing (em)', type: 'number' },
    { key: 'uppercase', label: 'Uppercase', type: 'boolean' },
    { key: 'marginBottom', label: 'Bottom margin (desktop px)', type: 'number' },
    { key: 'marginBottomMobile', label: 'Bottom margin (mobile px)', type: 'number' },
    { key: 'marginSide', label: 'Side margin (desktop px)', type: 'number' },
    { key: 'marginSideMobile', label: 'Side margin (mobile px)', type: 'number' },
  ],
  heroLogo: [
    { key: 'imageUrl', label: 'Logo URL', type: 'url' },
    { key: 'visible', label: 'Visible', type: 'boolean' },
    { key: 'widthMin', label: 'Min width (px)', type: 'number' },
    { key: 'widthMax', label: 'Max width (px)', type: 'number' },
    { key: 'widthVw', label: 'Preferred width (vw)', type: 'number' },
    { key: 'marginBottom', label: 'Bottom spacing (rem)', type: 'number' },
    { key: 'dropShadow', label: 'Drop shadow CSS', type: 'text' },
    { key: 'brightness', label: 'Brightness', type: 'number' },
  ],
  heroEyebrow: [
    { key: 'text', label: 'Eyebrow text', type: 'text' },
    { key: 'visible', label: 'Visible', type: 'boolean' },
    { key: 'textColor', label: 'Text color', type: 'color' },
    { key: 'lineColor', label: 'Line color', type: 'color' },
    { key: 'letterSpacing', label: 'Letter spacing (em)', type: 'number' },
    { key: 'fontSize', label: 'Font size mobile (px)', type: 'number' },
    { key: 'fontSizeDesktop', label: 'Font size desktop (px)', type: 'number' },
    { key: 'lineWidthMobile', label: 'Line width mobile (px)', type: 'number' },
    { key: 'lineWidthDesktop', label: 'Line width desktop (px)', type: 'number' },
    { key: 'marginBottom', label: 'Bottom spacing (rem)', type: 'number' },
    { key: 'textShadow', label: 'Text shadow CSS', type: 'text' },
  ],
  heroFeature: [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'visible', label: 'Visible', type: 'boolean' },
    { key: 'icon', label: 'Icon', type: 'icon' },
    { key: 'iconColor', label: 'Icon color', type: 'color' },
    { key: 'ringColor', label: 'Ring border color', type: 'color' },
    { key: 'ringBackground', label: 'Ring background', type: 'color' },
    { key: 'textColor', label: 'Label color', type: 'color' },
    { key: 'letterSpacing', label: 'Letter spacing (em)', type: 'number' },
    { key: 'fontSize', label: 'Label size mobile (px)', type: 'number' },
    { key: 'fontSizeDesktop', label: 'Label size desktop (px)', type: 'number' },
    { key: 'textShadow', label: 'Text shadow CSS', type: 'text' },
    { key: 'href', label: 'Link URL (optional)', type: 'text' },
  ],
}

export const HERO_SECTION_FIELDS: PropField[] = [
  {
    key: 'heightMode',
    label: 'Height mode',
    type: 'select',
    options: [
      { value: 'below-nav', label: '100vh minus nav (default)' },
      { value: 'full-viewport', label: 'Full viewport (100vh)' },
      { value: 'custom', label: 'Custom height' },
    ],
  },
  { key: 'navOffsetDesktop', label: 'Nav offset desktop (px)', type: 'number' },
  { key: 'navOffsetMobile', label: 'Nav offset mobile (px)', type: 'number' },
  { key: 'customHeightDesktop', label: 'Custom height desktop (px)', type: 'number' },
  { key: 'customHeightMobile', label: 'Custom height mobile (px)', type: 'number' },
  { key: 'featureDividerColor', label: 'Feature divider color', type: 'color' },
]

export function getHeroSlotsForVariant(variant: string): readonly string[] {
  return HERO_VARIANT_SLOTS[variant] ?? HERO_STANDARD_SLOTS
}

export function isHeroV4(variant: string): boolean {
  return variant === 'HeroV4'
}

export function getHeroFields(childType: string): PropField[] {
  return HERO_FIELDS[childType] ?? []
}

export function getHeroChildPropFields(childType: string): readonly string[] {
  return getHeroFields(childType).map((f) => f.key)
}

export function getHeroPartLabels(variant?: string): string[] {
  const slots = variant ? getHeroSlotsForVariant(variant) : HERO_STANDARD_SLOTS
  const labels = slots.map((t) => HERO_CHILD_META[t]?.label ?? t)
  if (variant === 'HeroV4') labels.push('Features')
  return labels
}

/** @deprecated use getHeroSlotsForVariant */
export const HERO_CHILD_TYPES = HERO_STANDARD_SLOTS
