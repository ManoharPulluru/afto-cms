'use client'

import type { Product } from '@/lib/types/store'

type ProductsPanelProps = {
  products: Product[]
  onChange: (products: Product[]) => void
}

const inputClass =
  'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500'

export function ProductsPanel({ products, onChange }: ProductsPanelProps) {
  function updateProduct(index: number, product: Product) {
    const next = [...products]
    next[index] = product
    onChange(next)
  }

  function addProduct() {
    const id = `prod-${Date.now()}`
    onChange([
      ...products,
      { id, name: 'New Product', price: 0, description: '', image: '' },
    ])
  }

  function removeProduct(index: number) {
    onChange(products.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Products</h2>
        <button
          type="button"
          onClick={addProduct}
          className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-teal-400 hover:bg-gray-700"
        >
          + Add Product
        </button>
      </div>

      {products.map((product, index) => (
        <div key={product.id} className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">{product.id}</span>
            <button
              type="button"
              onClick={() => removeProduct(index)}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={product.name}
              onChange={(e) => updateProduct(index, { ...product, name: e.target.value })}
              className={inputClass}
              placeholder="Product name"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={product.price}
                onChange={(e) =>
                  updateProduct(index, { ...product, price: parseFloat(e.target.value) || 0 })
                }
                className={inputClass}
                placeholder="Price"
              />
              <input
                type="url"
                value={product.image || ''}
                onChange={(e) => updateProduct(index, { ...product, image: e.target.value })}
                className={inputClass}
                placeholder="Image URL"
              />
            </div>
            <textarea
              value={product.description || ''}
              onChange={(e) => updateProduct(index, { ...product, description: e.target.value })}
              className={`${inputClass} min-h-[60px] resize-y`}
              placeholder="Description"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
