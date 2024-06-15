'use client'
import { useFormState } from 'react-dom'
import { updateUserPassword } from './action'
import style from './style.module.css'
import { Button } from '@/components/button'
import { WHOLESALE_LOGIN_ROUTE } from '@/constants/route'
import Link from 'next/link'

export const Form = () => {
  const [status, formAction] = useFormState(updateUserPassword, { isComplete: false, message: '' })

  return (
    <div>
      {status && status.isComplete ? (
        <div className={style.complete}>
          <div className={style.completeTitle}>パスワードの再設定が完了しました！</div>
          <Link href={WHOLESALE_LOGIN_ROUTE}>
            <Button color="black">ログインする</Button>
          </Link>
        </div>
      ) : (
        <>
          <form className={style.formBody} action={formAction}>
            <div className={style.formItem}>
              <label htmlFor="password">新しいパスワード</label>
              <input id="password" name="password" type="password" required />
            </div>
            <Button color="black" type="submit">
              変更する
            </Button>
          </form>
        </>
      )}
    </div>
  )
}
