import { NextResponse, NextRequest } from 'next/server'

/**
 * Middleware to handle authentication for private routes
 */
export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value
  // const { pathname } = request.nextUrl

  // Create the response object early
  const response = NextResponse.next()


  // If no token and accessing a private route, redirect to home
  if (!authToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If token exists, attach it as Authorization header (optional)
  response.headers.set('Authorization', `Bearer ${authToken}`)

  return response
}

// Apply middleware ONLY to private routes
export const config = {
  matcher: [
    '/instructor/:path*',
    '/create-course',
    '/edit-profile',
    '/account-security',
    '/my-learnings',
    '/my-wishlist',
    '/courses/:path*',
    '/course-details/:path*',
    '/notifications',
    '/transaction-history',
    '/delete-account',
    '/become-instructor/:path*',
  ],
}
