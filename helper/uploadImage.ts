import { createClient } from '@/utils/supabase/client'

export const uploadImage = async (file: File, filename: string) => {
  const supabase = createClient()
  const { data } = await supabase.storage.from('avatars').upload(filename, file, {
    cacheControl: '3600',
    upsert: false
  })

  return { imagePath: data?.path }
}
