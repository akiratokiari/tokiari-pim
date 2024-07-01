import { CartItemType } from '@/contexts/cart/context'
import { getShippingPrice } from '@/helper/getShippingPrice'
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export type StripeRequestParams = {
  // オーダーID
  orderId: string
  // 注文商品
  cartItems: CartItemType[]
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  try {
    const { cartItems, orderId }: StripeRequestParams = await req.json()

    const checkedCartItemPrice = await Promise.all(
      cartItems.map(async (v: CartItemType) => {
        const { data, error } = await supabase
          .from('product_variants')
          .select('*')
          .eq('id', v.product_variant_id)
          .single()
        if (error) throw error
        return { ...v, price: data.price }
      })
    )

    // 商品だけの合計金額
    const subTotalPrice = checkedCartItemPrice.reduce((total, ci) => {
      const subTotalPrice = ci.price * ci.quantity
      return total + subTotalPrice
    }, 0)

    // 配送料の計算
    const user = await supabase.auth.getUser()
    if (!user.data.user?.id) throw 'error'

    const { data: userTableData } = await supabase
      .from('users')
      .select('prefecture')
      .eq('id', user.data.user?.id)
      .single()

    if (!userTableData) throw 'error'
    const shippingPrice = getShippingPrice(subTotalPrice, userTableData?.prefecture)
    const totalPrice = subTotalPrice + shippingPrice

    console.log(subTotalPrice, shippingPrice)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice,
      currency: 'jpy',
      payment_method_types: ['card'],
      statement_descriptor_suffix: 'ORDER',
      metadata: {
        type: 'order',
        order_id: orderId
      }
    })
    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
