'use client'
import { AccountProvider } from '@/contexts/account/provider'
import { CartProvider } from '@/contexts/cart/provider'
import { MenuProvider } from '@/contexts/menu/provider'

type Props = {
  children: React.ReactNode
}

export default function Provider({ children }: Props) {
  return (
    <AccountProvider>
      <MenuProvider>
        <CartProvider>{children}</CartProvider>
      </MenuProvider>
    </AccountProvider>
  )
}
