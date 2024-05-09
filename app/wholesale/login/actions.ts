'use server'
import { WHOLESALE_ROUTE } from '@/constants/route'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(_: string | null, formData: FormData) {
  const supabase = createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    return '予期せぬエラーが発生しました'
  }

  revalidatePath('/', 'layout')
  redirect(WHOLESALE_ROUTE)
}
