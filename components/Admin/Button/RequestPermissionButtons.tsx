'use client'
import { USER_ROLE } from '@/constants/app'
import { ADMIN_USERS_DETAIL_ROUTE } from '@/constants/route'
import toHref from '@/helper/toHref'
import { createClient } from '@/utils/supabase/client'
import { App, Button } from 'antd'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

type Props = {
  userId: string
}

export const RequestPermissionButtons: FC<Props> = ({ userId }) => {
  const supabase = createClient()
  const router = useRouter()

  const { message, modal } = App.useApp()
  const arrowedConfirm = () => {
    modal.confirm({
      title: 'リクエストを承認する',
      icon: null,
      content: '',
      async onOk() {
        const { data, error } = await supabase
          .from('users')
          .update({
            user_role: USER_ROLE.Buyer,
            permission_at: new Date().toISOString().toLocaleString()
          })
          .eq('id', userId)
          .select()

        if (error) {
          message.error('予期せぬエラーが発生しました')
        }
        if (!error) {
          message.success('承認しました')
          router.push(toHref(ADMIN_USERS_DETAIL_ROUTE, { id: data[0].id }))
        }
      },
      okText: '承認する',
      cancelText: 'キャンセル'
    })
  }
  const deniedConfirm = () => {
    modal.confirm({
      title: 'リクエストを拒否する',
      icon: null,
      content: '',
      async onOk() {
        const { error } = await supabase
          .from('users')
          .update({ user_role: USER_ROLE.Denied })
          .eq('id', userId)
        if (error) {
          message.error('予期せぬエラーが発生しました')
        }
        if (!error) {
          message.success('拒否しました')
        }
      },
      okText: '拒否する',
      okButtonProps: { danger: true },
      cancelText: 'キャンセル'
    })
  }
  return (
    <>
      <Button style={{ marginBottom: 16 }} onClick={arrowedConfirm} type="primary" ghost block>
        承認する
      </Button>
      <Button onClick={deniedConfirm} type="primary" danger ghost block>
        拒否する
      </Button>
    </>
  )
}
