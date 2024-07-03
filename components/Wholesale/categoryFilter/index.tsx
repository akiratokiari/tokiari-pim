'use client'
import { FC } from 'react'
import style from './style.module.css'
import Link from 'next/link'
import { CategoryArray } from '@/constants/category'
import { useParams, useRouter } from 'next/navigation'

export const CategoryFilter: FC = () => {
  const router = useRouter()
  const { category } = useParams()
  return (
    <>
      <div className={style.desktop}>
        <div className={style.title}>CATEGORY</div>
        <div className={style.menus}>
          <Link href={`/wholesale/search`}>
            <div className={style.menu}>All Products</div>
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
        <select
          defaultValue={category || 'All Products'}
          className={style.select}
          onChange={(e) => {
            if (e.target.value === 'All Products') {
              return router.push(`/wholesale/search`)
            }
            router.push(`/wholesale/search/${e.target.value}`)
          }}
        >
          <option className={style.menu} value="All Products">
            All Products
          </option>
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
