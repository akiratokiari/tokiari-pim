import { WHOLESALE_LOGIN_ROUTE } from '@/constants/route'
import Link from 'next/link'

export default async function Page() {
  return (
    <div>
      <h1>認証が完了しました</h1>
      <Link href={WHOLESALE_LOGIN_ROUTE}>
        <button>ログインする</button>
      </Link>
    </div>
  )
}
