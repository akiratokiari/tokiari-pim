import { CartContext, CartItemType } from '@/contexts/cart/context'
import React, { FC, useContext, useState } from 'react'
import style from './style.module.css'
import Image from 'next/image'
import AddSVG from '../../../public/add.svg'
import RemoveSVG from '../../../public/remove.svg'

type Props = {
  data: CartItemType
}

export const VariantSizeSelector: FC<Props> = ({ data }) => {
  const [value, setValue] = useState(data.quantity)
  const { addToCart } = useContext(CartContext)

  const handleQuantityChange = (amount: number) => {
    const newValue = value + amount
    setValue(newValue < 1 ? 1 : newValue)
  }

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value)
    setValue(inputValue)
  }

  const handleAddToCart = () => {
    const cartItem: CartItemType = {
      // 基準(SKU)
      productId: data.productId,
      modelId: data.modelId,
      seriesId: data.seriesId,
      product_group_code: data.product_group_code,
      seriesNumber: data.seriesNumber,
      modelNumber: data.modelNumber,
      quantity: value,
      color: data.color,
      price: data.price,
      size: data.size,
      title: data.title,
      thumbnail: data.thumbnail
    }

    addToCart(cartItem)
  }

  return (
    <div className={style.body}>
      <div className={style.size}>size : {data.size}</div>
      <div className={style.counter}>
        <button className={style.counterButton} onClick={() => handleQuantityChange(-1)}>
          <Image src={RemoveSVG} alt={RemoveSVG} />
        </button>
        <input className={style.input} type="number" value={value} onChange={handleQuantityInput} />
        <button className={style.counterButton} onClick={() => handleQuantityChange(1)}>
          <Image src={AddSVG} alt={AddSVG} />
        </button>
      </div>
      <button className={style.button} onClick={handleAddToCart}>
        カートに追加する
      </button>
    </div>
  )
}
