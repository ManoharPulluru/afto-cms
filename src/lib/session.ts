import { getStoreSlug } from '@/lib/store-slug'

const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/** Per-tenant cookie so :3000 and :3001 on localhost do not share sessions. */
export function getSessionCookieName(): string {
  const slug = getStoreSlug().replace(/[^a-z0-9_-]/gi, '_')
  return `studio_session_${slug}`
}

function getSecret(): string {
  return process.env.STUDIO_SECRET || process.env.PAYLOAD_SECRET || 'dev-studio-secret-change-me'
}

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
  const binary = atob(base64 + padding)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function base64UrlToBytes(input: string): Uint8Array {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
  const binary = atob(base64 + padding)
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

function bytesToBase64Url(bytes: ArrayBuffer): string {
  const view = new Uint8Array(bytes)
  let binary = ''
  view.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function getSecretKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

export async function createSessionToken(email: string): Promise<string> {
  const payload = toBase64Url(
    JSON.stringify({ email, exp: Date.now() + SESSION_MAX_AGE * 1000 }),
  )
  const key = await getSecretKey()
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return `${payload}.${bytesToBase64Url(signature)}`
}

export async function verifySessionToken(token: string): Promise<{ email: string } | null> {
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null

  try {
    const key = await getSecretKey()
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      new Uint8Array(base64UrlToBytes(signature)),
      new TextEncoder().encode(payload),
    )
    if (!valid) return null

    const data = JSON.parse(fromBase64Url(payload)) as { email: string; exp: number }
    if (Date.now() > data.exp) return null
    return { email: data.email }
  } catch {
    return null
  }
}

export { SESSION_MAX_AGE }
