'use client'
import { AccountProvider } from '@/contexts/account/provider'

type Props = {
  children: React.ReactNode
}

export default function Provider({ children }: Props) {
  return <AccountProvider>{children}</AccountProvider>
}
