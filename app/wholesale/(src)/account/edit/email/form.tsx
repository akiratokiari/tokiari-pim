'use client'
import { AccountContext } from '@/contexts/account/context'
import { useContext } from 'react'
import { useFormState } from 'react-dom'
import { updateUserEmail } from './actions'
import { DisplayFormValue } from '@/components/displayFormValue'
import { Button } from '@/components/button'
import { PageHeader } from '@/components/Wholesale/pageHeader'

export const Form = () => {
  const [status, formAction] = useFormState(updateUserEmail, { isComplete: false, message: '' })
  const { account } = useContext(AccountContext)
  return (
    <div>
      <PageHeader>メールアドレスの変更</PageHeader>
      {status && status.isComplete ? (
        `${status.message}宛に認証メールをお送りしました。`
      ) : (
        <>
          <DisplayFormValue border={false} label="現在のメールアドレス" value={account?.email} />

          <form action={formAction}>
            <label style={{ fontSize: 14, fontWeight: 'bold' }} htmlFor="email">
              新しいメールアドレス
            </label>
            <div style={{ marginTop: 5, display: 'flex', gap: 10 }}>
              <input id="email" name="email" type="email" required />
              <div style={{ maxWidth: 100 }}>
                <Button color="black" type="submit">
                  変更する
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
