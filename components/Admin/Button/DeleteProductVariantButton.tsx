'use client'
import { ADMIN_PRODUCTS_DETAIL_ROUTE } from '@/constants/route'
import toHref from '@/helper/toHref'
import { createClient } from '@/utils/supabase/client'
import { App, Button } from 'antd'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

type Props = {
  id: string
  variantId: string
}

export const DeleteProductVariantButton: FC<Props> = ({ id, variantId }) => {
  const supabase = createClient()
  const router = useRouter()
  const { message, modal } = App.useApp()

  const deniedConfirm = () => {
    modal.confirm({
      title: '商品を削除する',
      icon: null,
      content: '',
      async onOk() {
        const { error } = await supabase.from('product_variants').delete().eq('id', variantId)
        if (error) {
          message.error('予期せぬエラーが発生しました')
        }
        if (!error) {
          message.success('削除しました')
          router.push(toHref(ADMIN_PRODUCTS_DETAIL_ROUTE, { id: id }))
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
