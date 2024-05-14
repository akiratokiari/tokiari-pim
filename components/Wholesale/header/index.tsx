'use client'
import { WHOLESALE_ACCOUNT_ROUTE } from '@/constants/route'
import { AccountContext } from '@/contexts/account/context'
import Link from 'next/link'
import { FC, useContext } from 'react'
import { LogoutButton } from '../logoutButton'

type Props = {}

export const Header: FC<Props> = () => {
  const { account } = useContext(AccountContext)
  return (
    <div style={{ marginBottom: 20, backgroundColor: 'lightgray' }}>
      <div style={{ marginBottom: 20 }}>
        <div>{account?.company && account.company}</div>
        <div>
          <Link href={WHOLESALE_ACCOUNT_ROUTE}>アカウント</Link>
        </div>
        <div>
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
