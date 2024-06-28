'use client'
import { useFormState } from 'react-dom'
import { login } from './actions'
import style from './style.module.css'
import { Button } from '@/components/button'

export default function Page() {
  const [state, formAction] = useFormState(login, null)
  return (
    <div className={style.body}>
      <div className={style.title}>管理画面ログイン</div>
      <form className={style.formBody} action={formAction}>
        {state && <div className={style.state}>{state}</div>}
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
    </div>
  )
}
