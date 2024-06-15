'use client'
import { FC, ReactNode, useEffect, useState } from 'react'
import { AccountContext } from './context'
import { createClient } from '@/utils/supabase/client'
import { UsersRowType } from '@/utils/supabase/type'

type Props = {
  children: ReactNode
}

export const AccountProvider: FC<Props> = ({ children }) => {
  const supabase = createClient()
  const [account, setAccount] = useState<UsersRowType>()

  async function getLoginUser() {
    try {
      const { data } = await supabase.auth.getUser()
      if (data.user?.id) {
        const userData = await supabase.from('users').select().eq('id', data.user.id)

        if (userData.data && userData.data[0]) {
          setAccount({ ...userData.data[0] })
        }
      }
    } catch {
      return null
    }
  }

  useEffect(() => {
    getLoginUser()
  }, [])

  const refresh = async () => {
    getLoginUser()
  }

  const v = {
    account,
    refresh
  }
  return <AccountContext.Provider value={v}>{children}</AccountContext.Provider>
}
