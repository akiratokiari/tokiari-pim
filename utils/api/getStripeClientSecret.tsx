import { StripeRequestParams } from '@/app/api/stripe/route'
import { CartItemsType } from '@/contexts/cart/context'

type ResponseType = {
  clientSecret: string
  cartItems: CartItemsType[]
}

export const getStripeClientSecret = async ({ cartItems, orderId }: StripeRequestParams) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stripe`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cartItems, orderId })
  })

  if (!response.ok) {
    throw new Error('Failed to check price')
  }

  const result: ResponseType = await response.json()

  return result
}
