import Delivery from '@/react-email/emails/delivery'
import { NextRequest } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export type DeliveryFormType = {
  company: string
  name: string
  orderId: string
  textarea: string
  email: string
}

export async function POST(req: NextRequest) {
  const params: DeliveryFormType = await req.json()

  try {
    const { data, error } = await resend.emails.send({
      from: 'TOKIARI <info@human-side-effect.io>',
      to: params.email,
      subject: '【TOKIARI 卸販売】 商品を発送しました',
      react: Delivery(params) as React.ReactElement
    })

    if (error) {
      return Response.json({ error })
    }

    return Response.json({ data })
  } catch (error) {
    return Response.json({ error })
  }
}
