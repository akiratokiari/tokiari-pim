'use client'
import { useFormState } from 'react-dom'
import { login } from './actions'
import Link from 'next/link'
import { WHOLESALE_RESET_PASSWORD } from '@/constants/route'
import style from './style.module.css'
import { Button } from '@/components/button'

export default function Page() {
  const [state, formAction] = useFormState(login, null)
  return (
    <div className={style.body}>
      <div className={style.title}>TOKIARI 卸会員ログイン</div>
      <form className={style.formBody} action={formAction}>
        {state && state}
        <div className={style.formItem}>
          <label htmlFor="email">メールアドレス</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className={style.formItem}>
          <label htmlFor="password">パスワード</label>
          <input id="password" name="password" type="password" required />
        </div>

        <div className={style.buttonWrapper}>
          <Button color="black" type="submit">
            ログイン
          </Button>
        </div>
      </form>
      <Link className={style.forgetPassword} href={WHOLESALE_RESET_PASSWORD}>
        パスワードを忘れた方
      </Link>
    </div>
  )
}
