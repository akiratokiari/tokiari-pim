import { CartContext, CartItemType } from '@/contexts/cart/context'
import React, { FC, useContext, useEffect, useState } from 'react'
import style from './style.module.css'
import Image from 'next/image'
import AddSVG from '../../../public/add.svg'
import RemoveSVG from '../../../public/remove.svg'

type Props = {
  data: CartItemType
}

export const CartProductAmountInput: FC<Props> = ({ data }) => {
  const [value, setValue] = useState<string | number>(data.quantity)
  const { updateQuantity, deleteFromCart } = useContext(CartContext)

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

  useEffect(() => {
    if (typeof value === 'number') {
      const cartItem: CartItemType = {
        ...data,
        quantity: value
      }
      updateQuantity(cartItem.modelId,value)
    }
  }, [value])

  return (
    <div className={style.body}>
      <div className={style.counter}>
        <button className={style.counterButton} onClick={() => handleQuantityChange(-1)}>
          <Image src={RemoveSVG} alt="remove" />
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
          <Image src={AddSVG} alt="add" />
        </button>
      </div>
      <button
        onClick={() => {
          deleteFromCart(data.modelId)
        }}
      >
        削除
      </button>
    </div>
  )
}
