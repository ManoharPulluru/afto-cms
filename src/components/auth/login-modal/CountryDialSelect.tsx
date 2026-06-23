'use client'

const COUNTRIES = [
  { code: 'CA', dial: '+1', flag: 'https://flagcdn.com/w40/ca.png', label: 'Canada' },
  { code: 'US', dial: '+1', flag: 'https://flagcdn.com/w40/us.png', label: 'United States' },
  { code: 'IN', dial: '+91', flag: 'https://flagcdn.com/w40/in.png', label: 'India' },
  { code: 'GB', dial: '+44', flag: 'https://flagcdn.com/w40/gb.png', label: 'United Kingdom' },
] as const

type CountryDialSelectProps = {
  value: string
  onChange: (dial: string) => void
  borderColor: string
  backgroundColor: string
  textColor: string
}

export function CountryDialSelect({
  value,
  onChange,
  borderColor,
  backgroundColor,
  textColor,
}: CountryDialSelectProps) {
  const selected = COUNTRIES.find((c) => c.dial === value) ?? COUNTRIES[0]

  return (
    <div
      className="relative flex h-full w-24 shrink-0 items-stretch sm:w-24"
      style={{ borderColor, backgroundColor }}
    >
      <select
        aria-label="Country code"
        value={selected.dial}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 z-10 cursor-pointer opacity-0"
      >
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.dial}>
            {c.label} {c.dial}
          </option>
        ))}
      </select>
      <div
        className="flex w-full items-center justify-center gap-1 rounded-l-xl border-2 border-r-0 px-2 py-3"
        style={{ borderColor, backgroundColor, color: textColor, minHeight: 50 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={selected.label} className="h-2 w-3 rounded-sm object-cover" src={selected.flag} />
        <span className="truncate text-xs font-medium">{selected.dial}</span>
      </div>
    </div>
  )
}
