import { FC } from 'react'
import style from './style.module.css'

export const Footer: FC = () => {
  return (
    <div className={style.body}>
      <div className={style.copyrightWrapper}>
        <div className={style.copyright}>©︎ 2024 tokiari</div>
      </div>
    </div>
  )
}
