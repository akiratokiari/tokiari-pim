'use client'
import { RequestResultFormType } from '@/app/api/resend/request-result/route'
import { USER_ROLE } from '@/constants/app'
import { ADMIN_ROUTE, ADMIN_USERS_DETAIL_ROUTE } from '@/constants/route'
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
          .select('*')
          .single()

        if (error) {
          message.error('予期せぬエラーが発生しました')
        }

        if (data) {
          const value: RequestResultFormType = {
            email: data.email,
            name: data.contact_name,
            company: data.company,
            result: USER_ROLE.Buyer
          }

          await fetch(`/api/resend/request-result`, {
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

        if (!error) {
          message.success('承認しました')
          router.push(toHref(ADMIN_USERS_DETAIL_ROUTE, { id: data.id }))
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
        const { data, error } = await supabase
          .from('users')
          .update({ user_role: USER_ROLE.Denied })
          .eq('id', userId)
          .select('*')
          .single()
        if (error) {
          message.error('予期せぬエラーが発生しました')
        }

        if (data) {
          const value: RequestResultFormType = {
            email: data.email,
            name: data?.contact_name || '',
            company: data?.company || '',
            result: USER_ROLE.Buyer
          }

          await fetch(`/api/resend/request-result`, {
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

        if (!error) {
          message.success('拒否しました')
          router.push(ADMIN_ROUTE)
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
