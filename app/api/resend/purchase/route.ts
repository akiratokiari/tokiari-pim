import Purchase from '@/react-email/emails/purchase'
import { NextRequest } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export type PurchaseFormType = {
  company: string
  name: string
  email: string
  phone: string
  postal_code: string
  prefecture: string
  city: string
  street_address: string
  building_name?: string
  products: {
    title: string
    size: number
    quantity: number
    price: number
  }[]
  totalPrice: number
  orderId: string
}

export async function POST(req: NextRequest) {
  const params: PurchaseFormType = await req.json()

  try {
    const { data, error } = await resend.emails.send({
      from: 'TOKIARI <info@human-side-effect.io>',
      to: params.email,
      subject: '【TOKIARI 卸販売】 ご購入いただきありがとうございました',
      react: Purchase(params) as React.ReactElement
    })

    if (error) {
      return Response.json({ error })
    }

    return Response.json({ data })
  } catch (error) {
    return Response.json({ error })
  }
}
