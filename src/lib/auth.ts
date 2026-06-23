import { cookies } from 'next/headers'
import { loadStore } from '@/lib/store'
import { verifySessionToken, getSessionCookieName } from '@/lib/session'

export { createSessionToken, getSessionCookieName, SESSION_MAX_AGE } from '@/lib/session'

export async function authenticateUser(email: string, password: string): Promise<boolean> {
  const store = await loadStore()
  const user = store.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  )
  return Boolean(user)
}

export async function getSessionUser(): Promise<{ email: string; name: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(getSessionCookieName())?.value
  if (!token) return null

  const session = await verifySessionToken(token)
  if (!session) return null

  const store = await loadStore()
  const user = store.users.find((u) => u.email.toLowerCase() === session.email.toLowerCase())
  if (!user) return null

  return { email: user.email, name: user.name }
}
