'use client'
import { login } from './actions'
import style from './style.module.css'
import { Button } from '@/components/button'
import { useForm } from '@/helper/UseFormHook'

export default function Page() {
  const { isPending, formState, formAction, onSubmit } = useForm(login, null)

  return (
    <div className={style.body}>
      <div className={style.title}>管理画面ログイン</div>
      <form className={style.formBody} action={formAction} onSubmit={onSubmit}>
        {!isPending && formState && <div className={style.state}>{formState}</div>}
        <div className={style.formItem}>
          <label htmlFor="email">メールアドレス</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className={style.formItem}>
          <label htmlFor="password">パスワード</label>
          <input id="password" name="password" type="password" required />
        </div>
        <div className={style.buttonWrapper}>
          <Button isLoading={isPending} color="black" type="submit">
            ログイン
          </Button>
        </div>
      </form>
    </div>
  )
}
