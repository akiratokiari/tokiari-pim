import { NextRequest, NextResponse } from 'next/server'
import { CartItemType } from '../../../contexts/cart/context'
import { createClient } from '../../../utils/supabase/server'

export async function POST(req: NextRequest, _: any) {
  try {
    const supabase = createClient()
    const values = await req.json()

    const valuesWithAmount = await Promise.all(
      values.cart.map(async (v: CartItemType) => {
        const seriesWithAmount = await Promise.all(
          v.series.map(async (series) => {
            const { data, error } = await supabase
              .from('product_variants')
              .select('price')
              .eq('id', series.id)
              .single()
            if (error) throw error
            if (data) {
              const variantsWithPrice = series.variants.map((variant) => {
                return {
                  ...variant,
                  amount: data.price
                }
              })
              return { ...series, variants: variantsWithPrice }
            }
          })
        )
        return { ...v, series: seriesWithAmount }
      })
    )
    console.log('===========API======================', valuesWithAmount)

    return NextResponse.json({ message: 'Success: email was sent', data: valuesWithAmount })
  } catch (error) {
    console.log('===========API======================', error)
    return NextResponse.json({ message: 'COULD NOT SEND MESSAGE' })
  }
}
