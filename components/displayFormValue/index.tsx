import { FC } from 'react'
import style from './style.module.css'

type Props = {
  label: string
  value?: string
  first?: boolean
}

export const DisplayFormValue: FC<Props> = ({ label, value, first = false }) => {
  return (
    <div>
      {first && <div className={style.borderTop} />}
      <div className={style.body}>
        <div className={style.label}>{label}</div>
        <div className={style.value}>{value}</div>
      </div>
    </div>
  )
}
