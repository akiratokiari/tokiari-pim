import { FC } from 'react'
import style from './style.module.css'
import { ProductWithRelationType } from '@/utils/supabase/type'
import { ProductCard } from '../productCard'

type Props = { products: ProductWithRelationType[] }

export const ProductGrid: FC<Props> = ({ products }) => {
  return (
    <div className={style.wrapper}>
      {products.map((p) => {
        return <ProductCard key={p.id} product={p} />
      })}
    </div>
  )
}
