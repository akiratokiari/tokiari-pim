'use client'
import { WHOLESALE_ROUTE } from '@/constants/route'

import Link from 'next/link'
import { FC, Suspense, useContext, useEffect } from 'react'
import style from './style.module.css'
import CartModal from '../cartModal'
import Menu from '../menu'
import { AccountContext } from '@/contexts/account/context'

type Props = {}

export const Header: FC<Props> = () => {
  const {refresh} = useContext(AccountContext)

  useEffect(() => {
    refresh()
  },[])

  return (
    <>
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
      <div className={style.headerHeight} />
    </>
  )
}
