'use client'
import { createClient } from '@/utils/supabase/client'
import { App, Button } from 'antd'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

type Props = {
  orderId: string
}

export const ShippingStatusButton: FC<Props> = ({ orderId }) => {
  const supabase = createClient()
  const router = useRouter()

  const { message, modal } = App.useApp()
  const arrowedConfirm = () => {
    modal.confirm({
      title: '配送完了メールを送信する',
      icon: null,
      content: '配送完了のメールを送ります。',
      async onOk() {
        const { data, error } = await supabase
          .from('orders')
          .update({
            is_delivered: true
          })
          .eq('id', orderId)
          .select()

        if (error) {
          message.error('予期せぬエラーが発生しました')
        }
        if (!error) {
          message.success('承認しました')
          // router.push(toHref(ADMIN_USERS_DETAIL_ROUTE, { id: data[0].id }))
        }
      },
      okText: '承認する',
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
