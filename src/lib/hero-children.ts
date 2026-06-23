import type { PageNode, StoreData } from '@/lib/types/store'
import { getDefaultNodeProps } from '@/lib/resolve-props'
import {
  HERO_CHILD_META,
  getHeroSlotsForVariant,
  isHeroV4,
  type HeroChildType,
} from '@/lib/hero-config'

const LEGACY_HERO_PROP_KEYS = ['title', 'subtitle', 'buttonText', 'buttonLink', 'backgroundImage', 'videoUrl'] as const

const DEFAULT_FEATURES = [
  { featureKey: 'pickup', label: 'Pickup', icon: 'solar:bag-4-linear' },
  { featureKey: 'delivery', label: 'Home Delivery', icon: 'solar:delivery-linear' },
] as const

let heroChildCounter = 0
function heroChildId(type: string): string {
  heroChildCounter += 1
  return `${type}-${heroChildCounter}`
}

function bistroAccent(store: StoreData): string {
  return store.store.primaryColor || '#EFB21B'
}

function variantForChild(type: string, heroVariant: string): string {
  if (heroVariant === 'HeroV4') {
    if (type === 'heroTitle') return 'HeroTitleBistroV1'
    if (type === 'heroButton') return 'HeroButtonBistroV1'
  }
  const map: Record<string, string> = {
    heroMedia: 'HeroMediaV1',
    heroOverlay: 'HeroOverlayV1',
    heroTitle: 'HeroTitleV1',
    heroSubtitle: 'HeroSubtitleV1',
    heroButton: 'HeroButtonV1',
    heroLogo: 'HeroLogoV1',
    heroEyebrow: 'HeroEyebrowV1',
    heroFeature: 'HeroFeatureV1',
  }
  return map[type] ?? `${type}V1`
}

export function createHeroChild(
  type: string,
  store: StoreData,
  overrides?: Partial<PageNode> & { heroVariant?: string },
): PageNode {
  const heroVariant = overrides?.heroVariant ?? 'HeroV1'
  return {
    id: overrides?.id ?? heroChildId(type),
    type,
    variant: overrides?.variant ?? variantForChild(type, heroVariant),
    label: overrides?.label ?? HERO_CHILD_META[type]?.label ?? type,
    props: {
      ...getDefaultNodeProps(type, store),
      ...overrides?.props,
    },
  }
}

export function defaultHeroV4Children(store: StoreData): PageNode[] {
  heroChildCounter = 0
  const accent = bistroAccent(store)
  const cream = '#f5f0e8'

  return [
    createHeroChild('heroMedia', store, { heroVariant: 'HeroV4' }),
    createHeroChild('heroOverlay', store, {
      heroVariant: 'HeroV4',
      props: { overlayOpacity: 42, overlayColor: '#000000', enableGradient: true },
    }),
    createHeroChild('heroLogo', store, {
      props: {
        imageUrl: store.store.logo,
        alt: store.store.name,
        dropShadow:
          'drop-shadow(0 14px 14px rgba(0,0,0,0.95)) drop-shadow(0 0 20px rgba(239,178,27,0.5))',
      },
    }),
    createHeroChild('heroEyebrow', store, {
      props: {
        text: 'FOOD · DRINKS · DINING',
        textColor: accent,
        lineColor: accent,
        letterSpacing: 0.4,
      },
    }),
    createHeroChild('heroTitle', store, {
      heroVariant: 'HeroV4',
      props: { text: 'Fresh, Bold & Authentic', textColor: cream, fontSize: 29.6, fontSizeDesktop: 128 },
    }),
    createHeroChild('heroButton', store, {
      heroVariant: 'HeroV4',
      props: {
        label: 'Order Online',
        href: '/menu',
        backgroundColor: accent,
        textColor: '#0c0c0c',
        borderColor: accent,
        letterSpacing: 0.32,
      },
    }),
    ...DEFAULT_FEATURES.map((f) =>
      createHeroChild('heroFeature', store, {
        label: f.label,
        props: {
          featureKey: f.featureKey,
          label: f.label,
          icon: f.icon,
          iconColor: accent,
          ringColor: `${accent}73`,
          ringBackground: `${accent}1f`,
          textColor: 'rgba(245,240,232,0.82)',
        },
      }),
    ),
  ]
}

export function defaultHeroStandardChildren(store: StoreData): PageNode[] {
  heroChildCounter = 0
  const slots = getHeroSlotsForVariant('HeroV1')
  return slots.map((type) => createHeroChild(type, store, { heroVariant: 'HeroV1' }))
}

export function childrenFromLegacyHeroProps(
  props: Record<string, unknown>,
  store: StoreData,
): PageNode[] {
  const hasVideo = Boolean(props.videoUrl)
  return [
    createHeroChild('heroMedia', store, {
      props: {
        mediaType: hasVideo ? 'video' : 'image',
        imageUrl: props.backgroundImage,
        videoUrl: props.videoUrl,
        alt: props.title ?? store.store.name,
      },
    }),
    createHeroChild('heroOverlay', store),
    createHeroChild('heroTitle', store, {
      props: { text: props.title ?? `Welcome to ${store.store.name}` },
    }),
    createHeroChild('heroSubtitle', store, {
      props: { text: props.subtitle ?? store.store.tagline ?? '' },
    }),
    createHeroChild('heroButton', store, {
      props: {
        label: props.buttonText ?? 'Shop Now',
        href: props.buttonLink ?? '/products',
      },
    }),
  ]
}

