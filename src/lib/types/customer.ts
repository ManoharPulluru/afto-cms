export type CustomerAddress = {
  street: string
  city: string
  state: string
  country: string
  postal_code: string
}

export type CustomerProfile = {
  id: string
  name: string
  email: string
  phone_number: string
  address: CustomerAddress
  loyalty_points?: number
}

export type UpdateCustomerProfilePayload = {
  name: string
  email: string
  phone_number: string
  address: CustomerAddress
}

export type CustomerDetailsForm = {
  name: string
  phone: string
  email: string
  address: string
  city: string
  postalCode: string
  state: string
  country: string
}

export const EMPTY_CUSTOMER_FORM: CustomerDetailsForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  state: '',
  country: '',
}
