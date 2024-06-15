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

  const { error, data } = await supabase.auth.signInWithPassword(payload)
  if (error) {
    return '予期せぬエラーが発生しました'
  }

  const userData = await supabase.from('users').select('user_role').eq('id', data.user.id).single()

  if (userData.data && userData.data.user_role !== USER_ROLE.Buyer) {
    await supabase.auth.signOut()
    return '予期せぬエラーが発生しました'
  }

  revalidatePath('/', 'layout')
  redirect(`${getBaseUrl() + WHOLESALE_ROUTE}`)
}
