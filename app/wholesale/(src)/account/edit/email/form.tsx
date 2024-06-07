'use client'
import { AccountContext } from '@/contexts/account/context'
import { useContext } from 'react'
import { useFormState } from 'react-dom'
import { updateUserEmail } from './actions'

export const Form = () => {
  const [status, formAction] = useFormState(updateUserEmail, { isComplete: false, message: '' })
  const { account } = useContext(AccountContext)
  return (
    <div>
      {status && status.isComplete ? (
        `${status.message}宛に認証メールをお送りしました。`
      ) : (
        <>
          <div>現在のメールアドレス：{account?.email}</div>
          <form action={formAction}>
            <label htmlFor="email">メールアドレス:</label>
            <input id="email" name="email" type="email" required />
            <button type="submit">変更する</button>
          </form>
        </>
      )}
    </div>
  )
}
