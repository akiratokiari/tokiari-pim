'use client'
import { WHOLESALE_ACCOUNT_ROUTE, WHOLESALE_ROUTE } from '@/constants/route'

import Link from 'next/link'
import { FC } from 'react'
import style from './style.module.css'
import CartModal from '../cartModal'

type Props = {}

export const Header: FC<Props> = () => {
  return (
    <div className={style.body}>
      <Link className={style.logo} href={WHOLESALE_ROUTE}>
        TOKIARI
      </Link>
      <div className={style.navigation}>
        <div className={style.menuWrapper}>
          <Link className={style.menu} href={'/wholesale/search'}>
            PRODUCTS
          </Link>
          <Link className={style.menu} href={WHOLESALE_ACCOUNT_ROUTE}>
            😀
          </Link>
          <CartModal />
        </div>
      </div>
    </div>
  )
}
