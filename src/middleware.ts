import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken, getSessionCookieName } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/studio') && pathname !== '/studio/login') {
    const token = request.cookies.get(getSessionCookieName())?.value
    const session = token ? await verifySessionToken(token) : null

    if (!session) {
      const loginUrl = new URL('/studio/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (pathname === '/studio/login') {
    const token = request.cookies.get(getSessionCookieName())?.value
    if (token && (await verifySessionToken(token))) {
      return NextResponse.redirect(new URL('/studio', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/studio/:path*'],
}
