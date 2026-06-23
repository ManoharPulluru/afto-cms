'use client'

import type { StoreInfo } from '@/lib/types/store'

type ThemePanelProps = {
  store: StoreInfo
  onChange: (store: StoreInfo) => void
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500'

export function ThemePanel({ store, onChange }: ThemePanelProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Store Theme</h2>

      <Field label="Store Name">
        <input
          type="text"
          value={store.name}
          onChange={(e) => onChange({ ...store, name: e.target.value })}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Primary Color">
          <div className="flex gap-2">
            <input
              type="color"
              value={store.primaryColor}
              onChange={(e) => onChange({ ...store, primaryColor: e.target.value })}
              className="h-10 w-12 cursor-pointer rounded border border-gray-700 bg-gray-800"
            />
            <input
              type="text"
              value={store.primaryColor}
              onChange={(e) => onChange({ ...store, primaryColor: e.target.value })}
              className={inputClass}
            />
          </div>
        </Field>

        <Field label="Secondary Color">
          <div className="flex gap-2">
            <input
              type="color"
              value={store.secondaryColor}
              onChange={(e) => onChange({ ...store, secondaryColor: e.target.value })}
              className="h-10 w-12 cursor-pointer rounded border border-gray-700 bg-gray-800"
            />
            <input
              type="text"
              value={store.secondaryColor}
              onChange={(e) => onChange({ ...store, secondaryColor: e.target.value })}
              className={inputClass}
            />
          </div>
        </Field>
      </div>

      <Field label="Logo URL">
        <input
          type="url"
          value={store.logo || ''}
          onChange={(e) => onChange({ ...store, logo: e.target.value })}
          className={inputClass}
          placeholder="https://..."
        />
      </Field>

      <div className="rounded-lg border border-gray-800 p-4">
        <p className="mb-2 text-xs text-gray-500">Preview</p>
        <div
          className="rounded-lg p-4 text-center font-bold"
          style={{ backgroundColor: store.primaryColor, color: store.secondaryColor }}
        >
          {store.name}
        </div>
      </div>
    </div>
  )
}
