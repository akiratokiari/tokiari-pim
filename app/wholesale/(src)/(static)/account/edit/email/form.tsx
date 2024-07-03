'use client'
import { AccountContext } from '@/contexts/account/context'
import { useContext } from 'react'
import { updateUserEmail } from './actions'
import { DisplayFormValue } from '@/components/displayFormValue'
import { Button } from '@/components/button'
import { PageHeader } from '@/components/Wholesale/pageHeader'
import { useForm } from '@/helper/UseFormHook'

export const Form = () => {
  const { isPending, formState, formAction, onSubmit } = useForm(updateUserEmail, {
    isComplete: false,
    message: ''
  })

  const { account } = useContext(AccountContext)
  return (
    <div>
      <PageHeader>メールアドレスの変更</PageHeader>
      {formState && formState.isComplete ? (
        `${formState.message}宛に認証メールをお送りしました。`
      ) : (
        <>
          <DisplayFormValue border={false} label="現在のメールアドレス" value={account?.email} />
          <form action={formAction} onSubmit={onSubmit}>
            <label style={{ fontSize: 14, fontWeight: 'bold' }} htmlFor="email">
              新しいメールアドレス
            </label>
            <div style={{ marginTop: 5, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input id="email" name="email" type="email" required />
              <div style={{ marginTop: 5 }}>
                <Button isLoading={isPending} color="black" type="submit">
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
