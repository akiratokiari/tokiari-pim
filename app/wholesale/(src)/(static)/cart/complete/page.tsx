import { WHOLESALE_ROUTE } from '@/constants/route'
import style from './style.module.css'
import { Button } from '@/components/button'
import { PageHeader } from '@/components/Wholesale/pageHeader'
import { DisplayFormValue } from '@/components/displayFormValue'
import Link from 'next/link'
import Error from '@/app/wholesale/error'

type PageProps = {
  searchParams: {
    orderId?: string
  }
}

export default async function Page({ searchParams }: PageProps) {
  if (!searchParams.orderId) return <Error />
  return (
    <div className={style.body}>
      <PageHeader>Cart</PageHeader>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: 20 }}>ご注文ありがとうございました</div>
        <div style={{ marginBottom: 20 }}>
          ご登録いただいているメールアドレス宛に、注文詳細メールをお送りしましたので、ご確認ください。
        </div>
        <DisplayFormValue first label="注文ID" value={searchParams.orderId} />
        <div style={{ marginTop: 40 }}>
          <Link href={WHOLESALE_ROUTE}>
            <Button color="black">トップページに戻る</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
