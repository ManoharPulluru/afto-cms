export type DeliveryMethod = 'pickup' | 'delivery'

export type DeliveryChargeInfo = {
  deliveryCharge: number | null
  homeDeliveryAvailable: boolean
  unavailableMessage: string | null
  storeAddress: string | null
  serviceName: string | null
  validatedAddress: string | null
  city: string | null
  postalCode: string | null
  province: string | null
}

export type SubmitDeliveryPayload = {
  method: DeliveryMethod
  pickupInstructions?: string
  deliveryDetails?: {
    validated_address: string
    city: string
    pincode: string
    province_or_territory: string
    delivery_charges: number
    delivery_service_name: string
    map_url?: string
  }
}
