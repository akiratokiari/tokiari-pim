import { USER_ROLE } from '@/constants/app'
import { ADMIN_LOGIN_ROUTE } from '@/constants/route'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from './server'

export async function adminMiddleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  })
  const supabase = createClient()

  const loginUser = await supabase.auth.getUser()
  if (loginUser.error || !loginUser.data) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_ROUTE, request.url), 302)
  }

  const { data: userData, error } = await supabase
    .from('users')
    .select('user_role')
    .eq('id', loginUser.data.user?.id)
    .single()

  if (error || userData.user_role !== USER_ROLE.Admin) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_ROUTE, request.url), 302)
  }

  return response
}
