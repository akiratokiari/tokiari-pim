'use client'
import { PRODUCT_PUBLISH_STATUS } from '@/constants/app'
import { ADMIN_PRODUCTS_ROUTE } from '@/constants/route'
import { createClient } from '@/utils/supabase/client'
import { App, Button } from 'antd'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

type Props = {
  productId: string
  publish_status: number
}

export const UpdateProductPublishStatusButton: FC<Props> = ({ productId, publish_status }) => {
  const isPublished = publish_status === PRODUCT_PUBLISH_STATUS.Public ? true : false
  const supabase = createClient()
  const router = useRouter()
  const { message, modal } = App.useApp()

  const updateConfirm = () => {
    modal.confirm({
      title: `${isPublished ? '商品を非公開にする' : '商品を公開する'}`,
      icon: null,
      content: '',
      async onOk() {
        const { error } = await supabase
          .from('products')
          .update({
            publish_status: isPublished
              ? PRODUCT_PUBLISH_STATUS.Private
              : PRODUCT_PUBLISH_STATUS.Public
          })
          .eq('id', productId)

        if (error) {
          message.error('予期せぬエラーが発生しました')
        }
        if (!error) {
          message.success('変更しました')
          router.push(ADMIN_PRODUCTS_ROUTE)
        }
      },
      okText: '変更する',
      cancelText: 'キャンセル'
    })
  }

  return (
    <>
      <Button block onClick={updateConfirm} style={{ marginBottom: 16 }}>
        {isPublished ? '商品を非公開にする' : '商品を公開する'}
      </Button>
    </>
  )
}
