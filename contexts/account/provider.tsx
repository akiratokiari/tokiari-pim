'use client'
import { FC, ReactNode, useEffect, useState } from 'react'
import { AccountContext } from './context'
import { createClient } from '@/utils/supabase/client'
import { UserType } from '@/app/wholesale/(src)/account/page'

type Props = {
  children: ReactNode
}

export const AccountProvider: FC<Props> = ({ children }) => {
  const supabase = createClient()
  const [account, setAccount] = useState<UserType>()

  async function getLoginUser() {
    try {
      const { data } = await supabase.auth.getUser()
      data.user?.id

      const userData = await supabase
        .from('users')
        .select()
        .eq('id', data.user?.id)
        .returns<UserType[]>()
      if (userData.data && userData.data[0]) {
        setAccount({ ...userData.data[0] })
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
