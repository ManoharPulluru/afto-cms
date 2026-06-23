import { NextResponse } from 'next/server'
import { authenticateUser, createSessionToken, getSessionCookieName, SESSION_MAX_AGE } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email: string; password: string }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const valid = await authenticateUser(email, password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createSessionToken(email)
    const response = NextResponse.json({ success: true })
    response.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
