import { USER_ROLE } from '@/constants/app'
import { WHOLESALE_LOGIN_ROUTE, WHOLESALE_ROUTE } from '@/constants/route'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function wholesaleMiddleware(request: NextRequest) {
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
          response.cookies.set({
            name,
            value,
            ...options
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options
          })
        }
      }
    }
  )

  const url = new URL(request.url)

  const { data, error } = await supabase.auth.getUser()

  if (error) {
    return NextResponse.redirect(new URL(WHOLESALE_LOGIN_ROUTE, request.url), 302)
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('user_role')
    .eq('id', data.user.id)
    .single()

  if (userError || !userData) {
    return NextResponse.redirect(new URL(WHOLESALE_ROUTE, request.url), 302)
  }

  const loginUser = {
    user_role: userData.user_role
  }

  if (loginUser.user_role === USER_ROLE.Buyer) {
    return response
  }

  return response
}
