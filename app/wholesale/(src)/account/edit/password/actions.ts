'use server'
import { WHOLESALE_ACCOUNT_ROUTE } from '@/constants/route'
import { getBaseUrl } from '@/helper/getBaseUrl'
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
  const rePassword = formData.get('re-password') as string

  if (rePassword === password) {
    const { error } = await supabase.auth.updateUser(
      { password: password },
      { emailRedirectTo: `${getBaseUrl()}/wholesale/auth` }
    )
    if (error) {
      return { isComplete: false, message: '予期せぬエラーが発生しました' }
    }
  } else {
    return { isComplete: false, message: '入力内容に誤りがあります' }
  }

  revalidatePath('/', 'layout')
  redirect(WHOLESALE_ACCOUNT_ROUTE)
}
