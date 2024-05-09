'use client'
import { useFormState } from 'react-dom'
import { login } from './actions'
import Link from 'next/link'

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
      <Link href={'/wholesale/register'}>
        <p>登録する</p>
      </Link>
    </div>
  )
}
