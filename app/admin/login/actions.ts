'use server'
import { USER_ROLE } from '@/constants/app'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(_: string | null, formData: FormData) {
  const supabase = createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }
  const { data: loginUser, error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    return '予期せぬエラーが発生しました'
  }

  const userData = await supabase
    .from('users')
    .select('user_role')
    .eq('id', loginUser.user.id)
    .single()
  console.log(userData)

  if (userData.data && userData.data.user_role !== USER_ROLE.Admin) {
    await supabase.auth.signOut()
    return '予期せぬエラーが発生しました'
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}
