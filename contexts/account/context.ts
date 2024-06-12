import { createContext } from 'react'

type QuantityData = {
  id: string
  color: string
  seriesNumber: string
  variants: {
    id: string
    size: string
    quantity: number
    modelNumber: string
  }[]
}

type Context = {
  account?: any
  refresh: () => void
}

export const AccountContext = createContext<Context>({
  account: undefined,
  refresh() {}
})
