import { FC } from 'react'
import style from './style.module.css'

export const Footer: FC = () => {
  return (
    <div className={style.body}>
      <div className={style.menu}>特定商取引法に基づく表示</div>
      <div className={style.menu}>プライバシーポリシー</div>
      <div className={style.copyrightWrapper}>
        <div className={style.copyright}>©︎ 2024 tokiari</div>
      </div>
    </div>
  )
}
