import { getHeaderVariantFields } from '@/lib/header-variant-theme'
import { HERO_SECTION_FIELDS } from '@/lib/hero-config'
import { LOGIN_MODAL_SECTION_DEFAULTS, LOGIN_MODAL_SECTION_FIELDS } from '@/lib/login-modal-config'
import { CART_DRAWER_SECTION_DEFAULTS, CART_DRAWER_SECTION_FIELDS } from '@/lib/cart-drawer-config'

export function getHeroVariantFields(_variantId: string) {
  return HERO_SECTION_FIELDS
}

export type PropFieldType = 'text' | 'textarea' | 'url' | 'number' | 'color' | 'boolean' | 'productIds' | 'categoryIds' | 'icon' | 'select'

export type PropField = {
  key: string
  label: string
  type: PropFieldType
  options?: { value: string; label: string }[]
}

export type VariantConfig = {
  id: string
  label: string
  description?: string
  previewColor?: string
  fields: PropField[]
  defaultProps?: Record<string, unknown>
}

export type ComponentTypeConfig = {
  type: string
  label: string
  category: 'page' | 'section' | 'component'
  variants: VariantConfig[]
  allowedChildTypes?: string[]
}

export function getComponentType(type: string): ComponentTypeConfig | undefined {
  return componentRegistry.find((c) => c.type === type)
}

export function getVariantConfig(type: string, variantId: string): VariantConfig | undefined {
  return getComponentType(type)?.variants.find((v) => v.id === variantId)
}

export function getVariantsForType(type: string): VariantConfig[] {
  return getComponentType(type)?.variants ?? []
}

export function getDefaultVariant(type: string): VariantConfig | undefined {
  return getComponentType(type)?.variants[0]
}

