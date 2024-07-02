'use client'
import { WHOLESALE_ROUTE } from '@/constants/route'

import Link from 'next/link'
import { FC, Suspense } from 'react'
import style from './style.module.css'
import CartModal from '../cartModal'
import Menu from '../menu'

type Props = {}

export const Header: FC<Props> = () => {
  return (
    <div className={style.body}>
      <Link className={style.logo} href={WHOLESALE_ROUTE}>
        TOKIARI
      </Link>
      <div className={style.navigation}>
        <div className={style.menuWrapper}>
          <Suspense>
            <Menu />
          </Suspense>
          <CartModal />
        </div>
      </div>
    </div>
  )
}
