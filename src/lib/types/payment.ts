export type PaymentBillSummary = {
  subtotal: number
  subtotalAfterDiscount: number
  tax: number
  deliveryCharge: number
  total: number
  hasCoupon: boolean
}

export type PaymentIntentSetup = {
  clientSecret: string
  publishableKey: string
  stripeAccountId?: string
}

export type ConfirmOrderPayload = {
  delivery_details?: {
    validated_address: string
    city: string
    pincode: string
    province_or_territory: string
    delivery_charges: number
    delivery_service_name: string
    map_url?: string
  }
  customer_details: {
    email: string
  }
}
