import { FC } from 'react'
import style from './style.module.css'

type Props = {
  label: string
  value?: string
  first?: boolean
  border?: boolean
}

export const DisplayFormValue: FC<Props> = ({ label, value, first = false, border = true }) => {
  return (
    <div>
      {!border && first && <div className={style.borderTop} />}
      <div
        className={style.body}
        style={{ borderBottom: border ? 'solid 1px rgb(221, 221, 221)' : 'none' }}
      >
        <div className={style.label}>{label}</div>
        <div className={style.value}>{value}</div>
      </div>
    </div>
  )
}
