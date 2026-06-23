'use client'

import type { Category } from '@/lib/types/store'

type CategoriesPanelProps = {
  categories: Category[]
  onChange: (categories: Category[]) => void
}

const inputClass =
  'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500'

export function CategoriesPanel({ categories, onChange }: CategoriesPanelProps) {
  function updateCategory(index: number, category: Category) {
    const next = [...categories]
    next[index] = category
    onChange(next)
  }

  function addCategory() {
    const id = `cat-${Date.now()}`
    onChange([...categories, { id, name: 'New Category', image: '' }])
  }

  function removeCategory(index: number) {
    onChange(categories.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Categories</h2>
        <button
          type="button"
          onClick={addCategory}
          className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-teal-400 hover:bg-gray-700"
        >
          + Add Category
        </button>
      </div>

      {categories.map((category, index) => (
        <div key={category.id} className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">{category.id}</span>
            <button
              type="button"
              onClick={() => removeCategory(index)}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={category.name}
              onChange={(e) => updateCategory(index, { ...category, name: e.target.value })}
              className={inputClass}
              placeholder="Category name"
            />
            <input
              type="url"
              value={category.image || ''}
              onChange={(e) => updateCategory(index, { ...category, image: e.target.value })}
              className={inputClass}
              placeholder="Image URL"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
