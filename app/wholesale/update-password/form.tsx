'use client'
import { useFormState } from 'react-dom'
import { updateUserPassword } from './action'

export const Form = () => {
  const [status, formAction] = useFormState(updateUserPassword, { isComplete: false, message: '' })
  return (
    <div>
      {status && status.isComplete ? (
        `${status.message}宛に認証メールをお送りしました。`
      ) : (
        <>
          <form action={formAction}>
            <label htmlFor="password">新しいパスワード:</label>
            <input id="password" name="password" type="password" required />
            <button type="submit">変更する</button>
          </form>
        </>
      )}
    </div>
  )
}
