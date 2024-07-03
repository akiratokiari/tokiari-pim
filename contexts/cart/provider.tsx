import React, { useState, FC, useEffect, useContext } from 'react'
import { CartContext, CartItemsType, CartItemType } from './context'
import { getUserCartItems } from '@/helper/getUserCartItems'
import { AccountContext } from '../account/context'
import { createClient } from '@/utils/supabase/client'

export type CartItemWithDataType = {
  product_variant_size_id: string
  product_variant_id: string
  product_id: string
  color: string
  title: string
  size: string
  thumbnail: string
  quantity: number
  price: number
}

export const CartProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItemType[]>([])
  const { account, refresh } = useContext(AccountContext)
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isInitial, setIsInitial] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const getFullCartItem = async (cartItems: CartItemType[]) => {
    const data = await Promise.all(
      cartItems.map(async (c: CartItemsType) => {
        const { data: cartItem } = await supabase
          .from('product_variants_size')
          .select(`*,product_variants(*,products(*), product_images(*))`)
          .eq('id', c.product_variant_size_id)
          .single()

        return {
          product_variant_size_id: cartItem?.id || '',
          product_variant_id: cartItem?.product_variant_id || '',
          product_id: cartItem?.product_variants?.products?.id || '',
          color: cartItem?.product_variants?.color || '',
          title: cartItem?.product_variants?.products?.title || '',
          size: cartItem?.product_size || '',
          thumbnail:
            cartItem?.product_variants?.product_images &&
            cartItem?.product_variants?.product_images.length > 0
              ? cartItem?.product_variants?.product_images[0].image_url
              : '' || '',
          quantity: c.quantity || 0,
          price: cartItem?.product_variants?.price || 0
        }
      })
    )
    return data
  }

  useEffect(() => {
    if (isInitial) return
    if (!account) return

    const data = getUserCartItems(account.cart_items)

    const fetchCartItems = async () => {
      const cartItems = await getFullCartItem(data)
      if (cartItems) setCart(cartItems)
    }

    fetchCartItems()
    setIsInitial(true)
  }, [isInitial, account])

  const closeCart = () => {
    setIsOpen(false)
  }
  const openCart = () => {
    setIsOpen(true)
  }

  const resetCart = async () => {
    if (!account) return
    setIsPending(true)
    const cartItemsJSON = JSON.stringify([])
    await supabase
      .from('users')
      .update({ cart_items: cartItemsJSON })
      .eq('id', account.id)
      .select('cart_items')
      .single()

    refresh()
    setIsPending(false)
  }

  const updateCart = async (_cart: CartItemsType[] | []) => {
    if (!account) return
    setIsPending(true)
    const cartItemsJSON = JSON.stringify(_cart)
    const { data, error } = await supabase
      .from('users')
      .update({ cart_items: cartItemsJSON })
      .eq('id', account.id)
      .select('cart_items')
      .single()

    if (error) {
      console.error('Error updating cart items:', error)
      setIsPending(false)
      return
    }

    if (data && typeof data.cart_items === 'string') {
      const parsedJSON = JSON.parse(data.cart_items)
      const cartItems = await getFullCartItem(parsedJSON)
      setIsPending(false)
      return cartItems
    }

    setIsPending(false)
    return []
  }

  const addToCart = async (addItem: CartItemsType) => {
    if (!cart) return window.alert('カート情報取得中')
    if (!account) return window.alert('カート情報取得中')

    setIsPending(true)
    const isProductExist = cart.find(
      (c) => c.product_variant_size_id === addItem.product_variant_size_id
    )

    let newCart
    if (!isProductExist) {
      newCart = [...cart, addItem]
    } else {
      const updatedProduct = {
        ...isProductExist,
        quantity: isProductExist.quantity + addItem.quantity
      }
      newCart = cart.map((c) =>
        c.product_variant_size_id === isProductExist.product_variant_size_id ? updatedProduct : c
      )
    }

    const updatedCart = await updateCart(newCart)
    setCart(updatedCart || [])
    setIsOpen(true)
    setIsPending(false)
  }

  const updateQuantity = async (product_variant_size_id: string, quantity: number) => {
    if (!cart) return window.alert('カート情報取得中')

    setIsPending(true)
    const newCart = cart.map((item) =>
      item.product_variant_size_id === product_variant_size_id ? { ...item, quantity } : item
    )

    const updatedCart = await updateCart(newCart)
    setCart(updatedCart || [])
    setIsPending(false)
  }

  const deleteFromCart = async (product_variant_size_id: string) => {
    if (!cart) return window.alert('カート情報取得中')

    setIsPending(true)
    const newCart = cart.filter((item) => item.product_variant_size_id !== product_variant_size_id)

    const updatedCart = await updateCart(newCart)
    setCart(updatedCart || [])
    setIsPending(false)
  }

  // コンテキストプロバイダに渡す値を定義
  const contextValue = {
    cart,
    isPending,
    isOpen,
    addToCart,
    openCart,
    updateQuantity,
    deleteFromCart,
    closeCart,
    resetCart
  }

  // CartContext.Provider で子コンポーネントをラップしてコンテキストを提供
  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}
