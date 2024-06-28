'use server'

import { USER_ROLE } from '@/constants/app'
import { WHOLESALE_ROUTE } from '@/constants/route'
import { getBaseUrl } from '@/helper/getBaseUrl'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(_: string | null, formData: FormData) {
  const supabase = createClient()
  const payload = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }

  const { error } = await supabase.auth.signInWithPassword(payload)
  if (error) {
    return 'ログイン情報が間違っています'
  }

  const userData = await supabase
    .from('users')
    .select('user_role')
    .in('user_role', [USER_ROLE.Buyer, USER_ROLE.Admin])
    .single()

  if (
    (userData.data && userData.data.user_role !== USER_ROLE.Buyer) ||
    (userData.data && userData.data.user_role !== USER_ROLE.Admin)
  ) {
    await supabase.auth.signOut()
    return 'ログイン情報が間違っています'
  }

  revalidatePath('/', 'layout')
  redirect(`${getBaseUrl() + WHOLESALE_ROUTE}`)
}
