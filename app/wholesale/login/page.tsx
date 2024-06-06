'use client'
import { useFormState } from 'react-dom'
import { login } from './actions'
import Link from 'next/link'
import { WHOLESALE_RESET_PASSWORD } from '@/constants/route'

export default function Page() {
  const [state, formAction] = useFormState(login, null)
  return (
    <div>
      <form action={formAction}>
        {state && state}
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button>Log in</button>
      </form>
      <Link href={WHOLESALE_RESET_PASSWORD}>
        <p>パスワードを忘れた方</p>
      </Link>
    </div>
  )
}
