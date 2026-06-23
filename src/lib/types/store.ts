export type StoreUser = {
  email: string
  password: string
  name: string
}

export type StoreInfo = {
  name: string
  slug: string
  primaryColor: string
  secondaryColor: string
  logo?: string
  /** Store address shown in header variants */
  address?: string
  /** Default search input placeholder */
  searchPlaceholder?: string
  /** Short tagline for hero fallbacks */
  tagline?: string
  /** Hero background when not set on the section */
  heroImage?: string
  /** Deals / promo button label */
  dealsLabel?: string
  welcomeLabel?: string
  loginPrompt?: string
  /** New sites: keep empty page trees (no auto header/footer on load) */
  blankCanvas?: boolean
}

export type Category = {
  id: string
  name: string
  image?: string
}

export type Product = {
  id: string
  name: string
  price: number
  image?: string
  description?: string
  compareAtPrice?: number
  categoryName?: string
}

/** Legacy block types (preserved for backward-compatible rendering) */
export type HeroBannerBlock = {
  blockType: 'heroBanner'
  title: string
  subtitle?: string
  backgroundImage?: string
  buttonText?: string
  buttonLink?: string
}

export type VideoBannerBlock = {
  blockType: 'videoBanner'
  title: string
  videoUrl: string
}

export type ProductGridBlock = {
  blockType: 'productGrid'
  title: string
  productIds: string[]
}

export type CategoriesBlock = {
  blockType: 'categoriesBlock'
  title: string
  categoryIds: string[]
}

export type OfferSlide = {
  headline: string
  description?: string
  image?: string
  link?: string
}

export type OffersCarouselBlock = {
  blockType: 'offersCarousel'
  title: string
  slides: OfferSlide[]
}

export type TestimonialItem = {
  quote: string
  author: string
  role?: string
  avatar?: string
}

export type TestimonialsBlock = {
  blockType: 'testimonials'
  title: string
  items: TestimonialItem[]
}

export type LayoutBlock =
  | HeroBannerBlock
  | VideoBannerBlock
  | ProductGridBlock
  | CategoriesBlock
  | OffersCarouselBlock
  | TestimonialsBlock

/** Visual builder page tree node */
export type PageNode = {
  id: string
  type: string
  variant: string
  label?: string
  props?: Record<string, unknown>
  children?: PageNode[]
}

export type StorePage = {
  id: string
  title: string
  /** URL path e.g. "/", "/products", "/orders" */
  slug: string
  /** New visual builder tree */
  tree?: PageNode[]
  /** Legacy flat block layout — auto-migrated to tree on load */
  layout?: LayoutBlock[]
}

export type StoreData = {
  store: StoreInfo
  users: StoreUser[]
  categories: Category[]
  products: Product[]
  pages: StorePage[]
  /** Optional store-wide offers when section props are empty */
  offers?: OfferSlide[]
  /** Optional store-wide testimonials when section props are empty */
  testimonials?: TestimonialItem[]
}

export type ResolvedProductGridBlock = Omit<ProductGridBlock, 'productIds'> & {
  products: Product[]
}

export type ResolvedCategoriesBlock = Omit<CategoriesBlock, 'categoryIds'> & {
  categories: Category[]
}

export type ResolvedLayoutBlock =
  | HeroBannerBlock
  | VideoBannerBlock
  | ResolvedProductGridBlock
  | ResolvedCategoriesBlock
  | OffersCarouselBlock
  | TestimonialsBlock

export type BuilderSelection = {
  pageId: string
  nodeId: string | null
}

export type BuilderMessage =
  | { type: 'BUILDER_READY' }
  | { type: 'BUILDER_INIT'; store: StoreData; pageId: string; selectedNodeId: string | null }
  | { type: 'BUILDER_UPDATE'; store: StoreData; pageId: string; selectedNodeId: string | null }
  | { type: 'BUILDER_SELECT'; nodeId: string }
  | { type: 'BUILDER_HOVER'; nodeId: string | null }
