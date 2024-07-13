'use client'
import Link from 'next/link'
import { FC, Suspense, useContext, useEffect } from 'react'
import style from './style.module.css'

import { AccountContext } from '@/contexts/account/context'
import Menu from '../menu'

type Props = {}

export const Header: FC<Props> = () => {
  const { refresh } = useContext(AccountContext)

  useEffect(() => {
    refresh()
  }, [])

  return (
    <>
      <div className={style.body}>
        <Link className={style.logo} href={'/'}>
          TOKIARI
        </Link>
        <div className={style.navigation}>
          <div className={style.menuWrapper}>
            <Suspense>
              <Menu />
            </Suspense>
          </div>
        </div>
      </div>
      <div className={style.headerHeight} />
    </>
  )
}
