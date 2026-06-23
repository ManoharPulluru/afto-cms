'use client'

import type { LayoutBlock } from '@/lib/types/store'

type LayoutPanelProps = {
  layout: LayoutBlock[]
  onChange: (layout: LayoutBlock[]) => void
}

const BLOCK_LABELS: Record<LayoutBlock['blockType'], string> = {
  heroBanner: 'Hero Banner',
  videoBanner: 'Video Banner',
  productGrid: 'Product Grid',
  categoriesBlock: 'Categories',
  offersCarousel: 'Offers Carousel',
  testimonials: 'Testimonials',
}

const inputClass =
  'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500'

export function LayoutPanel({ layout, onChange }: LayoutPanelProps) {
  function updateBlock(index: number, block: LayoutBlock) {
    const next = [...layout]
    next[index] = block
    onChange(next)
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const next = [...layout]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  function removeBlock(index: number) {
    onChange(layout.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Homepage Layout</h2>
      <p className="text-sm text-gray-400">
        Edit blocks, reorder, or remove sections from your homepage.
      </p>

      {layout.map((block, index) => (
        <div key={index} className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-teal-400">
              {BLOCK_LABELS[block.blockType]}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => moveBlock(index, -1)}
                disabled={index === 0}
                className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-800 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveBlock(index, 1)}
                disabled={index === layout.length - 1}
                className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-800 disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeBlock(index)}
                className="rounded px-2 py-1 text-xs text-red-400 hover:bg-gray-800"
              >
                Remove
              </button>
            </div>
          </div>

          {'title' in block && (
            <div className="mb-2">
              <label className="mb-1 block text-xs text-gray-500">Title</label>
              <input
                type="text"
                value={block.title}
                onChange={(e) => updateBlock(index, { ...block, title: e.target.value } as LayoutBlock)}
                className={inputClass}
              />
            </div>
          )}

          {block.blockType === 'heroBanner' && (
            <>
              <div className="mb-2">
                <label className="mb-1 block text-xs text-gray-500">Subtitle</label>
                <input
                  type="text"
                  value={block.subtitle || ''}
                  onChange={(e) => updateBlock(index, { ...block, subtitle: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="mb-2">
                <label className="mb-1 block text-xs text-gray-500">Background Image URL</label>
                <input
                  type="url"
                  value={block.backgroundImage || ''}
                  onChange={(e) => updateBlock(index, { ...block, backgroundImage: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">Button Text</label>
                  <input
                    type="text"
                    value={block.buttonText || ''}
                    onChange={(e) => updateBlock(index, { ...block, buttonText: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">Button Link</label>
                  <input
                    type="text"
                    value={block.buttonLink || ''}
                    onChange={(e) => updateBlock(index, { ...block, buttonLink: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          )}

          {block.blockType === 'videoBanner' && (
            <div>
              <label className="mb-1 block text-xs text-gray-500">Video URL</label>
              <input
                type="url"
                value={block.videoUrl}
                onChange={(e) => updateBlock(index, { ...block, videoUrl: e.target.value })}
                className={inputClass}
              />
            </div>
          )}
        </div>
      ))}

      {layout.length === 0 && (
        <p className="text-sm text-gray-500">No blocks on homepage.</p>
      )}
    </div>
  )
}
