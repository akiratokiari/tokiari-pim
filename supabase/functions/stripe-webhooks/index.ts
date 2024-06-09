import Stripe from 'https://esm.sh/stripe@11.16.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient()
})
const cryptoProvider = Stripe.createSubtleCryptoProvider()

export const ORDER_PAYMENT_STATUS = {
  Hold: 1, // 決済前
  Buy: 2, // 購入成功
  Cancel: 3, // キャンセル
  Refund: 4, // 払い戻し
  Expired: 9, // 決済期限切れ
  PaymentError: 99 // 決済失敗（Stripe）
}

export type StripePaymentIntentParamMetadata = {
  type: 'ticket' // yellcampus 内の決済対象の種類
  order_id: string // 対象のID
  event_id: string // イベントのID
  organizer_id: string // オーガナイザーのID
  ticket_id?: string // チケットのID
}

Deno.serve(async (request) => {
  // supabaseClientの作成
  const authHeader = request.headers.get('Authorization')!
  const supabaseClient = createClient(
    Deno.env.get('DB_URL') ?? '',
    Deno.env.get('DB_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  const signature = request.headers.get('Stripe-Signature')

  const body = await request.text()
  let event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!,
      undefined,
      cryptoProvider
    )
    const eventType = event.type
    const intent = event.data.object
    const metadata = intent.metadata

    if (metadata.type === 'order') {
      if (eventType === 'payment_intent.succeeded') {
        // MEMO: ticket の場合は購入済みのステータスに変更してメール送信
        const ticketPaymentLogId = metadata.order_id
        const paymentMethodId = intent.payment_method
        const { data, error } = await supabaseClient
          .from('orders')
          .update({ payment_status: ORDER_PAYMENT_STATUS.Buy })
          .eq('id', metadata.order_id)
          .select()
        console.log('========payment_intent.succeeded===========', error)
      } else if (eventType === 'payment_intent.payment_failed') {
        const ticketPaymentLogId = metadata.order_id
        const { data, error } = await supabaseClient
          .from('orders')
          .update({ payment_status: ORDER_PAYMENT_STATUS.PaymentError })
          .eq('id', metadata.order_id)
          .select()
      } else if (eventType === 'charge.refunded') {
        const refundIntents = event.data.object as StripeRefund

        const ticketPaymentLogId = metadata.order_id
        const { data, error } = await supabaseClient
          .from('orders')
          .update({ payment_status: ORDER_PAYMENT_STATUS.Refund })
          .eq('id', metadata.order_id)
          .select()
      }
    }
    return new Response({ status: 200 })
  } catch (err) {
    return new Response(err.message, { status: 400 })
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 })
})
