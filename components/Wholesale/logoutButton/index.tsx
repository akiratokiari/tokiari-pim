'use client'
import { Button } from '@/components/button'
import { WHOLESALE_LOGIN_ROUTE } from '@/constants/route'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ButtonHTMLAttributes, FC } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement>

export const LogoutButton: FC<Props> = () => {
  const router = useRouter()
  const supabase = createClient()
  const signOut = async () => {
    await supabase.auth
      .signOut()
      .then(() => {
        router.push(WHOLESALE_LOGIN_ROUTE)
      })
      .catch(() => {
        alert('予期せぬエラーが発生しました')
      })
  }

  return (
    <Button color="white" onClick={signOut}>
      ログアウト
    </Button>
  )
}
