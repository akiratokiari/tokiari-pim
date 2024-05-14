'use server'
import { WHOLESALE_ACCOUNT_ROUTE } from '@/constants/route'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateUser(_: string | null, formData: FormData) {
  const supabase = createClient()
  const signUpData = {
    plan: Number(formData.get('plan')),
    postal_code: formData.get('postal_code') as string,
    prefecture: formData.get('prefecture') as string,
    city: formData.get('city') as string,
    street_address: formData.get('street_address') as string,
    building_name: formData.get('building_name') as string,
    company: formData.get('company') as string,
    phone: formData.get('phone') as string,
    contact_name: formData.get('contact_name') as string,
    site_url: formData.get('site_url') as string
  }
  console.log(signUpData)
  const userId = (await supabase.auth.getUser()).data.user?.id
  if (!userId) {
    return '予期せぬエラーが発生しました'
  }
  try {
    await supabase.from('users').update(signUpData).eq('id', userId)
  } catch {
    return '予期せぬエラーが発生しました'
  }

  revalidatePath('/', 'layout')
  redirect(WHOLESALE_ACCOUNT_ROUTE)
}
