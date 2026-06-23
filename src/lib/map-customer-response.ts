import type {
  CustomerAddress,
  CustomerProfile,
  UpdateCustomerProfilePayload,
} from '@/lib/types/customer'

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

function pickString(obj: Record<string, unknown>, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const v = obj[key]
    if (typeof v === 'string') return v
  }
  return fallback
}

function mapAddress(raw: Record<string, unknown> | null): CustomerAddress {
  const addr = raw ?? {}
  return {
    street: pickString(addr, ['street']),
    city: pickString(addr, ['city']),
    state: pickString(addr, ['state']),
    country: pickString(addr, ['country']),
    postal_code: pickString(addr, ['postal_code', 'postalCode']),
  }
}

function pickNumber(obj: Record<string, unknown>, keys: string[], fallback = 0): number {
  for (const key of keys) {
    const v = obj[key]
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string' && v.trim() && !Number.isNaN(Number(v))) return Number(v)
  }
  return fallback
}

export function mapCustomerProfile(data: unknown): CustomerProfile | null {
  const root = asRecord(data)
  if (!root) return null

  const entity = asRecord(root.data) ?? asRecord(root.entity) ?? root
  const id = pickString(entity, ['id'])
  if (!id) return null

  return {
    id,
    name: pickString(entity, ['name']),
    email: pickString(entity, ['email']),
    phone_number: pickString(entity, ['phone_number', 'phoneNumber']),
    address: mapAddress(asRecord(entity.address)),
    loyalty_points: pickNumber(entity, ['loyalty_points', 'loyaltyPoints']),
  }
}

export function formToUpdatePayload(form: {
  name: string
  phone: string
  email: string
  address: string
  city: string
  postalCode: string
  state: string
  country: string
}): UpdateCustomerProfilePayload {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    phone_number: form.phone.trim(),
    address: {
      street: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postal_code: form.postalCode.trim(),
      country: form.country.trim() || 'Canada',
    },
  }
}

export function profileToForm(profile: CustomerProfile): {
  name: string
  phone: string
  email: string
  address: string
  city: string
  postalCode: string
  state: string
  country: string
} {
  return {
    name: profile.name,
    phone: profile.phone_number,
    email: profile.email,
    address: profile.address.street,
    city: profile.address.city,
    postalCode: profile.address.postal_code,
    state: profile.address.state,
    country: profile.address.country,
  }
}
