import { Plan } from './component/plan'

export default async function Page() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>プランを選択してください</div>
      <Plan />
    </div>
  )
}
