import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const isLoginPage = request.nextUrl.pathname === '/login'

  // Login sayfasındaysa ve token varsa, dashboard'a yönlendir
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Login sayfası değilse ve token yoksa, login'e yönlendir
  if (!isLoginPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Hangi route'lara uygulanacak
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}