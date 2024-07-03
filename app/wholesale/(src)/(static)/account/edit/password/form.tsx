'use client'
import { updateUserPassword } from './actions'
import { PageHeader } from '@/components/Wholesale/pageHeader'
import { Button } from '@/components/button'
import { useForm } from '@/helper/UseFormHook'

export const Form = () => {
  // const [status, formAction] = useFormState(updateUserPassword, { isComplete: false, message: '' })
  const { isPending, formState, formAction, onSubmit } = useForm(updateUserPassword, {
    isComplete: false,
    message: ''
  })
  return (
    <div>
      <PageHeader>パスワードの変更</PageHeader>
      {formState && formState.isComplete ? (
        `${formState.message}宛に認証メールをお送りしました。`
      ) : (
        <>
          {formState.message}
          <form action={formAction} onSubmit={onSubmit}>
            <label style={{ fontSize: 14 }} htmlFor="password">
              新しいパスワード
            </label>
            <div style={{ marginTop: 5, display: 'flex', gap: 10 }}>
              <input
                style={{ width: '100%' }}
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
            <label style={{ fontSize: 14 }} htmlFor="re-password">
              新しいパスワード(確認用)
            </label>
            <div style={{ marginTop: 5, display: 'flex', gap: 10 }}>
              <input
                style={{ width: '100%' }}
                id="re-password"
                name="re-password"
                type="password"
                required
              />
            </div>
            <div style={{ marginTop: 20 }}>
              <Button isLoading={isPending} color="black" type="submit">
                変更する
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
