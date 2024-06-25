'use client'
import { FC } from 'react'
import style from './style.module.css'
import Link from 'next/link'
import { CategoryArray } from '@/constants/category'

export const CategoryFilter: FC = () => {
  return (
    <>
      <div className={style.desktop}>
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

      <div className={style.mobile}>
        <select className={style.select}>
          <option className={style.menu}>all</option>
          {CategoryArray.map((c, index) => {
            return (
              <option key={index} className={style.menu}>
                {c}
              </option>
            )
          })}
        </select>
      </div>
    </>
  )
}
