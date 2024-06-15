import { FC } from 'react'
import style from './style.module.css'

type Props = { product: any }

export const ProductCard: FC<Props> = ({ product }) => {
  return <div className={style.body}>{product.id}</div>
}
