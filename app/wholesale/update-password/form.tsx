'use client'
import { updateUserPassword } from './action'
import style from './style.module.css'
import { Button } from '@/components/button'
import { WHOLESALE_LOGIN_ROUTE } from '@/constants/route'
import Link from 'next/link'
import { useForm } from '@/helper/UseFormHook'

export const Form = () => {
  const { isPending, formState, formAction, onSubmit } = useForm(updateUserPassword, {
    isComplete: false,
    message: ''
  })

  return (
    <div>
      {formState && formState.isComplete ? (
        <div className={style.complete}>
          <div className={style.completeTitle}>パスワードの再設定が完了しました！</div>
          <Link href={WHOLESALE_LOGIN_ROUTE}>
            <Button color="black">ログインする</Button>
          </Link>
        </div>
      ) : (
        <>
          <form className={style.formBody} action={formAction} onSubmit={onSubmit}>
            <div className={style.formItem}>
              <label htmlFor="password">新しいパスワード</label>
              <input id="password" name="password" type="password" required />
            </div>
            <Button isLoading={isPending} color="black" type="submit">
              変更する
            </Button>
          </form>
        </>
      )}
    </div>
  )
}
