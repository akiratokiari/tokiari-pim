'use client'
import { useFormState } from 'react-dom'
import { register } from './actions'

export default function Page() {
  const [state, formAction] = useFormState(register, null)

  return (
    <div>
      <form action={formAction}>
        {state && state}
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button type="submit">Sign up</button>
      </form>
    </div>
  )
}
