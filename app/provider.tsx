'use client'
import { AccountProvider } from '@/contexts/account/provider'
import { CartProvider } from '@/contexts/cart/provider'

type Props = {
  children: React.ReactNode
}

export default function Provider({ children }: Props) {
  return (
    <AccountProvider>
      <CartProvider>{children}</CartProvider>
    </AccountProvider>
  )
}
