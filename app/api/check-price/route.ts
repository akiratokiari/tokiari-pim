import { NextRequest, NextResponse } from 'next/server'
import { CartItemType } from '../../../contexts/cart/context'
import { createClient } from '../../../utils/supabase/server'

export async function POST(req: NextRequest, _: any) {
  try {
    const supabase = createClient()
    const values = await req.json()
    const cartItems: CartItemType[] = values.cart

    let isCorrect = true

    const checkedCartItemPrice = await Promise.all(
      cartItems.map(async (v: CartItemType) => {
        const { data, error } = await supabase
          .from('product_variants')
          .select('*,products(*),product_images(image_url)')
          .eq('id', v.seriesId)
          .single()
        if (error) throw error
        if (data) {
          if (data.price !== v.price) {
            isCorrect = false
          }
        }
        return { ...v, price: data.price }
      })
    )

    const totalPrice = checkedCartItemPrice.reduce((total, ci) => {
      const subTotal = ci.price * ci.quantity // price * quantity が正しい計算です
      return total + subTotal
    }, 0)

    if (isCorrect) {
      return NextResponse.json({
        message: '',
        data: { cartItems: checkedCartItemPrice, totalPrice }
      })
    }
    if (!isCorrect) {
      console.log('ストレージの内容と異なります')
      return NextResponse.json({
        message: '',
        data: { cartItems: checkedCartItemPrice, totalPrice }
      })
    }

    console.log('===========API======================', checkedCartItemPrice)
  } catch (error) {
    console.log('===========API======================', error)
    return NextResponse.json({ message: '' })
  }
}
