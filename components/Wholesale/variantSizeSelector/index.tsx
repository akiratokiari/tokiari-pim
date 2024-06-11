import { CartContext } from '@/contexts/cart/context'
import React, { FC, useContext, useState } from 'react'
import { ProductType } from '../ProductVariantSelector'

type variantData = {
  id: string
  color: string
  seriesNumber: string
}
type variantSizeData = {
  id: string
  size: string
  modelNumber: string
}

type Props = {
  productData: ProductType
  variantData: variantData
  variantSizeData: variantSizeData
}

export const VariantSizeSelector: FC<Props> = ({ productData, variantData, variantSizeData }) => {
  const [value, setValue] = useState(1)
  const [isInputMode, setIsInputMode] = useState(false)
  const { addToCart } = useContext(CartContext)

  const handleQuantityChange = (amount: number) => {
    const newValue = value + amount
    if (newValue >= 10) {
      setIsInputMode(true)
    } else if (newValue < 10) {
      setIsInputMode(false)
    }
    setValue(newValue < 1 ? 1 : newValue)
  }

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value)
    setValue(inputValue < 1 ? 1 : inputValue)
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = Number(e.target.value)
    setValue(selectedValue)
    if (selectedValue >= 10) {
      setIsInputMode(true)
    }
  }

  const handleAddToCart = () => {
    const data = {
      id: productData.id,
      product_group_code: productData.product_group_code,
      series: [
        {
          id: variantData.id,
          color: variantData.color,
          seriesNumber: variantData.seriesNumber,
          variants: [
            {
              id: variantSizeData.id,
              size: variantSizeData.size,
              quantity: value,
              modelNumber: variantSizeData.modelNumber
            }
          ]
        }
      ]
    }

    addToCart(data)
  }

  return (
    <div>
      {variantSizeData.size}
      <button onClick={() => handleQuantityChange(-1)}>-</button>
      {isInputMode ? (
        <input type="number" value={value} onChange={handleQuantityInput} />
      ) : (
        <select value={value} onChange={handleSelectChange}>
          {[...Array(10)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      )}
      <button onClick={() => handleQuantityChange(1)}>+</button>
      <button onClick={handleAddToCart}>カートに追加する</button>
    </div>
  )
}
