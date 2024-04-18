'use client'
import { Product } from '@/type/product'
import { FC } from 'react'
import { ProductCard } from '../productCard'
import style from './style.module.css'
import Link from 'next/link'
import { PRODUCT_DETAIL_ROUTE } from '@/constants/route'
import toHref from '@/helper/toHref'

type Props = {
  products: [] | Product[]
}

export const ProductGrid: FC<Props> = ({ products }) => {
  return (
    <div className={style.body}>
      {products.map((p) => {
        return (
          <Link key={p.id} href={toHref(PRODUCT_DETAIL_ROUTE, { id: p.series })}>
            <ProductCard product={p} />
          </Link>
        )
      })}
    </div>
  )
}
