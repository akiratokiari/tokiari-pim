import { FC } from 'react'
import style from './style.module.css'

type Props = {
  children: React.ReactNode
}

export const PageHeader: FC<Props> = ({ children }) => {
  return <div className={style.body}>{children}</div>
}
