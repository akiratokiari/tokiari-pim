import { createClient } from '@/utils/supabase/server'
import { Plan } from './component/plan'

export default async function Page() {
  const supabase = createClient()
  const data = await supabase.auth.getUser()

  return (
    <div>
      <>
        <div style={{ marginBottom: 20 }}>販売者登録申し込みページ</div>
        <div>{data.data.user?.email}</div>
        <Plan />
      </>
    </div>
  )
}
