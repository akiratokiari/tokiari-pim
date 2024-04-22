import { FC, ReactNode } from 'react'
import style from './style.module.css'

type Props = {
  label: string
  error?: string
  children: ReactNode
  required?: boolean
}

export const Helmet: FC<Props> = ({ label, error, required = true, children }) => {
  return (
    <div className={style.body}>
      <div className={style.label}>
        {label}
        <span className={style.required}>
          {required && ' *'}
          {error}
        </span>
      </div>
      {children}
    </div>
  )
}
