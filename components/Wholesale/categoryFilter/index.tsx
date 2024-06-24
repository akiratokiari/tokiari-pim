'use client'
import { FC } from 'react'
import style from './style.module.css'
import Link from 'next/link'
import { CategoryArray } from '@/constants/category'
import { usePathname } from 'next/navigation'

export const CategoryFilter: FC = () => {
  const pathname = usePathname()
  console.log(pathname)
  return (
    <div className={style.body}>
      <div className={style.title}>CATEGORY</div>
      <div className={style.menus}>
        <Link href={`/wholesale/search`}>
          <div className={style.menu}>All</div>
        </Link>
        {CategoryArray.map((c, index) => {
          return (
            <Link key={index} href={`/wholesale/search/${c}`}>
              <div className={style.menu}>{c}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
