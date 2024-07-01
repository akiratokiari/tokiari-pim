import { USER_ROLE } from '@/constants/app'
import RequestApprove from '@/react-email/emails/request-approve'
import RequestDeny from '@/react-email/emails/request-deny'
import { NextRequest } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export type RequestResultFormType = {
  email: string
  company: string
  name: string
  result: number
}

export async function POST(req: NextRequest) {
  const params: RequestResultFormType = await req.json()
  const emailBody =
    USER_ROLE.Buyer === params.result
      ? (RequestApprove(params) as React.ReactElement)
      : (RequestDeny(params) as React.ReactElement)

  try {
    const { data, error } = await resend.emails.send({
      from: 'TOKIARI <info@human-side-effect.io>',
      to: params.email,
      subject: '【TOKIARI 卸販売】 本会員登録の結果のご連絡',
      react: emailBody
    })

    if (error) {
      return Response.json({ error })
    }

    return Response.json({ data })
  } catch (error) {
    return Response.json({ error })
  }
}
