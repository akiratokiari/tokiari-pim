import { Plan } from './component/plan'
import style from './style.module.css'

export default async function Page() {
  return (
    <div className={style.body}>
      <div className={style.title}>TOKIARI 卸会員申し込みページ</div>
      <Plan />
    </div>
  )
}
