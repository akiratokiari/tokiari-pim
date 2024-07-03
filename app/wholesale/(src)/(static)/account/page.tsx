import { createClient } from '@/utils/supabase/server'
import style from './style.module.css'
import Link from 'next/link'
import {
  WHOLESALE_ACCOUNT_EDIT_EMAIL_ROUTE,
  WHOLESALE_ACCOUNT_EDIT_PASSWORD_ROUTE,
  WHOLESALE_ACCOUNT_EDIT_ROUTE
} from '@/constants/route'
import { DisplayFormValue } from '@/components/displayFormValue'
import { PageHeader } from '@/components/Wholesale/pageHeader'

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
          <PageHeader>アカウント情報 確認・編集</PageHeader>
        </div>
        <div className={style.title}>登録情報</div>
        <div className={style.displayValueWrapper}>
          <DisplayFormValue border={false} label="会社名" value={userData.company} />
          <DisplayFormValue border={false} label="サイト" value={userData.site_url || ''} />
          <DisplayFormValue border={false} label="電話番号" value={userData.phone} />
          <DisplayFormValue
            border={false}
            label="担当者様"
            value={`${userData.contact_name}(${userData.contact_kana})`}
          />

          <DisplayFormValue
            border={false}
            label="住所"
            value={`${userData.postal_code} ${userData.prefecture} ${userData.city} ${
              userData.street_address
            }
            ${userData.building_name || ''}`}
          />
        </div>
        <div className={style.buttonWrapper}>
          <Link className={style.menu} href={WHOLESALE_ACCOUNT_EDIT_ROUTE}>
            登録情報を編集する
          </Link>
        </div>

        <div className={style.title}>メールアドレス</div>
        <div className={style.displayValue}>
          <div className={style.value}>{userData.email}</div>
          <Link
            className={style.menu}
            style={{ padding: '7px 10px' }}
            href={WHOLESALE_ACCOUNT_EDIT_EMAIL_ROUTE}
          >
            変更する
          </Link>
        </div>

        <div className={style.title}>パスワード</div>
        <div className={style.displayValue}>
          <div className={style.label}>********</div>

          <Link
            className={style.menu}
            style={{ padding: '7px 10px' }}
            href={WHOLESALE_ACCOUNT_EDIT_PASSWORD_ROUTE}
          >
            変更する
          </Link>
        </div>
      </div>
    )
  } catch (error: any) {
    return <div>{error.message}</div>
  }
}
