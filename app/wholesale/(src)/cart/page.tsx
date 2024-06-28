'use client'
import { FC, useContext, useEffect, useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import { WHOLESALE_ROUTE } from '@/constants/route'
import { createClient } from '@/utils/supabase/client'
import { AccountContext } from '@/contexts/account/context'
import { ORDER_DELIVERY_OPTION, ORDER_PAYMENT_STATUS } from '@/constants/app'
import { CartContext, CartItemType } from '@/contexts/cart/context'
import Image from 'next/image'
import style from './style.module.css'
import { Button } from '@/components/button'
import { CartProductAmountInput } from '@/components/Wholesale/cartProductAmountInput'
import { UsersRowType } from '@/utils/supabase/type'

type Props = {
  orderId: any
  setOrderId: any
  setStripeClientSecret: any
}

const StripeElement = ({ orderId, setOrderId, setStripeClientSecret }: Props) => {
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
        <div style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 20 }}>
            <Button color="black">支払いをする</Button>
          </div>
          <div>
            <Button isLoading={loading} color="white" onClick={onBack}>
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
  payment_status: number
}

const Page: FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [totalAmount, setTotalAmount] = useState<number | undefined>(undefined)
  const { cart } = useContext(CartContext)
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
  const [isDateInputVisible, setDateInputVisible] = useState(false)
  const [deliveryTime, setDeliveryTime] = useState('指定なし')
  const [deliveryDate, setDeliveryDate] = useState(getFourDaysLater())
  const [textarea, setTextarea] = useState('')

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
    console.log(cart)
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
        'pk_test_51PJtZKDe7T0wGKDyVM00CZgAYUzDCDKiHRWqD0eL10K4ZQ3IRD0SAHot19UHARG74WFws9M2qJp7miyL67lL2gBY00ueLl2qcp',
        { locale: 'ja' }
      )
    )
  }, [])

  const onSubmit = async () => {
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
        // 配送Options
        option: isDateInputVisible ? ORDER_DELIVERY_OPTION.Exist : ORDER_DELIVERY_OPTION.Whenever,
        delivery_date: isDateInputVisible ? deliveryDate : null,
        delivery_time: isDateInputVisible ? deliveryTime : null,
        remarks: textarea,
        // システム情報
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
        amount: ci.quantity,
        payment_status: ORDER_PAYMENT_STATUS.Hold
      }
    })

    const purchasedProductsData = await supabase.from('purchased_products').insert(dataToInsert)

    if (purchasedProductsData.error) {
      return window.alert('予期せぬエラーが発生しました')
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

  function getFourDaysLater() {
    const today = new Date()
    const fourDaysLater = new Date(today.setDate(today.getDate() + 4))
    const year = fourDaysLater.getFullYear()
    const month = String(fourDaysLater.getMonth() + 1).padStart(2, '0')
    const day = String(fourDaysLater.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const defaultDate = getFourDaysLater()

  const handleRadioChange = (event: any) => {
    if (event.target.value === '希望する') {
      setDateInputVisible(true)
    } else {
      setDateInputVisible(false)
    }
  }

  return (
    <div className={style.body}>
      {cart.length > 0 ? (
        <div className={style.itemSection}>
          {cartItems.map((ci, index) => {
            return (
              <div className={style.itemWrapper} key={index}>
                <div className={style.imageWrapper}>
                  <Image src={ci.thumbnail} fill alt="" />
                </div>
                <div className={style.item}>
                  <div className={style.descriptionWrapper}>
                    <div className={style.title}>{ci.title}</div>
                    <div className={style.caption}>
                      {ci.color} / {ci.size}
                    </div>
                    <div className={style.caption}>¥{ci.price.toLocaleString()}円</div>
                  </div>
                  <div className={style.inputWrapper}>
                    <CartProductAmountInput data={ci} />
                  </div>
                  <div className={style.subTotalCaption}>
                    ¥{(ci.price * ci.quantity).toLocaleString()}円
                  </div>
                </div>
              </div>
            )
          })}

          <div className={style.footer}>
            <div className={style.footerContent}>
              <div className={style.shippingDateWrapper}>
                <div className={style.label}>お届け先</div>
                {account && (
                  <div className={style.defaultAddressValues}>
                    <div>
                      <div className={style.addressLabel}>会社名</div>
                      <div>{account.company} 様</div>
                    </div>
                    <div>
                      <div className={style.addressLabel}>電話番号</div>
                      <div>{account.phone}</div>
                    </div>
                    <div className={style.addressLabel}>住所</div>
                    <div>
                      {account.postal_code}
                      <br />
                      {account.prefecture}
                      {account.city}
                      {account.street_address}
                      <br />
                      {account.building_name && account.building_name}
                    </div>
                  </div>
                )}
                <div className={style.label}>配送希望日</div>
                <div className={style.radioOptionWrapper}>
                  <div>
                    <input
                      className={style.radioOption}
                      type="radio"
                      id="op1"
                      name="delivery"
                      value="希望する"
                      onChange={handleRadioChange}
                    />
                    <label className={style.radioOption} htmlFor="op1">
                      希望する
                    </label>
                  </div>
                  <div>
                    <input
                      className={style.radioOption}
                      type="radio"
                      id="op2"
                      name="delivery"
                      value="希望しない"
                      defaultChecked
                      onChange={handleRadioChange}
                    />
                    <label className={style.radioOption} htmlFor="op2">
                      希望しない
                    </label>
                  </div>
                </div>
                {isDateInputVisible && (
                  <div>
                    <input
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className={style.input}
                      type="date"
                      defaultValue={defaultDate}
                      min={defaultDate}
                    />
                    <div className={style.label}>配送時間帯</div>
                    <select
                      required
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className={style.select}
                    >
                      <option value={'指定なし'}>指定なし</option>
                      <option value={'午前(8:00 ~ 13:00)'}>午前(8:00 ~ 13:00)</option>
                      <option value={'午後(13:00 ~ 17:00まで)'}>午後(13:00 ~ 17:00まで)</option>
                    </select>
                  </div>
                )}
              </div>
              <div className={style.label}>備考欄</div>
              <textarea
                onChange={(e) => setTextarea(e.target.value)}
                placeholder="何かありましたらご記入ください"
                className={style.textarea}
              />
            </div>

            <div className={style.footerContent}>
              <div className={style.totalAmountWrapper}>
                合計金額
                {totalAmount && (
                  <div className={style.totalAmount}>　¥{totalAmount.toLocaleString()}(税込)</div>
                )}
              </div>
              <Button isLoading={isLoading} color="black" onClick={onSubmit}>
                決済に進む
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 30 }}>
          <div className={style.title}>カートは空です</div>
        </div>
      )}
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
