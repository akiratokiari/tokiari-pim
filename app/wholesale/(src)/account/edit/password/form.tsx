'use client'
import { useFormState } from 'react-dom'
import { updateUserPassword } from './actions'
import { PageHeader } from '@/components/Wholesale/pageHeader'
import { Button } from '@/components/button'

export const Form = () => {
  const [status, formAction] = useFormState(updateUserPassword, { isComplete: false, message: '' })
  return (
    <div>
      <PageHeader>パスワードの変更</PageHeader>
      {status && status.isComplete ? (
        `${status.message}宛に認証メールをお送りしました。`
      ) : (
        <>
          {status.message}
          <form action={formAction}>
            <label style={{ fontSize: 14, fontWeight: 'bold' }} htmlFor="password">
              新しいパスワード
            </label>
            <div style={{ marginTop: 5, display: 'flex', gap: 10 }}>
              <input id="password" name="password" type="password" required />
            </div>
            <label style={{ fontSize: 14, fontWeight: 'bold' }} htmlFor="re-password">
              新しいパスワード
            </label>
            <div style={{ marginTop: 5, display: 'flex', gap: 10 }}>
              <input id="re-password" name="re-password" type="password" required />
            </div>
            <div style={{ marginTop: 20 }}>
              <Button color="black" type="submit">
                変更する
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
