'use client'
import { useFormState } from 'react-dom'
import { register } from './actions'
import style from './style.module.css'

export default function Page() {
  const [state, formAction] = useFormState(register, null)

  return (
    <div>
      <form action={formAction} className={style.form}>
        {state && state}

        <label htmlFor="email">メールアドレス:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">パスワード:</label>
        <input id="password" name="password" type="password" required />

        <button type="submit">登録する</button>
      </form>
    </div>
  )
}
