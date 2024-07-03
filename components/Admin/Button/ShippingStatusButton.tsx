'use client'
import { DeliveryFormType } from '@/app/api/resend/delivery/route'
import { ADMIN_ORDERS_DETAIL_ROUTE } from '@/constants/route'
import toHref from '@/helper/toHref'
import { createClient } from '@/utils/supabase/client'
import { App, Button } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useRouter } from 'next/navigation'
import { FC, useRef } from 'react'

type Props = {
  orderId: string
}

export const ShippingStatusButton: FC<Props> = ({ orderId }) => {
  const supabase = createClient()
  const router = useRouter()

  const textareaRef = useRef<string>('')

  const { message, modal } = App.useApp()
  const arrowedConfirm = () => {
    modal.confirm({
      title: '配送完了メールを送信する',
      icon: null,
      content: <TextArea onChange={(e) => (textareaRef.current = e.target.value)} />,
      async onOk() {
        const { data, error } = await supabase
          .from('orders')
          .update({
            is_delivered: true
          })
          .eq('id', orderId)
          .select('*,users(*)')
          .single()

        if (data && data.users) {
          const value: DeliveryFormType = {
            email: data.users.email,
            name: data.users.contact_name,
            company: data.users.company,
            textarea: textareaRef.current,
            orderId: orderId
          }

          await fetch(`/api/resend/delivery`, {
            method: 'POST',
            headers: {
              Accept: 'application/json, text/plain',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(value)
          })
            .then(() => {})
            .catch(() => {
              window.alert('エラーが発生しました、もう一度やり直してください。')
            })
        }

        if (error) {
          message.error('予期せぬエラーが発生しました')
        }
        if (!error) {
          message.success('送信しました')
          router.push(toHref(ADMIN_ORDERS_DETAIL_ROUTE, { id: orderId }))
          router.refresh()
        }
      },
      okText: '送信する',
      cancelText: 'キャンセル'
    })
  }
  return (
    <>
      <Button onClick={arrowedConfirm} type="primary" ghost block>
        配送完了メールを送信する
      </Button>
    </>
  )
}
