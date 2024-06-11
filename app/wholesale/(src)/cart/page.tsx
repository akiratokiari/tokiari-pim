'use client'
import { FC, useContext, useEffect, useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import { WHOLESALE_ROUTE } from '@/constants/route'
import { createClient } from '@/utils/supabase/client'
import { AccountContext } from '@/contexts/account/context'
import { ORDER_PAYMENT_STATUS } from '@/constants/app'
import { CartContext, CartItemTypeWithAmount } from '@/contexts/cart/context'
import { message } from 'antd'

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
      .then(async (result) => {
        if (result.error) {
          window.alert(
            '入力いただいたカードでは、お支払いができませんでした。再度お試しいただくか、または他のカードでお試しください。'
          )
          setLoading(false)
          onBackNotCancel()
        }
        await supabase
          .from('orders')
          .update({ payment_intent: result.paymentIntent?.id })
          .eq('id', orderId)

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

type InsertDataType = {
  order_id: string
  product_group_code: string
  series_number: string
  model_number: string
  price: number // 必要なフィールドを追加
  amount: number // 必要なフィールドを追加
}

const Page: FC = () => {
  const [cartItems, setCartItems] = useState<CartItemTypeWithAmount[]>([])
  const [totalAmount, setTotalAmount] = useState<number | undefined>(undefined)
  const { cart } = useContext(CartContext)
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
  const router = useRouter()

  const checkPrice = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/check-price`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cart })
    })
    const result = await response.json()
    return result.data
  }

  useEffect(() => {
    if (cart) {
      checkPrice().then((res) => {
        let _totalAmount = 0
        const data = JSON.stringify(res, null, 2)
        const pared = JSON.parse(data)
        pared.map((ci: any) => {
          ci.series.map((s: any) => {
            s.variants.map((v: any) => {
              const addAmount = v.amount * v.quantity
              _totalAmount = _totalAmount + addAmount
            })
          })
        })
        setCartItems(pared)
        setTotalAmount(_totalAmount)
      })
    }
  }, [cart])

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

    // 販売情報をDBに& StripeCreate
    // 追記　初期値は'card' status 'hold
    if (!account) return
    if (!totalAmount) return

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: account.id,
        amount: totalAmount,
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
      .select()
    if (error || !data) {
      return
    }
    const _orderId = data[0].id
    setOrderId(_orderId)

    // Prepare data for insertion
    const dataToInsert: InsertDataType[] = cartItems.reduce((acc: InsertDataType[], cartItem) => {
      cartItem.series.forEach((item) => {
        item.variants.forEach((v) => {
          acc.push({
            order_id: _orderId,
            product_group_code: cartItem.product_group_code,
            series_number: item.seriesNumber,
            model_number: v.modelNumber,
            price: v.amount,
            amount: v.quantity
          })
        })
      })
      return acc
    }, [])

    const purchasedProductsData = await supabase.from('purchased_products').insert(dataToInsert)

    if (purchasedProductsData.error) {
      return
    }

    const params = {
      amount: 1000,
      currency: 'jpy',
      payment_method_types: ['card'],
      statement_descriptor_suffix: 'ORDER',
      metadata: {
        type: 'order',
        order_id: data[0].id
      }
    }

    const intent = await stripe.paymentIntents.create(params)
    console.log(intent)
    setStripeClientSecret(intent.client_secret)
  }

  console.log(
    cartItems.reduce((acc: InsertDataType[], cartItem) => {
      cartItem.series.forEach((item) => {
        item.variants.forEach((v) => {
          acc.push({
            order_id: '_orderId',
            product_group_code: cartItem.product_group_code,
            series_number: item.seriesNumber,
            model_number: v.modelNumber,
            price: v.amount,
            amount: v.quantity
          })
        })
      })
      return acc
    }, [])
  )

  return (
    <div>
      {cartItems.map((ci) => {
        return (
          <div key={ci.id}>
            <div>{ci.product_group_code}</div>
            <div>
              {ci.series.map((cis) => {
                return (
                  <div key={cis.id}>
                    {cis.color}
                    <br />
                    {cis.variants.map((v) => {
                      return (
                        <div key={v.id}>
                          <div>
                            サイズ {v.size}| 販売価格 {v.amount}円 | 個数 {v.quantity}個 | 小計
                            {v.amount * v.quantity}円
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {totalAmount && <div style={{ margin: '20px 0' }}>合計　{totalAmount}円</div>}
      <div>
        <button onClick={onSubmit}>支払い画面に進む</button>
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
