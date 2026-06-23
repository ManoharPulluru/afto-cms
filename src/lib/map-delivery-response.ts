import type { CustomerDetailsForm } from '@/lib/types/customer'
import type { DeliveryChargeInfo } from '@/lib/types/delivery'

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

function pickString(obj: Record<string, unknown>, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const v = obj[key]
    if (typeof v === 'string' && v.trim()) return v
  }
  return fallback
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const v = obj[key]
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string' && v.trim() && !Number.isNaN(Number(v))) return Number(v)
  }
  return null
}

function pickBool(obj: Record<string, unknown>, keys: string[]): boolean | null {
  for (const key of keys) {
    const v = obj[key]
    if (typeof v === 'boolean') return v
  }
  return null
}

export function formatCustomerAddress(form: CustomerDetailsForm): string {
  const region = [form.state, form.postalCode].filter(Boolean).join(' ')
  return [form.address, form.city, region, form.country || 'Canada'].filter(Boolean).join(', ')
}

export function mapDeliveryChargeResponse(
  data: unknown,
  fallbackStoreAddress = '',
): DeliveryChargeInfo {
  const root = asRecord(data)
  const entity = asRecord(root?.data) ?? asRecord(root?.entity) ?? root ?? {}

  const deliveryCharge = pickNumber(entity, [
    'delivery_charge',
    'delivery_charges',
    'deliveryCharge',
    'charge',
    'amount',
  ])

  const explicitAvailable = pickBool(entity, [
    'is_available',
    'isAvailable',
    'available',
    'home_delivery_available',
    'homeDeliveryAvailable',
  ])

  const unavailableMessage =
    pickString(entity, ['message', 'error_message', 'errorMessage', 'reason']) || null

  const unavailableFlag = pickBool(entity, ['unavailable', 'is_unavailable', 'isUnavailable'])

  let homeDeliveryAvailable = false
  if (unavailableFlag === true || explicitAvailable === false) {
    homeDeliveryAvailable = false
  } else if (explicitAvailable === true) {
    homeDeliveryAvailable = true
  } else if (deliveryCharge !== null && deliveryCharge >= 0) {
    homeDeliveryAvailable = true
  }

  const storeAddress =
    pickString(entity, ['store_address', 'storeAddress', 'pickup_address', 'pickupAddress']) ||
    fallbackStoreAddress ||
    null

  return {
    deliveryCharge,
    homeDeliveryAvailable,
    unavailableMessage:
      unavailableMessage ||
      (homeDeliveryAvailable ? null : 'Delivery is not available for your address currently'),
    storeAddress,
    serviceName: pickString(entity, ['delivery_service_name', 'deliveryServiceName', 'service_name']) || null,
    validatedAddress:
      pickString(entity, ['validated_address', 'validatedAddress', 'destination_address']) || null,
    city: pickString(entity, ['city']) || null,
    postalCode: pickString(entity, ['pincode', 'postal_code', 'postalCode']) || null,
    province: pickString(entity, ['province_or_territory', 'province', 'state']) || null,
  }
}
