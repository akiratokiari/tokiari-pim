import { WHOLESALE_AUTH_COMPLETE_ROUTE } from '@/constants/route'
import { getBaseUrl } from '@/helper/getBaseUrl'
import { createClient } from '@/utils/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash
    })
    if (!error) {
      return NextResponse.redirect('/error')
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${getBaseUrl() + WHOLESALE_AUTH_COMPLETE_ROUTE}`)
}
