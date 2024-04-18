import { Product } from '@/type/product'
import { FC } from 'react'
import style from './style.module.css'

type Props = { product: Product }

export const ProductCard: FC<Props> = ({ product }) => {
  return <div className={style.body}>{product.id}</div>
}
