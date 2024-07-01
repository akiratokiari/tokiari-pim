'use client'
import { FC } from 'react'
import style from './style.module.css'
import Link from 'next/link'
import { WHOLESALE_ROUTE } from '@/constants/route'
import { toQuery } from '@/helper/toQuery'
import { CategoryArray } from '@/constants/category'

type Props = {
  children: React.ReactNode
  searchParams: ProductsFilterSearchParamsType
}

type ProductsFilterSearchParamsType = {
  sort?: string
  keyword?: string
  category?: string
}

export const ProductsFilter: FC<Props> = ({ searchParams }) => {
  return (
    <div className={style.body}>
      <div className={style.wrapper}>
        <div className={style.title}>KEYWORD</div>
        <input />
        <div className={style.title}>CATEGORY</div>
        <div className={style.menus}>
          <Link href={WHOLESALE_ROUTE + toQuery({ category: 'all' })}>
            <div className={style.menu}>All</div>
          </Link>
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
        <div className={style.title}>Sort</div>
        <div className={style.menus}>
          <Link href={WHOLESALE_ROUTE + toQuery({ sort: 'latest' })}>
            <div className={style.menu}>Latest </div>
          </Link>
          <Link href={WHOLESALE_ROUTE + toQuery({ sort: 'low-to-high' })}>
            <div className={style.menu}>Price: Low to high</div>
          </Link>
          <Link href={WHOLESALE_ROUTE + toQuery({ sort: 'high-to-low' })}>
            <div className={style.menu}>Price: High to low</div>
          </Link>
          <div className={style.menu}>その他</div>
        </div>
      </div>
    </div>
  )
}
