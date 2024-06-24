import { createClient } from '@/utils/supabase/server'
import style from './style.module.css'
import Link from 'next/link'
import {
  WHOLESALE_ACCOUNT_EDIT_EMAIL_ROUTE,
  WHOLESALE_ACCOUNT_EDIT_PASSWORD_ROUTE,
  WHOLESALE_ACCOUNT_EDIT_ROUTE
} from '@/constants/route'
import { toStringPlan } from '@/helper/toStringPlan'
import { LogoutButton } from '@/components/Wholesale'
import { DisplayFormValue } from '@/components/displayFormValue'

export default async function Page() {
  const supabase = createClient()

  try {
    const { data, error: userError } = await supabase.auth.getUser()
    if (userError) throw new Error('ユーザーの取得に失敗しました')

    const userId = data.user.id
    if (!userId) throw new Error('ユーザーIDが見つかりません')

    const { data: userData, error: dataError } = await supabase
      .from('users')
      .select()
      .eq('id', userId)
      .single()
    if (dataError || !userData) throw new Error('データの取得に失敗しました')

    return (
      <div>
        <div className={style.menuWrapper}>
          <Link className={style.menu} href={WHOLESALE_ACCOUNT_EDIT_ROUTE}>
            アカウント編集
          </Link>
          <Link className={style.menu} href={WHOLESALE_ACCOUNT_EDIT_EMAIL_ROUTE}>
            メールアドレス変更
          </Link>
          <Link className={style.menu} href={WHOLESALE_ACCOUNT_EDIT_PASSWORD_ROUTE}>
            パスワード変更
          </Link>

          <LogoutButton className={style.menu} />
        </div>
        <div className={style.displayValueWrapper}>
          <div className={style.title}>アカウント</div>
          <DisplayFormValue first label="メールアドレス" value={userData.email} />
          <DisplayFormValue label="パスワード" value={'********'} />
        </div>
        <div className={style.displayValueWrapper}>
          <div className={style.title}>登録情報</div>
          <DisplayFormValue first label="会社名" value={userData.company} />
          <DisplayFormValue label="サイト：" value={userData.site_url || ''} />

          <DisplayFormValue label="電話番号" value={userData.phone} />
          <DisplayFormValue label="担当者(お名前)" value={userData.contact_name} />
          <DisplayFormValue label="担当者(フリガナ)" value={userData.contact_kana} />
        </div>
        <div className={style.displayValueWrapper}>
          <div className={style.title}>住所</div>
          <DisplayFormValue first label="郵便番号" value={userData.postal_code} />
          <DisplayFormValue label="都道府県" value={userData.prefecture} />
          <DisplayFormValue label="市区町村" value={userData.city} />
          <DisplayFormValue label="番地" value={userData.street_address} />
          <DisplayFormValue label="ビル名・部屋番号(任意)" value={userData.building_name || ''} />
        </div>
      </div>
    )
  } catch (error: any) {
    return <div>{error.message}</div>
  }
}
