'use server'
import { WHOLESALE_AUTH_ROUTE, WHOLESALE_REGISTER_COMPLETE_ROUTE } from '@/constants/route'
import { getBaseUrl } from '@/helper/getBaseUrl'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function register(_: string | null, formData: FormData) {
  const supabase = createClient()
  const signUpData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }

  const { error } = await supabase.auth.signUp({
    email: signUpData.email,
    password: signUpData.password,
    options: {
      emailRedirectTo: `${getBaseUrl() + WHOLESALE_AUTH_ROUTE}`
    }
  })

  if (error) {
    return '予期せぬエラーが発生しました'
  }

  revalidatePath('/', 'layout')
  redirect(WHOLESALE_REGISTER_COMPLETE_ROUTE)
}
