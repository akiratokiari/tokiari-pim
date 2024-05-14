'use client'
import { useFormState } from 'react-dom'
import { updateUserPassword } from './action'

export const Form = () => {
  const [status, formAction] = useFormState(updateUserPassword, { isComplete: false, message: '' })
  return (
    <div>
      {status && status.isComplete ? (
        `${status.message}宛にパスワード再設定用のメールをお送りしました。`
      ) : (
        <>
          <div>メールアドレス宛に再設定用のリンクをお送りします。</div>
          <form action={formAction}>
            <label htmlFor="email">メールアドレス:</label>
            <input id="email" name="email" type="email" required />
            <button type="submit">送信する</button>
          </form>
        </>
      )}
    </div>
  )
}
