'use server'

import { WHOLESALE_UPDATE_PASSWORD } from '@/constants/route'
import { getBaseUrl } from '@/helper/getBaseUrl'
import { createClient } from '@/utils/supabase/server'

export async function resetUserPassword(
  _: {
    isComplete: boolean
    message?: string
  },
  formData: FormData
) {
  const supabase = createClient()
  const email = formData.get('email') as string

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getBaseUrl() + WHOLESALE_UPDATE_PASSWORD}`
  })

  if (error) {
    return { isComplete: false, message: '予期せぬエラーが発生しました' }
  }

  return { isComplete: true, message: email }
}
