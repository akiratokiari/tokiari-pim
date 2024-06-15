'use server'
import { createClient } from '@/utils/supabase/server'

export async function updateUserPassword(
  _: {
    isComplete: boolean
    message?: string
  },
  formData: FormData
) {
  const supabase = createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password
  })
  if (error) {
    return { isComplete: false, message: '予期せぬエラーが発生しました' }
  }
  await supabase.auth.signOut()
  return { isComplete: true, message: '' }
}
