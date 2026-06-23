'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  fetchCustomerProfile,
  updateCustomerProfile,
} from '@/lib/customers-client-api'
import { formToUpdatePayload, profileToForm } from '@/lib/map-customer-response'
import type { CustomerDetailsForm } from '@/lib/types/customer'
import { EMPTY_CUSTOMER_FORM } from '@/lib/types/customer'

export function useCartDetailsForm(isActive: boolean) {
  const [form, setForm] = useState<CustomerDetailsForm>(EMPTY_CUSTOMER_FORM)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const profile = await fetchCustomerProfile()
      setForm(profileToForm(profile))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isActive) void loadProfile()
  }, [isActive, loadProfile])

  const saveProfile = useCallback(async () => {
    setIsSaving(true)
    setError(null)
    try {
      const profile = await updateCustomerProfile(formToUpdatePayload(form))
      setForm(profileToForm(profile))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [form])

  return { form, setForm, isLoading, isSaving, error, saveProfile, loadProfile }
}
