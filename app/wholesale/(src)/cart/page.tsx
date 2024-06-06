'use client'
import { FC, useContext, useEffect, useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import { WHOLESALE_ROUTE } from '@/constants/route'
import { createClient } from '@/utils/supabase/client'
import { AccountContext } from '@/contexts/account/context'
import { ORDER_PAYMENT_STATUS } from '@/constants/app'
import Stripe from 'stripe'

const StripeElement = ({ orderId, setOrderId, setStripeClientSecret }: any) => {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const stripe = useStripe()
  if (!stripe) return
  const elements = useElements()
  const onBack = async () => {
    setStripeClientSecret(null)
    // StripeのPaymentをキャンセル 既存のOrderのStatusをキャンセルに
    setOrderId(null)
    await supabase
      .from('orders')
      .update({ payment_status: ORDER_PAYMENT_STATUS.Cancel })
      .eq('id', orderId)
  }
  const onBackNotCancel = () => {
    setStripeClientSecret(null)
    setOrderId(null)
  }
  const onCreditSubmit = async (event: any) => {
    event.preventDefault()
    setLoading(true)
    if (!stripe || !elements) {
      setLoading(false)
      return
    }
    // DBに保存したStatusを見にいく
    const { data, error } = await supabase.from('orders').select().eq('id', orderId)
    if (error) return

    if (data[0].payment_status !== ORDER_PAYMENT_STATUS.Hold) {
      // 支払い前のステータスでない場合は決済を行わない
      window.alert('決済情報が無効です。もう一度チケット購入画面からやり直してください。')
      setStripeClientSecret(null)
      setLoading(false)
      return
    }

    stripe
      .confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: { return_url: window.location.href }
      })
      .then((result) => {
        if (result.error) {
          window.alert(
            '入力いただいたカードでは、お支払いができませんでした。再度お試しいただくか、または他のカードでお試しください。'
          )
          setLoading(false)
          onBackNotCancel()
        }
        router.push(WHOLESALE_ROUTE)
      })
  }
  return (
    <div>
      <form onSubmit={onCreditSubmit}>
        <PaymentElement />
        <div>
          <div>
            <button>支払いをする</button>
          </div>
          <div>
            <button onClick={onBack}>入力画面に戻る</button>
          </div>
        </div>
      </form>
    </div>
  )
}
const Page: FC = () => {
  const supabase = createClient()
  const { account } = useContext(AccountContext)
  const stripe = require('stripe')(
    'sk_test_51PJtZKDe7T0wGKDyCCK1mJSIpnwmGL4CK04xKgB2BcsJ5gMzDkmSF2wUAqQyIgifhG7Rsjq5s7vcv2AkzDGxNuoK00yieFFUwB'
  )
  const [stripePromise, setStripePromise] = useState(() =>
    loadStripe(
      'pk_test_51PJtZKDe7T0wGKDyVM00CZgAYUzDCDKiHRWqD0eL10K4ZQ3IRD0SAHot19UHARG74WFws9M2qJp7miyL67lL2gBY00ueLl2qcp'
    )
  )
  const [isLoading, setIsLoading] = useState(false)
  const [stripeClientSecret, setStripeClientSecret] = useState(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [purchasedProducts, setPurchasedProducts] = useState([
    { id: '161aace1-e5e4-47be-a83e-2f890d862677', quantity: 2 }
  ])
  const router = useRouter()

  useEffect(() => {
    // 販売情報とバイヤー情報を取得・保存
    setStripePromise(
      loadStripe(
        'pk_test_51PJtZKDe7T0wGKDyVM00CZgAYUzDCDKiHRWqD0eL10K4ZQ3IRD0SAHot19UHARG74WFws9M2qJp7miyL67lL2gBY00ueLl2qcp'
      )
    )
  }, [])

  const onSubmit = async (values: any) => {
    setIsLoading(true)

    // 販売情報をDBに叩きこむ & StripeCreate
    // 追記　初期値は'card' status 'hold
    if (!account) return

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: account.id,
        amount: 1000,
        // 配送情報
        postal_code: account.postal_code,
        prefecture: account.prefecture,
        city: account.city,
        street_address: account.street_address,
        building_name: account.building_name,
        company: account.company,
        phone: account.phone,
        contact_name: account.contact_name,
        contact_kana: account.contact_kana,
        //
        is_delivered: false,
        payment_status: ORDER_PAYMENT_STATUS.Hold
      })
      .select('*')
    if (error || !data) {
      return
    }
    const _orderId = data[0].id
    setOrderId(_orderId)

    // Prepare data for insertion
    const dataToInsert = purchasedProducts.map((product) => ({
      order_id: data[0].id,
      product_id: product.id,
      quantity: product.quantity
    }))

    // Insert data into Supabase
    const purchasedProductsData = await supabase.from('purchased_products').insert(dataToInsert)

    if (purchasedProductsData.error) {
      return
    }

    const params = {
      amount: 1000,
      currency: 'jpy',
      payment_method_types: ['card'],
      statement_descriptor_suffix: 'TICKET',
      metadata: {
        order_id: data[0].id
      }
    }

    const intent = await stripe.paymentIntents.create(params)
    console.log(intent)
    setStripeClientSecret(intent.client_secret)
  }

  return (
    <div>
      <div>
        <form
          onSubmit={(values) => {
            values.preventDefault()
            onSubmit(values)
          }}
        >
          <button type="submit">支払い画面に進む</button>
        </form>
      </div>
      {!!stripePromise && !!stripeClientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
          <StripeElement
            orderId={orderId}
            setOrderId={setOrderId}
            setStripeClientSecret={setStripeClientSecret}
          />
        </Elements>
      )}
    </div>
  )
}

export default Page
