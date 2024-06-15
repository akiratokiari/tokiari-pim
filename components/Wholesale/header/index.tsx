'use client'
import { WHOLESALE_ACCOUNT_ROUTE, WHOLESALE_CART_ROUTE, WHOLESALE_ROUTE } from '@/constants/route'

import Link from 'next/link'
import { FC } from 'react'
import style from './style.module.css'

type Props = {}

export const Header: FC<Props> = () => {
  return (
    <div className={style.body}>
      <Link className={style.logo} href={WHOLESALE_ROUTE}>
        TOKIARI
      </Link>
      <div className={style.navigation}>
        <div className={style.menuWrapper}>
          <Link className={style.menu} href={WHOLESALE_ROUTE}>
            PRODUCTS
          </Link>
          <Link className={style.menu} href={WHOLESALE_CART_ROUTE}>
            CART
          </Link>
          <Link className={style.menu} href={WHOLESALE_ACCOUNT_ROUTE}>
            ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  )
}
