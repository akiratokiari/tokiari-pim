import { createContext } from 'react'

export type CartItemType = {
  id: string
  product_group_code: string
  series: {
    id: string
    color: string
    seriesNumber: string
    variants: {
      id: string
      size: string
      quantity: number
      modelNumber: string
    }[]
  }[]
}

export type CartItemTypeWithAmount = {
  id: string
  product_group_code: string
  series: {
    id: string
    color: string
    seriesNumber: string
    variants: {
      id: string
      size: string
      quantity: number
      modelNumber: string
      amount: number
    }[]
  }[]
}

type Context = {
  cart: CartItemType[]
  addToCart: (item: CartItemType) => void
  updateQuantity: (variantId: string, variantSizeId: string, amount: number) => void
  setQuantity: (variantId: string, variantSizeId: string, quantity: number) => void
}

export const CartContext = createContext<Context>({
  cart: [],
  addToCart() {},
  updateQuantity() {},
  setQuantity() {}
})
