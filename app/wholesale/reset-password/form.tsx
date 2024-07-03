'use client'
import { resetUserPassword } from './action'
import style from './style.module.css'
import { Button } from '@/components/button'
import { useForm } from '@/helper/UseFormHook'

export const Form = () => {
  const { isPending, formState, formAction, onSubmit } = useForm(resetUserPassword, {
    isComplete: false,
    message: ''
  })

  return (
    <div className={style.body}>
      <div className={style.title}>TOKIARI 卸会員パスワード再設定</div>
      {formState && formState.isComplete ? (
        `${formState.message}宛にパスワード再設定用のメールをお送りしました。`
      ) : (
        <div>
          <div className={style.description}>
            ご登録済みのメールアドレス宛に再設定用のリンクをお送りします。
          </div>
          <form className={style.formBody} action={formAction} onSubmit={onSubmit}>
            <div className={style.formItem}>
              <label htmlFor="email">メールアドレス</label>
              <input id="email" name="email" type="email" required />
            </div>
            <Button isLoading={isPending} color="black" type="submit">
              送信する
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
