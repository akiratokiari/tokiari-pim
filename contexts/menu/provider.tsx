'use client'
import { MenuContext } from './context'
import { FC, ReactNode, useState } from 'react'

type Props = {
  children: ReactNode
}

export const MenuProvider: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const open = () => {
    setIsOpen(true)
  }
  const close = () => {
    setIsOpen(false)
  }

  const v = {
    isOpen,
    open,
    close
  }
  return <MenuContext.Provider value={v}>{children}</MenuContext.Provider>
}
