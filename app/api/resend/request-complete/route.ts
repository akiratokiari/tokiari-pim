import RequestComplete from '@/react-email/emails/request-complete'
import { NextRequest } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export type RequestFormType = {
  company: string
  site_url: string
  email: string
  phone: string
  contact_name: string
  contact_kana: string
  postal_code: string
  prefecture: string
  city: string
  street_address: string
  building_name?: string
}

export async function POST(req: NextRequest) {
  const params: RequestFormType = await req.json()

  try {
    const { data, error } = await resend.emails.send({
      from: 'TOKIARI <info@human-side-effect.io>',
      to: params.email,
      subject: '【TOKIARI 卸販売】 販売者申請が完了しました(自動配信)',
      react: RequestComplete(params) as React.ReactElement
    })

    if (error) {
      return Response.json({ error })
    }

    return Response.json({ data })
  } catch (error) {
    return Response.json({ error })
  }
}
