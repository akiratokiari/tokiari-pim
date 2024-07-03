import { CartContext, CartItemType } from '@/contexts/cart/context'
import React, { FC, useContext, useEffect, useState, useRef } from 'react'
import style from './style.module.css'
import Image from 'next/image'
import AddSVG from '../../../public/add.svg'
import RemoveSVG from '../../../public/remove.svg'

type Props = {
  data: CartItemType
}

export const CartProductAmountInput: FC<Props> = ({ data }) => {
  const [value, setValue] = useState<string | number>(data.quantity)
  const { updateQuantity, deleteFromCart, isPending } = useContext(CartContext)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setValue(data.quantity)
  }, [data.quantity])

  const handleQuantityChange = (quantity: number) => {
    const newValue = (typeof value === 'string' ? parseInt(value, 10) : value) + quantity
    setValue(newValue < 1 ? 1 : newValue)
    if (typeof newValue === 'number') {
      updateQuantityWithDebounce(newValue)
    }
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
        updateQuantityWithDebounce(numericValue)
      }
    }
  }

  const updateQuantityWithDebounce = (quantity: number) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(() => {
      const cartItem: CartItemType = {
        ...data,
        quantity
      }
      updateQuantity(cartItem.product_variant_size_id, quantity)
    }, 500) // 500ミリ秒の遅延
  }

  return (
    <div className={style.body}>
      <div className={style.counter}>
        <button
          className={style.counterButton}
          onClick={() => !isPending && handleQuantityChange(-1)}
          disabled={isPending}
        >
          <Image src={RemoveSVG} alt="remove" />
        </button>
        <input
          className={style.input}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleQuantityInput}
          disabled={isPending}
        />
        <button
          className={style.counterButton}
          onClick={() => !isPending && handleQuantityChange(1)}
          disabled={isPending}
        >
          <Image src={AddSVG} alt="add" />
        </button>
      </div>
      <button
        onClick={() => !isPending && deleteFromCart(data.product_variant_size_id)}
        className={style.deleteButton}
        disabled={isPending}
      >
        Delete
      </button>
    </div>
  )
}