export function stripLegacyHeroProps(props: Record<string, unknown>): Record<string, unknown> {
  const next = { ...props }
  for (const key of LEGACY_HERO_PROP_KEYS) delete next[key]
  return next
}

export function switchHeroVariantState(node: PageNode, variant: string): PageNode {
  const childrenByVariant = {
    ...((node.props?.childrenByVariant as Record<string, PageNode[]> | undefined) ?? {}),
    [node.variant]: node.children ?? [],
  }
  return {
    ...node,
    variant,
    props: { ...node.props, childrenByVariant },
    children: childrenByVariant[variant],
  }
}

function ensureFeatureNodes(existing: PageNode[], store: StoreData): PageNode[] {
  const features = existing.filter((c) => c.type === 'heroFeature')
  const byKey = new Map<string, PageNode>()
  for (const f of features) {
    const key = String(f.props?.featureKey ?? f.id)
    if (!byKey.has(key)) byKey.set(key, f)
  }

  const next: PageNode[] = []
  for (const def of DEFAULT_FEATURES) {
    if (byKey.has(def.featureKey)) {
      const child = byKey.get(def.featureKey)!
      next.push({
        ...child,
        label: def.label,
        props: { ...getDefaultNodeProps('heroFeature', store), ...child.props },
      })
    } else {
      next.push(
        createHeroChild('heroFeature', store, {
          label: def.label,
          props: {
            featureKey: def.featureKey,
            label: def.label,
            icon: def.icon,
            iconColor: bistroAccent(store),
          },
        }),
      )
    }
  }

  for (const f of features) {
    const key = String(f.props?.featureKey ?? '')
    if (!DEFAULT_FEATURES.some((d) => d.featureKey === key)) {
      next.push(f)
    }
  }
  return next
}

export function ensureHeroChildren(node: PageNode, store: StoreData): PageNode {
  if (node.type !== 'hero') return node

  const variant = ['HeroV1', 'HeroV2', 'HeroV3', 'HeroV4'].includes(node.variant) ? node.variant : 'HeroV1'
  const props = node.props ?? {}
  const hasLegacy = LEGACY_HERO_PROP_KEYS.some((k) => props[k] !== undefined && props[k] !== '')
  let children = node.children ?? []

  if (children.length === 0 && hasLegacy) {
    children = childrenFromLegacyHeroProps(props, store)
  }

  if (children.length === 0) {
    children = isHeroV4(variant) ? defaultHeroV4Children(store) : defaultHeroStandardChildren(store)
  }

  const slots = getHeroSlotsForVariant(variant)
  const byType = new Map<string, PageNode>()
  for (const child of children) {
    if (slots.includes(child.type) && !byType.has(child.type)) {
      byType.set(child.type, child)
    }
  }

  const ordered: PageNode[] = slots.map((type) => {
    if (byType.has(type)) {
      const child = byType.get(type)!
      return {
        ...child,
        variant: variantForChild(type, variant),
        label: HERO_CHILD_META[type]?.label ?? child.label,
        props: { ...getDefaultNodeProps(type, store), ...child.props },
      }
    }
    return createHeroChild(type, store, { heroVariant: variant })
  })

  if (isHeroV4(variant)) {
    ordered.push(...ensureFeatureNodes(children, store))
  }

  return {
    ...node,
    variant,
    label: node.label === 'Hero Banner' || node.label === 'Video Hero' ? 'Hero Media' : node.label ?? 'Hero Media',
    props: stripLegacyHeroProps(props),
    children: ordered,
  }
}

export function filterHeroNodesForNavigator(nodes: PageNode[]): PageNode[] {
  return nodes.map((node) => {
    if (node.type === 'hero' && node.children?.length) {
      const slots = getHeroSlotsForVariant(node.variant)
      const allowed = new Set([...slots, 'heroFeature'])
      return { ...node, children: node.children.filter((c) => allowed.has(c.type)) }
    }
    if (node.children?.length) {
      return { ...node, children: filterHeroNodesForNavigator(node.children) }
    }
    return node
  })
}

export function getHeroPartLabelsForVariant(variant: string): string[] {
  const slots = getHeroSlotsForVariant(variant)
  const labels = slots.map((t) => HERO_CHILD_META[t]?.label ?? t)
  if (variant === 'HeroV4') labels.push('Features')
  return labels
}

/** @deprecated */
export function getHeroPartLabels(): string[] {
  return getHeroPartLabelsForVariant('HeroV1')
}

/** @deprecated */
export function defaultHeroChildren(store: StoreData): PageNode[] {
  return defaultHeroStandardChildren(store)
}

export type { HeroChildType }
