import { UserType } from '@/app/wholesale/(src)/account/page'
import { createContext } from 'react'

type Context = {
  account?: UserType
  refresh: () => void
}

export const AccountContext = createContext<Context>({
  account: undefined,
  refresh() {}
})
