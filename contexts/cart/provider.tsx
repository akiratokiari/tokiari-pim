import React, { useState, FC, useEffect } from 'react'
import { CartContext, CartItemType } from './context'

export const CartProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItemType[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const _storageItems = localStorage.getItem('cart_items')
      const storageItems = _storageItems ? JSON.parse(_storageItems) : []
      if (storageItems.length > 0) setCart(storageItems)
    }
  }, [])

  const closeCart = () => {
    setIsOpen(false)
  }
  const openCart = () => {
    setIsOpen(true)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart_items', JSON.stringify(cart))
    }
  }, [cart])

  const addToCart = (addItem: CartItemType) => {
    const isProductExist = cart.find((c) => c.modelId === addItem.modelId)

    if (!isProductExist) {
      const newCart = [...cart, addItem]
      setCart(newCart)
    } else {
      const updatedProduct = {
        ...isProductExist,
        quantity: isProductExist.quantity + addItem.quantity
      }
      const newCart = cart.map((c) => (c.modelId === isProductExist.modelId ? updatedProduct : c))
      setCart(newCart)
    }
    setIsOpen(true)
  }

  const updateQuantity = (modelId: string, quantity: number) => {
    const newCart = cart.map((item) => (item.modelId === modelId ? { ...item, quantity } : item))
    setCart(newCart)
  }

  const deleteFromCart = (modelId: string) => {
    const newCart = cart.filter((item) => item.modelId !== modelId)
    setCart(newCart)
  }

  // コンテキストプロバイダに渡す値を定義
  const contextValue = {
    cart,
    isOpen,
    addToCart,
    openCart,
    updateQuantity,
    deleteFromCart,
    closeCart
  }

  // CartContext.Provider で子コンポーネントをラップしてコンテキストを提供
  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}
