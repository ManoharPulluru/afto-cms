import type { CartLineItem } from '@/components/cart/types'

export const MOCK_CART_ITEMS: CartLineItem[] = [
  {
    id: '1',
    name: 'Amla 1lb',
    imageUrl:
      'https://etlstoreprod.blob.core.windows.net/afto-master-store/product-images/product_bb4bf6d4-e545-4ddb-baf0-2cc8ccf43e3e_20250910_164524.jpg',
    unitPrice: 7.99,
    quantity: 2,
  },
  {
    id: '2',
    name: 'Eggplant Ravaiya (lb)',
    imageUrl:
      'https://etlstoreprod.blob.core.windows.net/afto-master-store/product-images/product_0d51b020-9451-4829-8a25-4a51a3582194_20250829_003154.jpg',
    unitPrice: 2.84,
    quantity: 1,
  },
  {
    id: '3',
    name: 'Pepper Green 1lb',
    imageUrl:
      'https://etlstoreprod.blob.core.windows.net/afto-master-store/product-images/pepper_green__lb__product_fresh_produce_20250821_134142.jpg',
    unitPrice: 4.99,
    quantity: 1,
  },
]

export const MOCK_CART_STEPS = [
  { id: 'cart', label: 'Cart' },
  { id: 'details', label: 'Details' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'payment', label: 'Payment' },
]
