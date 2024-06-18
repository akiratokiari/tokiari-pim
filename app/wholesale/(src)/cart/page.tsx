'use client'
import { FC, useContext, useEffect, useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import { WHOLESALE_ROUTE } from '@/constants/route'
import { createClient } from '@/utils/supabase/client'
import { AccountContext } from '@/contexts/account/context'
import { ORDER_PAYMENT_STATUS } from '@/constants/app'
import { CartContext, CartItemType } from '@/contexts/cart/context'
import Image from 'next/image'
import style from './style.module.css'
import { Button } from '@/components/button'

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
            <Button color="black">支払いをする</Button>
          </div>
          <div>
            <Button color="white" onClick={onBack}>
              入力画面に戻る
            </Button>
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
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [totalAmount, setTotalAmount] = useState<number | undefined>(undefined)
  const { cart, updateQuantity, deleteFromCart } = useContext(CartContext)
  const supabase = createClient()
  const { account } = useContext(AccountContext)
  const stripe = require('stripe')(
    'sk_test_51PJtZKDe7T0wGKDyCCK1mJSIpnwmGL4CK04xKgB2BcsJ5gMzDkmSF2wUAqQyIgifhG7Rsjq5s7vcv2AkzDGxNuoK00yieFFUwB'
  )
  const [stripePromise, setStripePromise] = useState<any>()
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
      checkPrice().then((res: { cartItems: CartItemType[]; totalPrice: number }) => {
        setCartItems(res.cartItems)
        setTotalAmount(res.totalPrice)
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
    const dataToInsert: InsertDataType[] = cartItems.map((ci) => {
      return {
        order_id: _orderId,
        product_group_code: ci.product_group_code,
        series_number: ci.seriesNumber,
        model_number: ci.modelNumber,
        price: ci.price,
        amount: ci.quantity
      }
    })

    const purchasedProductsData = await supabase.from('purchased_products').insert(dataToInsert)

    if (purchasedProductsData.error) {
      return
    }

    const params = {
      amount: totalAmount,
      currency: 'jpy',
      payment_method_types: ['card'],
      statement_descriptor_suffix: 'ORDER',
      metadata: {
        type: 'order',
        order_id: data[0].id
      }
    }

    const intent = await stripe.paymentIntents.create(params)
    setStripeClientSecret(intent.client_secret)
  }

  return (
    <div>
      <div className={style.itemWrapper}>
        {cartItems.map((ci, index) => {
          return (
            <div className={style.itemWrapper} key={index}>
              <div className={style.itemWrapper}>
                <div className={style.item}>
                  <div className={style.imageWrapper}>
                    <Image src={ci.thumbnail} fill alt="" />
                  </div>
                  <div className={style.descriptionWrapper}>
                    <div className={style.title}>{ci.title}</div>
                    <div className={style.caption}>
                      {ci.color} | {ci.size}
                    </div>
                    <div className={style.inputWrapper}>
                      <input
                        type="number"
                        value={ci.quantity}
                        onChange={(e) => {
                          updateQuantity(ci.modelId, Number(e.target.value))
                        }}
                      />
                      <button
                        onClick={() => {
                          deleteFromCart(ci.modelId)
                        }}
                      >
                        削除
                      </button>
                    </div>
                    <div className={style.caption}>¥{ci.price.toLocaleString()}円</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {totalAmount && <div>合計　¥{totalAmount.toLocaleString()}</div>}
        <div>
          <div>お届け希望日</div>
          <input type="date"></input>
          <div>配送時間帯</div>
          <select>
            <option value={1}>1</option>
          </select>
          <div>備考欄</div>
          <textarea />
        </div>
        <div>
          <div>お届け先</div>
          {account && (
            <div>
              会社名：{account.company} 様<br />
              電話：{account.phone}
              <br />〒{account.postal_code}
              <br />
              {account.prefecture}
              {account.city}
              {account.street_address}
              <br />
              {account.building_name && account.building_name}
            </div>
          )}
        </div>
        <div>
          <Button color="black" onClick={onSubmit}>
            注文に進む
          </Button>
        </div>
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
