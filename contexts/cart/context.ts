import { createContext } from 'react'

type Context = {
  account?: any
  refresh: () => void
}

export const AccountContext = createContext<Context>({
  account: undefined,
  refresh() {}
})