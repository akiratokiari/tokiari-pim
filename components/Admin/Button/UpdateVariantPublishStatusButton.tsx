'use client'
import { PRODUCT_PUBLISH_STATUS } from '@/constants/app'
import { createClient } from '@/utils/supabase/client'
import { App, Button } from 'antd'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

type Props = {
  variantId: string
  publish_status: number
}

export const UpdateVariantPublishStatusButton: FC<Props> = ({ variantId, publish_status }) => {
  const isPublished = publish_status === PRODUCT_PUBLISH_STATUS.Public ? true : false
  const supabase = createClient()
  const router = useRouter()
  const { message, modal } = App.useApp()

  const updateConfirm = () => {
    modal.confirm({
      title: `${isPublished ? '非公開にする' : '公開する'}`,
      icon: null,
      content: '',
      async onOk() {
        const { error } = await supabase
          .from('product_variants')
          .update({
            publish_status: isPublished
              ? PRODUCT_PUBLISH_STATUS.Private
              : PRODUCT_PUBLISH_STATUS.Public
          })
          .eq('id', variantId)

        if (error) {
          message.error('予期せぬエラーが発生しました')
        }
        if (!error) {
          message.success('変更しました')
          router.refresh()
        }
      },
      okText: '変更する',
      cancelText: 'キャンセル'
    })
  }

  return (
    <Button block onClick={updateConfirm}>
      {isPublished ? '非公開にする' : '公開する'}
    </Button>
  )
}
