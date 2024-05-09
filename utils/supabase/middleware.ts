import {
  ADMIN_LOGIN_ROUTE,
  ADMIN_ROUTE,
  WHOLESALE_AUTH_ROUTE,
  WHOLESALE_LOGIN_ROUTE,
  WHOLESALE_REGISTER_COMPLETE_ROUTE,
  WHOLESALE_REGISTER_ROUTE,
  WHOLESALE_ROUTE
} from '@/constants/route'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options
          })
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          })
          response.cookies.set({
            name,
            value,
            ...options
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options
          })
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          })
          response.cookies.set({
            name,
            value: '',
            ...options
          })
        }
      }
    }
  )

  const loginUser = await supabase.auth.getUser()
  const url = new URL(request.url)

  if (
    url.pathname === ADMIN_LOGIN_ROUTE ||
    url.pathname === WHOLESALE_LOGIN_ROUTE ||
    url.pathname === WHOLESALE_REGISTER_ROUTE ||
    url.pathname === WHOLESALE_REGISTER_COMPLETE_ROUTE ||
    url.pathname === WHOLESALE_AUTH_ROUTE
  ) {
    return response
  }

  function redirectToLogin(area: string) {
    return NextResponse.redirect(new URL(`/${area}/login`, request.url))
  }

  // 管理-認証
  if (url.pathname.includes(ADMIN_ROUTE)) {
    if (!loginUser.data || loginUser.data.user?.app_metadata.userrole !== 'ADMIN') {
      return redirectToLogin('admin')
    }
  }

  // 卸販売-認証
  if (url.pathname.includes(WHOLESALE_ROUTE) && (!loginUser.data || !loginUser.data.user)) {
    return redirectToLogin('wholesale')
  }

  return response
}
