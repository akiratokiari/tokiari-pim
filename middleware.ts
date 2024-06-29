import { NextResponse, type NextRequest } from 'next/server'
import {
  ADMIN_LOGIN_ROUTE,
  ADMIN_ROUTE,
  WHOLESALE_AUTH_COMPLETE_ROUTE,
  WHOLESALE_AUTH_ROUTE,
  WHOLESALE_LOGIN_ROUTE,
  WHOLESALE_RESET_PASSWORD,
  WHOLESALE_ROUTE,
  WHOLESALE_UPDATE_PASSWORD
} from './constants/route'
import { wholesaleMiddleware } from './utils/supabase/wholesaleMiddleware'
import { adminMiddleware } from './utils/supabase/adminMiddleware'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  })
  const url = new URL(request.url)

  // 無視するRoute
  if (
    url.pathname === ADMIN_LOGIN_ROUTE ||
    url.pathname === WHOLESALE_LOGIN_ROUTE ||
    url.pathname === WHOLESALE_RESET_PASSWORD ||
    url.pathname === WHOLESALE_AUTH_ROUTE ||
    url.pathname === WHOLESALE_AUTH_COMPLETE_ROUTE ||
    url.pathname === WHOLESALE_UPDATE_PASSWORD
  ) {
    return response
  }

  // 管理者のMiddleware
  if (url.pathname.includes(ADMIN_ROUTE)) {
    return await adminMiddleware(request)
  }
  // バイヤーのMiddleware
  if (url.pathname.includes(WHOLESALE_ROUTE)) {
    return await wholesaleMiddleware(request)
  }
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
