'use client'
import { FC } from 'react'
import style from './style.module.css'
import Link from 'next/link'
import { toQuery } from '@/helper/toQuery'
import { usePathname } from 'next/navigation'

export const SortFilter: FC = () => {
  const pathname = usePathname()

  return (
    <div className={style.body}>
      <div className={style.title}>Sort</div>
      <div className={style.menus}>
        <Link href={pathname + toQuery({ sort: 'latest' })}>
          <div className={style.menu}>Latest </div>
        </Link>
        <Link href={pathname + toQuery({ sort: 'low-to-high' })}>
          <div className={style.menu}>Price: Low to high</div>
        </Link>
        <Link href={pathname + toQuery({ sort: 'high-to-low' })}>
          <div className={style.menu}>Price: High to low</div>
        </Link>
      </div>
    </div>
  )
}
