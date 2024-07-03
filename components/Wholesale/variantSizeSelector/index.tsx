import { CartContext, CartItemsType } from '@/contexts/cart/context'
import React, { FC, useContext, useEffect, useState } from 'react'
import style from './style.module.css'
import Image from 'next/image'
import AddSVG from '../../../public/add.svg'
import RemoveSVG from '../../../public/remove.svg'

type Props = {
  data: CartItemsType & { size: string }
}

export const VariantSizeSelector: FC<Props> = ({ data }) => {
  const [value, setValue] = useState<string | number>(data.quantity)

  const { addToCart, isOpen, isPending } = useContext(CartContext)

  const handleQuantityChange = (quantity: number) => {
    const newValue = (typeof value === 'string' ? parseInt(value, 10) : value) + quantity
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

    const cartItem: CartItemsType = {
      // 基準(SKU)
      product_id: data.product_id,
      product_variant_id: data.product_variant_id,
      product_variant_size_id: data.product_variant_size_id,
      quantity: quantity
    }

    addToCart(cartItem)
    setValue(1)
  }

  console.log(isPending)

  return (
    <div className={style.body}>
      <div className={style.size}>Size {data.size}</div>
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
        {isPending ? '...' : 'カートに追加'}
      </button>
    </div>
  )
}
