import { createClient } from '@/utils/supabase/server'
import style from './style.module.css'
import Link from 'next/link'
import {
  WHOLESALE_ACCOUNT_EDIT_EMAIL_ROUTE,
  WHOLESALE_ACCOUNT_EDIT_PASSWORD_ROUTE,
  WHOLESALE_ACCOUNT_EDIT_ROUTE
} from '@/constants/route'
import { toStringPlan } from '@/helper/toStringPlan'

export default async function Page() {
  const supabase = createClient()
  const userId = (await supabase.auth.getUser()).data.user?.id
  if (!userId) return <div>データの取得に失敗しました</div>
  const { data } = await supabase.from('users').select().eq('id', userId)
  if (!data) return <div>データの取得に失敗しました</div>
  const userData = data[0]

  return (
    <div>
      <div>
        <Link href={WHOLESALE_ACCOUNT_EDIT_ROUTE}>アカウント編集</Link>
        <Link href={WHOLESALE_ACCOUNT_EDIT_EMAIL_ROUTE}>メールアドレス変更</Link>
        <Link href={WHOLESALE_ACCOUNT_EDIT_PASSWORD_ROUTE}>パスワード変更</Link>
      </div>
      <div className={style.body}>
        <div>===現在のプラン===</div>
        {userData.plan && <div>プラン：{toStringPlan(userData.plan)}</div>}
        <div>===会社===</div>
        <div>会社名：{userData.company}</div>
        <div>サイト{userData.site_url}</div>
        <div>メールアドレス:{userData.email}</div>
        <div>電話番号：{userData.phone}</div>
        <div>担当者(お名前){userData.contact_name}</div>
        <div>===住所情報===</div>
        <div>郵便番号:{userData.postal_code}</div>
        <div>都道府県:{userData.prefecture}</div>
        <div>市区町村:{userData.city}</div>
        <div>番地:{userData.street_address}</div>
        <div>ビル名・部屋番号(任意):{userData.building_name}</div>
      </div>
    </div>
  )
}
