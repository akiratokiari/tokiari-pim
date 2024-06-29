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
  const [value, setValue] = useState<string | number>(data.quantity)
  const { addToCart } = useContext(CartContext)

  const handleQuantityChange = (amount: number) => {
    const newValue = (typeof value === 'string' ? parseInt(value, 10) : value) + amount
    setValue(newValue < 1 ? 1 : newValue)
  }

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue === '') {
      setValue('')
      setTimeout(() => {
        if (e.target.value === '') {
          setValue(1)
        }
      }, 1000) // 1 second delay
    } else {
      const numericValue = parseInt(inputValue, 10)
      if (!isNaN(numericValue) && numericValue >= 1) {
        setValue(numericValue)
      }
    }
  }

  const handleAddToCart = () => {
    const quantity = typeof value === 'string' ? parseInt(value, 10) : value

    const cartItem: CartItemType = {
      // 基準(SKU)
      productId: data.productId,
      modelId: data.modelId,
      seriesId: data.seriesId,
      product_group_code: data.product_group_code,
      seriesNumber: data.seriesNumber,
      modelNumber: data.modelNumber,
      quantity: quantity,
      color: data.color,
      price: data.price,
      size: data.size,
      title: data.title,
      thumbnail: data.thumbnail
    }

    addToCart(cartItem)
    setValue(1)
  }

  return (
    <div className={style.body}>
      <div className={style.size}>size : {data.size}</div>
      <div className={style.counter}>
        <button className={style.counterButton} onClick={() => handleQuantityChange(-1)}>
          <Image src={RemoveSVG} alt={RemoveSVG} />
        </button>
        <input
          className={style.input}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleQuantityInput}
        />
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
