'use client'
import { FC } from 'react'
import style from './style.module.css'
import Link from 'next/link'
import { WHOLESALE_ROUTE } from '@/constants/route'
import { toQuery } from '@/helper/toQuery'
import { CategoryArray } from '@/constants/category'
import { ColorArray } from '@/constants/color'

type Props = {
  searchParams: ProductsFilterSearchParamsType
}

type ProductsFilterSearchParamsType = {
  color?: string
  keyword?: string
  category?: string
  current?: string
}

export const ProductsFilter: FC<Props> = ({ searchParams }) => {
  return (
    <div className={style.body}>
      <div className={style.wrapper}>
        <div className={style.title}>KEYWORD</div>
        <input />
      </div>
      <div className={style.wrapper}>
        <div className={style.title}>CATEGORY</div>
        <div className={style.menus}>
          {CategoryArray.map((c, index) => {
            return (
              <Link key={index} href={WHOLESALE_ROUTE + toQuery({ category: c })}>
                <div className={style.menu}>{c}</div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className={style.wrapper}>
        <div className={style.title}>COLOR</div>
        <div className={style.menus}>
          {ColorArray.map((c, index) => {
            if (!c.value.includes('×')) {
              return (
                <Link key={index} href={WHOLESALE_ROUTE + toQuery({ color: c.value })}>
                  <div className={style.menu}>{c.value}</div>
                </Link>
              )
            }
          })}
          <div className={style.menu}>その他</div>
        </div>
      </div>
    </div>
  )
}
