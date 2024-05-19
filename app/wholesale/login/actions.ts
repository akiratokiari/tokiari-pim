'use server'
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
  const userData = await supabase.from('users').select('company').eq('id', data.user.id)
  if (userData.data && !userData.data[0].company) {
    revalidatePath('/', 'layout')
    redirect('http://localhost:3000/wholesale/account/welcome')
  }

  revalidatePath('/', 'layout')
  redirect('http://localhost:3000/wholesale')
}
