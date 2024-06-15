'use client'
import { ADMIN_LOGIN_ROUTE } from '@/constants/route'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { AnchorHTMLAttributes, FC } from 'react'

type Props = AnchorHTMLAttributes<HTMLAnchorElement>

export const LogoutButton: FC<Props> = ({ ...props }) => {
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

  return (
    <a style={{ textAlign: 'center' }} {...props} onClick={signOut}>
      ログアウト
    </a>
  )
}
