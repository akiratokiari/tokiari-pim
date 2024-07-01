'use client'
import { useFormState } from 'react-dom'
import { resetUserPassword } from './action'
import style from './style.module.css'
import { Button } from '@/components/button'

export const Form = () => {
  const [status, formAction] = useFormState(resetUserPassword, {
    isComplete: false,
    message: ''
  })
  return (
    <div className={style.body}>
      <div className={style.title}>TOKIARI 卸会員パスワード再設定</div>
      {status && status.isComplete ? (
        `${status.message}宛にパスワード再設定用のメールをお送りしました。`
      ) : (
        <div>
          <div className={style.description}>
            ご登録済みのメールアドレス宛に再設定用のリンクをお送りします。
          </div>
          <form className={style.formBody} action={formAction}>
            <div className={style.formItem}>
              <label htmlFor="email">メールアドレス</label>
              <input id="email" name="email" type="email" required />
            </div>
            <Button color="black" type="submit">
              送信する
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
