import {
  ADMIN_LOGIN_ROUTE,
  ADMIN_ROUTE,
  WHOLESALE_AUTH_ROUTE,
  WHOLESALE_LOGIN_ROUTE,
  WHOLESALE_REGISTER_COMPLETE_ROUTE,
  WHOLESALE_REGISTER_ROUTE,
  WHOLESALE_RESET_PASSWORD,
  WHOLESALE_ROUTE,
  WHOLESALE_UPDATE_PASSWORD
} from '@/constants/route'
import { getBaseUrl } from '@/helper/getBaseUrl'
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
  const loginUserData = await supabase
    .from('users')
    .select('company')
    .eq('id', loginUser.data.user?.id)

  const url = new URL(request.url)

  if (
    url.pathname === ADMIN_LOGIN_ROUTE ||
    url.pathname === WHOLESALE_LOGIN_ROUTE ||
    url.pathname === WHOLESALE_REGISTER_ROUTE ||
    url.pathname === WHOLESALE_REGISTER_COMPLETE_ROUTE ||
    url.pathname === WHOLESALE_AUTH_ROUTE ||
    url.pathname === WHOLESALE_RESET_PASSWORD ||
    url.pathname === WHOLESALE_UPDATE_PASSWORD
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
    } else {
      return response
    }
  }

  if (url.pathname.includes(WHOLESALE_ROUTE) && (!loginUser.data || !loginUser.data.user)) {
    // 卸販売-認証
    return redirectToLogin('wholesale')
  }
  if (
    loginUserData.data &&
    !loginUserData.data[0].company &&
    !url.pathname.includes('/wholesale/account/welcome')
  ) {
    return NextResponse.redirect(`${getBaseUrl()}/wholesale/account/welcome`)
  }

  return response
}
