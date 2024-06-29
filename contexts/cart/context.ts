import { createContext } from 'react'

export type CartItemType = {
  modelId: string
  seriesId: string
  productId: string
  product_group_code: string
  seriesNumber: string
  modelNumber: string
  color: string
  title: string
  size: string
  thumbnail: string
  quantity: number
  price: number
}

type Context = {
  cart: CartItemType[]
  isOpen: boolean
  closeCart: () => void
  openCart: () => void
  addToCart: (item: CartItemType) => void
  updateQuantity: (modelId: string, quantity: number) => void
  deleteFromCart: (modelId: string) => void
}

export const CartContext = createContext<Context>({
  cart: [],
  isOpen: false,
  closeCart() {},
  openCart() {},
  addToCart() {},
  updateQuantity() {},
  deleteFromCart() {}
})
