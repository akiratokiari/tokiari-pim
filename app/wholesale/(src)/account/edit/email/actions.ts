'use server'
import { createClient } from '@/utils/supabase/server'

export async function updateUserEmail(
  _: {
    isComplete: boolean
    message?: string
  },
  formData: FormData
) {
  const supabase = createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.updateUser(
    { email: email },
    { emailRedirectTo: 'http://localhost:3000/wholesale/auth' }
  )
  if (error) {
    return { isComplete: false, message: '予期せぬエラーが発生しました' }
  }

  return { isComplete: true, message: email }
}
