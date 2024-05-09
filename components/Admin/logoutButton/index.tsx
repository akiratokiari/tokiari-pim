'use client'
import { ADMIN_LOGIN_ROUTE } from '@/constants/route'
import { createClient } from '@/utils/supabase/client'
import { Button } from 'antd'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

export const LogoutButton: FC = () => {
  const router = useRouter()
  const supabase = createClient()
  const signOut = async () => {
    await supabase.auth
      .signOut()
      .then(() => {
        router.push(ADMIN_LOGIN_ROUTE)
      })
      .catch(() => {
        alert('予期せぬエラーが発生しました')
      })
  }

  return <Button onClick={signOut}>ログアウト</Button>
}