export const componentRegistry: ComponentTypeConfig[] = [
  {
    type: 'header',
    label: 'Header',
    category: 'section',
    allowedChildTypes: ['logo', 'storeName', 'address', 'search', 'deals', 'account', 'cart', 'headerStyle', 'navLink', 'themeToggle', 'groceryBarStyle', 'menuButton', 'bistroBarStyle'],
    variants: [
      {
        id: 'HeaderV1',
        label: 'Grocery Nav Bar',
        description: 'Fixed white bar with search, nav links, cart, and mobile search strip',
        previewColor: '#6bb252',
        fields: getHeaderVariantFields('HeaderV1'),
        defaultProps: { colorScheme: 'light', applySchemeToContent: true, backgroundOpacity: 100 },
      },
      {
        id: 'HeaderV2',
        label: 'Glass Storefront',
        description: 'Blurred header with store address, deals, account menu, and cart total',
        previewColor: '#F97316',
        fields: getHeaderVariantFields('HeaderV2'),
        defaultProps: { colorScheme: 'light', applySchemeToContent: true, backgroundOpacity: 100, blur: true },
      },
      {
        id: 'HeaderV3',
        label: 'Bistro Center Logo Nav',
        description: 'Dark bar with centered logo, split nav links, menu CTA, and outline cart',
        previewColor: '#EFB21B',
        fields: getHeaderVariantFields('HeaderV3'),
        defaultProps: { colorScheme: 'dark', applySchemeToContent: true, backgroundOpacity: 0 },
      },
    ],
  },
  {
    type: 'logo',
    label: 'Logo',
    category: 'component',
    variants: [{
      id: 'LogoV1',
      label: 'Logo',
      fields: [{ key: 'imageUrl', label: 'Logo image URL', type: 'url' }],
    }],
  },
  {
    type: 'storeName',
    label: 'Store Name',
    category: 'component',
    variants: [{
      id: 'StoreNameV1',
      label: 'Store Name',
      fields: [{ key: 'text', label: 'Store name', type: 'text' }],
    }],
  },
  {
    type: 'address',
    label: 'Address',
    category: 'component',
    variants: [{
      id: 'AddressV1',
      label: 'Address',
      fields: [{ key: 'text', label: 'Address / subtitle', type: 'textarea' }],
    }],
  },
  {
    type: 'search',
    label: 'Search',
    category: 'component',
    variants: [{
      id: 'SearchV1',
      label: 'Search Bar',
      fields: [{ key: 'placeholder', label: 'Search placeholder', type: 'text' }],
    }],
  },
  {
    type: 'deals',
    label: 'Deals',
    category: 'component',
    variants: [{
      id: 'DealsV1',
      label: 'Deals Button',
      fields: [
        { key: 'label', label: 'Button label', type: 'text' },
        { key: 'visible', label: 'Show deals button', type: 'boolean' },
      ],
      defaultProps: { visible: true },
    }],
  },
  {
    type: 'account',
    label: 'Account',
    category: 'component',
    variants: [{
      id: 'AccountV1',
      label: 'Account / Login',
      fields: [
        { key: 'isLoggedIn', label: 'Logged in', type: 'boolean' },
        { key: 'userName', label: 'Account name', type: 'text' },
        { key: 'userEmail', label: 'Account email', type: 'text' },
        { key: 'welcomeLabel', label: 'Welcome label (logged out)', type: 'text' },
        { key: 'loginPrompt', label: 'Login prompt (logged out)', type: 'text' },
      ],
      defaultProps: { isLoggedIn: false },
    }, {
      id: 'AccountGroceryV1',
      label: 'Profile Card',
      fields: [],
      defaultProps: { isLoggedIn: false, showAvatar: true },
    }],
  },
  {
    type: 'cart',
    label: 'Cart',
    category: 'component',
    variants: [{
      id: 'CartV1',
      label: 'Cart Button',
      fields: [
        { key: 'label', label: 'Button label', type: 'text' },
        { key: 'cartTotal', label: 'Cart total', type: 'text' },
        { key: 'cartCount', label: 'Item count', type: 'number' },
      ],
    }],
  },
  {
    type: 'headerStyle',
    label: 'Header Style',
    category: 'component',
    variants: [{
      id: 'HeaderStyleV1',
      label: 'Background & Style',
      fields: [
        { key: 'backgroundColor', label: 'Background color', type: 'color' },
        { key: 'backgroundOpacity', label: 'Background opacity (0–100)', type: 'number' },
        { key: 'borderColor', label: 'Border color', type: 'color' },
        { key: 'accentColor', label: 'Accent color', type: 'color' },
        { key: 'blur', label: 'Backdrop blur', type: 'boolean' },
      ],
      defaultProps: { blur: true, backgroundOpacity: 97 },
    }],
  },
  {
    type: 'navLink',
    label: 'Page Nav',
    category: 'component',
    variants: [{ id: 'NavLinkV1', label: 'Nav Link', fields: [] }],
  },
  {
    type: 'themeToggle',
    label: 'Theme Toggle',
    category: 'component',
    variants: [{ id: 'ThemeToggleV1', label: 'Theme Toggle', fields: [] }],
  },
  {
    type: 'groceryBarStyle',
    label: 'Bar Style',
    category: 'component',
    variants: [{ id: 'GroceryBarStyleV1', label: 'Bar Style', fields: [] }],
  },
  {
    type: 'menuButton',
    label: 'Menu Button',
    category: 'component',
    variants: [{ id: 'MenuButtonV1', label: 'Menu Button', fields: [] }],
  },
  {
    type: 'bistroBarStyle',
    label: 'Bar Style',
    category: 'component',
    variants: [{ id: 'BistroBarStyleV1', label: 'Bar Style', fields: [] }],
  },
  {
    type: 'heroMedia',
    label: 'Hero Media',
    category: 'component',
    variants: [{ id: 'HeroMediaV1', label: 'Media', fields: [] }],
  },
  {
    type: 'heroOverlay',
    label: 'Hero Overlay',
    category: 'component',
    variants: [{ id: 'HeroOverlayV1', label: 'Overlay', fields: [] }],
  },
  {
    type: 'heroTitle',
    label: 'Hero Title',
    category: 'component',
    variants: [
      { id: 'HeroTitleV1', label: 'Title', fields: [] },
      { id: 'HeroTitleBistroV1', label: 'Bistro Title', fields: [] },
    ],
  },
  {
    type: 'heroSubtitle',
    label: 'Hero Subtitle',
    category: 'component',
    variants: [{ id: 'HeroSubtitleV1', label: 'Subtitle', fields: [] }],
  },
  {
    type: 'heroButton',
    label: 'Hero Button',
    category: 'component',
    variants: [
      { id: 'HeroButtonV1', label: 'Button', fields: [] },
      { id: 'HeroButtonBistroV1', label: 'Bistro Button', fields: [] },
    ],
  },
  {
    type: 'heroLogo',
    label: 'Hero Logo',
    category: 'component',
    variants: [{ id: 'HeroLogoV1', label: 'Logo', fields: [] }],
  },
  {
    type: 'heroEyebrow',
    label: 'Hero Eyebrow',
    category: 'component',
    variants: [{ id: 'HeroEyebrowV1', label: 'Eyebrow', fields: [] }],
  },
  {
    type: 'heroFeature',
    label: 'Hero Feature',
    category: 'component',
    variants: [{ id: 'HeroFeatureV1', label: 'Feature', fields: [] }],
  },
  {
    type: 'hero',
    label: 'Hero Media',
    category: 'section',
    allowedChildTypes: [
      'heroMedia',
      'heroOverlay',
      'heroTitle',
      'heroSubtitle',
      'heroButton',
      'heroLogo',
      'heroEyebrow',
      'heroFeature',
    ],
    variants: [
      {
        id: 'HeroV1',
        label: 'Button Bottom Left',
        previewColor: '#DC2626',
        fields: [],
      },
      {
        id: 'HeroV2',
        label: 'Button Bottom Center',
        previewColor: '#7C3AED',
        fields: [],
      },
      {
        id: 'HeroV3',
        label: 'Button Bottom Right',
        previewColor: '#2563EB',
        fields: [],
      },
      {
        id: 'HeroV4',
        label: 'Bistro Centered',
        previewColor: '#EFB21B',
        fields: [],
      },
    ],
  },
  {
    type: 'categories',
    label: 'Categories',
    category: 'section',
    variants: [
      {
        id: 'CategoriesV1',
        label: 'Category Grid',
        previewColor: '#059669',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'categoryIds', label: 'Category IDs (comma-separated)', type: 'categoryIds' },
        ],
      },
    ],
  },
  {
    type: 'offers',
    label: 'Offers Carousel',
    category: 'section',
    variants: [
      {
        id: 'OffersV1',
        label: 'Offers Carousel',
        previewColor: '#EA580C',
        fields: [{ key: 'title', label: 'Title', type: 'text' }],
      },
    ],
  },
  {
    type: 'productSection',
    label: 'Product Template',
    category: 'section',
    allowedChildTypes: ['templateSection'],
    variants: [
      {
        id: 'ProductSectionV1',
        label: 'Product Template Grid',
        previewColor: '#2563EB',
        fields: [{ key: 'title', label: 'Title', type: 'text' }],
      },
    ],
  },
  {
    type: 'templateSection',
    label: 'Template Section',
    category: 'component',
    allowedChildTypes: ['productCard'],
    variants: [
      {
        id: 'TemplateSectionV1',
        label: 'Template Section',
        previewColor: '#0EA5E9',
        fields: [
          { key: 'title', label: 'Section title', type: 'text' },
          { key: 'sectionId', label: 'Section ID', type: 'text' },
        ],
      },
    ],
  },
  {
    type: 'productCard',
    label: 'Product Card',
    category: 'component',
    variants: [
      {
        id: 'ProductCardV4',
        label: 'Circle Float Card',
        previewColor: '#F97316',
        fields: [
          { key: 'productId', label: 'Product ID', type: 'text' },
          { key: 'compareAtPrice', label: 'Compare at price', type: 'number' },
          { key: 'categoryLabel', label: 'Category label', type: 'text' },
        ],
      },
      {
        id: 'ProductCardV2',
        label: 'Horizontal Card',
        previewColor: '#8B5CF6',
        fields: [{ key: 'productId', label: 'Product ID', type: 'text' }],
      },
      {
        id: 'ProductCardV5',
        label: 'Bistro List Row',
        previewColor: '#EFB21B',
        fields: [
          { key: 'productId', label: 'Product ID', type: 'text' },
          { key: 'categoryLabel', label: 'Category label', type: 'text' },
        ],
      },
      {
        id: 'ProductCardV6',
        label: 'Grocery Shelf Card',
        previewColor: '#6bb252',
        fields: [
          { key: 'productId', label: 'Product ID', type: 'text' },
          { key: 'compareAtPrice', label: 'Compare at price', type: 'number' },
          { key: 'categoryLabel', label: 'Category label', type: 'text' },
        ],
      },
      {
        id: 'ProductCardV7',
        label: 'Produce List Row',
        previewColor: '#FBBD10',
        fields: [
          { key: 'productId', label: 'Product ID', type: 'text' },
          { key: 'compareAtPrice', label: 'Compare at price', type: 'number' },
          { key: 'categoryLabel', label: 'Category label', type: 'text' },
        ],
      },
      {
        id: 'ProductCardV9',
        label: 'Spotlight Card',
        previewColor: '#0F1419',
        fields: [
          { key: 'productId', label: 'Product ID', type: 'text' },
          { key: 'compareAtPrice', label: 'Compare at price', type: 'number' },
        ],
      },
    ],
  },
  {
    type: 'testimonials',
    label: 'Testimonials',
    category: 'section',
    variants: [
      {
        id: 'TestimonialsV1',
        label: 'Testimonial Grid',
        previewColor: '#DB2777',
        fields: [{ key: 'title', label: 'Title', type: 'text' }],
      },
    ],
  },
  {
    type: 'orders',
    label: 'Orders',
    category: 'section',
    variants: [
      {
        id: 'OrdersV1',
        label: 'Orders List',
        previewColor: '#4B5563',
        fields: [{ key: 'title', label: 'Title', type: 'text' }],
      },
    ],
  },
  {
    type: 'loginModal',
    label: 'Login Modal',
    category: 'section',
    variants: [
      {
        id: 'LoginModalV1',
        label: 'Warm Card (OTP)',
        description: 'White card with soft accent orbs and mobile OTP',
        previewColor: '#F97316',
        fields: LOGIN_MODAL_SECTION_FIELDS,
        defaultProps: LOGIN_MODAL_SECTION_DEFAULTS,
      },
      {
        id: 'LoginModalV2',
        label: 'Dark Glass (OTP)',
        description: 'Dark glass panel with gradient ring',
        previewColor: '#6366F1',
        fields: LOGIN_MODAL_SECTION_FIELDS,
        defaultProps: LOGIN_MODAL_SECTION_DEFAULTS,
      },
      {
        id: 'LoginModalV3',
        label: 'Split Brand (OTP)',
        description: 'Brand panel + OTP form split layout',
        previewColor: '#2563EB',
        fields: LOGIN_MODAL_SECTION_FIELDS,
        defaultProps: LOGIN_MODAL_SECTION_DEFAULTS,
      },
    ],
  },
  {
    type: 'cartDrawerHeader',
    label: 'Cart Header',
    category: 'component',
    variants: [{ id: 'CartDrawerPartV1', label: 'Header', fields: [] }],
  },
  {
    type: 'cartStepNav',
    label: 'Cart Step Nav',
    category: 'component',
    variants: [{ id: 'CartDrawerPartV1', label: 'Steps', fields: [] }],
  },
  {
    type: 'cartLineItem',
    label: 'Cart Line Item',
    category: 'component',
    variants: [{ id: 'CartDrawerPartV1', label: 'Line Item', fields: [] }],
  },
  {
    type: 'cartBill',
    label: 'Cart Bill',
    category: 'component',
    variants: [{ id: 'CartDrawerPartV1', label: 'Bill', fields: [] }],
  },
  {
    type: 'cartCta',
    label: 'Cart CTA',
    category: 'component',
    variants: [{ id: 'CartDrawerPartV1', label: 'CTA', fields: [] }],
  },
  {
    type: 'cartCoupon',
    label: 'Cart Coupon',
    category: 'component',
    variants: [{ id: 'CartDrawerPartV1', label: 'Coupon', fields: [] }],
  },
  {
    type: 'cartDrawerStyle',
    label: 'Cart Drawer Style',
    category: 'component',
    variants: [{ id: 'CartDrawerPartV1', label: 'Style', fields: [] }],
  },
  {
    type: 'cartDrawer',
    label: 'Cart Drawer',
    category: 'section',
    allowedChildTypes: [
      'cartDrawerHeader',
      'cartStepNav',
      'cartLineItem',
      'cartBill',
      'cartCta',
      'cartCoupon',
      'cartDrawerStyle',
    ],
    variants: [
      {
        id: 'CartDrawerV1',
        label: 'Warm Checkout Drawer',
        description: 'Rounded grocery-style cards, numbered step pills, and orange accent bar',
        previewColor: '#F97316',
        fields: CART_DRAWER_SECTION_FIELDS,
        defaultProps: CART_DRAWER_SECTION_DEFAULTS,
      },
      {
        id: 'CartDrawerV2',
        label: 'Dark Bistro Drawer',
        description: 'Serif bistro header, icon tab steps, compact menu list, outline CTA',
        previewColor: '#EFB21B',
        fields: CART_DRAWER_SECTION_FIELDS,
        defaultProps: CART_DRAWER_SECTION_DEFAULTS,
      },
      {
        id: 'CartDrawerV3',
        label: 'Minimal Slide Drawer',
        description: 'Narrow slide panel, vertical timeline steps, flat list rows, collapsible bill',
        previewColor: '#6B7280',
        fields: CART_DRAWER_SECTION_FIELDS,
        defaultProps: CART_DRAWER_SECTION_DEFAULTS,
      },
    ],
  },
  {
    type: 'footer',
    label: 'Footer',
    category: 'section',
    variants: [
      { id: 'FooterV1', label: 'Standard Footer', previewColor: '#0D9488', fields: [] },
      { id: 'FooterV2', label: 'Compact Footer', previewColor: '#374151', fields: [] },
    ],
  },
]

export function getAllVariantIds(): string[] {
  return componentRegistry.flatMap((t) => t.variants.map((v) => v.id))
}
