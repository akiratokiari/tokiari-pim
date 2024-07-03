import { createContext } from 'react'

export type CartItemType = CartItemsType & {
  color: string
  title: string
  size: string
  thumbnail: string
  price: number
}

export type CartItemsType = {
  product_variant_size_id: string
  product_variant_id: string
  product_id: string
  quantity: number
}

type Context = {
  cart: CartItemType[] | []
  isOpen: boolean
  isPending: boolean
  closeCart: () => void
  openCart: () => void
  addToCart: (item: CartItemsType) => void
  updateQuantity: (modelId: string, quantity: number) => void
  deleteFromCart: (modelId: string) => void
  resetCart: () => void
}

export const CartContext = createContext<Context>({
  cart: [],
  isOpen: false,
  isPending: false,
  closeCart() {},
  openCart() {},
  addToCart() {},
  updateQuantity() {},
  deleteFromCart() {},
  resetCart() {}
})
