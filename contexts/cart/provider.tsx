import React, { useState, FC, useEffect } from 'react'
import { CartContext, CartItemType } from './context'

export type AddItemType = {
  id: string
  color: string
  seriesNumber: string
  variants: {
    id: string
    size: string
    quantity: number
    modelNumber: string
  }
}

export const CartProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  // カートの状態を管理するためのステートを宣言

  const [cart, setCart] = useState<CartItemType[]>([])
  useEffect(() => {
    const _storageItems = localStorage.getItem('cart_items')
    const storageItems = _storageItems ? JSON.parse(_storageItems) : ''
    if (storageItems) setCart(storageItems)
  }, [])

  // アイテムをカートに追加する関数
const addToCart = (addItem: CartItemType) => {
  const isProductExist = cart.find((c) => c.id === addItem.id)

  // 既存のカートにない場合
  if (!isProductExist) {
    const newCart = [...cart, addItem]
    localStorage.setItem('cart_items', JSON.stringify(newCart))
    setCart(newCart)
  } else {
    const isSeriesExist = isProductExist.series.find((s) => s.id === addItem.series[0].id)

    if (!isSeriesExist) {
      const updatedSeries = [...isProductExist.series, addItem.series[0]]
      const updatedProduct = {
        ...isProductExist,
        series: updatedSeries
      }
      const newCart = cart.map((c) => (c.id === isProductExist.id ? updatedProduct : c))
      localStorage.setItem('cart_items', JSON.stringify(newCart))
      setCart(newCart)
    } else {
      const isSizeExist = isSeriesExist.variants.find(
        (v) => v.id === addItem.series[0].variants[0].id
      )

      if (isSizeExist) {
        const updatedVariants = isSeriesExist.variants.map((v) =>
          v.id === isSizeExist.id
            ? { ...v, quantity: v.quantity + addItem.series[0].variants[0].quantity }
            : v
        )
        const updatedSeries = isProductExist.series.map((s) =>
          s.id === isSeriesExist.id ? { ...s, variants: updatedVariants } : s
        )
        const updatedProduct = {
          ...isProductExist,
          series: updatedSeries
        }
        const newCart = cart.map((c) => (c.id === isProductExist.id ? updatedProduct : c))
        localStorage.setItem('cart_items', JSON.stringify(newCart))
        setCart(newCart)
      } else {
        const updatedVariants = [...isSeriesExist.variants, addItem.series[0].variants[0]]
        const updatedSeries = isProductExist.series.map((s) =>
          s.id === isSeriesExist.id ? { ...s, variants: updatedVariants } : s
        )
        const updatedProduct = {
          ...isProductExist,
          series: updatedSeries
        }
        const newCart = cart.map((c) => (c.id === isProductExist.id ? updatedProduct : c))
        localStorage.setItem('cart_items', JSON.stringify(newCart))
        setCart(newCart)
      }
    }
  }
}

  // const addToCart = (addItem: CartItemType) => {
  //   const isVariantExist = cart.find((c) => c.id === addItem.id)

  //   // 既存のカートにない場合
  //   if (!isVariantExist) {
  //     const newCart = [...cart, addItem]
  //     localStorage.setItem('cart_items', JSON.stringify(newCart))
  //     setCart(newCart)
  //   }
  //   if (isVariantExist) {
  //     const isSizeExist = isVariantExist.variants.find((v) => v.id === addItem.variants[0].id)

  //     if (isSizeExist) {
  //       const data = cart.map((pc) => {
  //         if (pc.id === isVariantExist.id) {
  //           const _cartVariants = pc.variants.map((c) => {
  //             if (c.id === isSizeExist.id) {
  //               return { ...c, quantity: c.quantity + addItem.variants[0].quantity }
  //             }
  //             return c
  //           })
  //           return {
  //             id: pc.id,
  //             color: pc.color,
  //             seriesNumber: pc.seriesNumber,
  //             variants: _cartVariants
  //           }
  //         }
  //         return pc
  //       })
  //       localStorage.setItem('cart_items', JSON.stringify(data))
  //       setCart(data)
  //       return data
  //     }

  //     if (!isSizeExist) {
  //       // ここでエラー
  //       const data = cart.map((pc) => {
  //         let _cartVariants: any = []
  //         if (pc.id === addItem.id) {
  //           _cartVariants = [...pc.variants, addItem.variants[0]]
  //         }
  //         if (pc.id !== addItem.id) {
  //           _cartVariants = [...pc.variants]
  //         }

  //         return {
  //           id: pc.id,
  //           color: pc.color,
  //           seriesNumber: pc.seriesNumber,
  //           variants: _cartVariants
  //         }
  //       })
  //       console.log(data)
  //       localStorage.setItem('cart_items', JSON.stringify(data))
  //       setCart(data)
  //       return data
  //     }
  //   }
  // }

  // アイテムの数量を増減する関数
  const updateQuantity = (variantId: string, variantSizeId: string, amount: number) => {
    // setCart((prevCart) =>
    //   prevCart.map((item) =>
    //     item.id === variantId
    //       ? {
    //           ...item,
    //           variants: item.variants.map((variant) =>
    //             variant.id === variantSizeId
    //               ? { ...variant, quantity: Math.max(0, variant.quantity + amount) }
    //               : variant
    //           )
    //         }
    //       : item
    //   )
    // )
  }

  // アイテムの数量を直接設定する関数
  const setQuantity = (variantId: string, variantSizeId: string, quantity: number) => {
    // setCart((prevCart) =>
    //   prevCart.map((item) =>
    //     item.id === variantId
    //       ? {
    //           ...item,
    //           variants: item.variants.map((variant) =>
    //             variant.id === variantSizeId
    //               ? { ...variant, quantity: Math.max(0, quantity) }
    //               : variant
    //           )
    //         }
    //       : item
    //   )
    // )
  }

  // コンテキストプロバイダに渡す値を定義
  const v = {
    cart,
    addToCart,
    updateQuantity,
    setQuantity
  }

  // CartContext.Provider で子コンポーネントをラップしてコンテキストを提供
  return <CartContext.Provider value={v}>{children}</CartContext.Provider>
}
