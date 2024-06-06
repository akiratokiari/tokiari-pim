'use client'
import { ADMIN_PRODUCTS_ROUTE } from '@/constants/route'
import { createClient } from '@/utils/supabase/client'
import { App, Button } from 'antd'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

type Props = {
  productId: string
}

export const DeleteProductButton: FC<Props> = ({ productId }) => {
  const supabase = createClient()
  const router = useRouter()
  const { message, modal } = App.useApp()

  const deniedConfirm = () => {
    modal.confirm({
      title: '商品を削除する',
      icon: null,
      content: '',
      async onOk() {
        const { error } = await supabase.from('products').delete().eq('id', productId)
        if (error) {
          message.error('予期せぬエラーが発生しました')
        }
        if (!error) {
          message.success('削除しました')
          router.push(ADMIN_PRODUCTS_ROUTE)
        }
      },
      okText: '削除する',
      okButtonProps: { danger: true },
      cancelText: 'キャンセル'
    })
  }
  return (
    <>
      <Button onClick={deniedConfirm} type="primary" danger ghost block>
        削除する
      </Button>
    </>
  )
}
