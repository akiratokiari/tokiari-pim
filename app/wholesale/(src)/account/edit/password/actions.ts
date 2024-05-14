'use server'
import { WHOLESALE_ACCOUNT_ROUTE } from '@/constants/route'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateUserPassword(
  _: {
    isComplete: boolean
    message?: string
  },
  formData: FormData
) {
  const supabase = createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser(
    { password: password },
    { emailRedirectTo: 'http://localhost:3000/wholesale/auth' }
  )
  if (error) {
    return { isComplete: false, message: '予期せぬエラーが発生しました' }
  }

  revalidatePath('/', 'layout')
  redirect(WHOLESALE_ACCOUNT_ROUTE)
}
