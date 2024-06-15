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
      <div className={style.labelWrapper}>
        {required && <span className={style.required}>必須</span>}
        <div style={{ color: error ? 'red' : 'black' }}>
          {label}
          {error}
        </div>
      </div>
      {children}
    </div>
  )
}
