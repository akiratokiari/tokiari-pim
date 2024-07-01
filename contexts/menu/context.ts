import { createContext } from 'react'

type Context = {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const MenuContext = createContext<Context>({
  isOpen: false,
  open() {},
  close() {}
})
