'use client'
import { login } from './actions'
import { useFormState } from 'react-dom'

export default function Page() {
  const [state, formAction] = useFormState(login, null)

  return (
    <form action={formAction}>
      <h5>{state && state}</h5>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button type="submit">Log in</button>
    </form>
  )
}
