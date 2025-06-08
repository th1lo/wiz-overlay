import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Only protect overlay and dashboard routes
  if (!request.nextUrl.pathname.startsWith('/overlay') && 
      !request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  // In development, allow access to dashboard without auth
  if (process.env.NODE_ENV === 'development' && 
      request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  // Check if the user is already authenticated
  const isAuthenticated = request.cookies.has('overlay-auth')
  
  // If authenticated, allow access
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // If not authenticated and not on the auth page, redirect to auth
  if (!request.nextUrl.pathname.startsWith('/overlay/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/overlay/auth'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/overlay/:path*', '/dashboard/:path*'],
} 