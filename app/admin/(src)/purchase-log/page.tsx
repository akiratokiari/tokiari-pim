import { PageHeader } from '@/components/Admin/PageHeader'
import { ADMIN_REQUESTS_ROUTE, ADMIN_ROUTE } from '@/constants/route'
import { Col, Row } from 'antd'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { UserType } from '@/app/wholesale/(src)/account/page'
import { LogTable } from './LogTable'

type Props = {
  searchParams: {
    id?: string
    company?: string
    email?: string
    current?: string
  }
}

export default async function Page({ searchParams }: Props) {
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_REQUESTS_ROUTE}>購入履歴</Link> }
  ]
  const PAGE_SIZE = 10
  const currentPage = Number(searchParams.current) || 1
  const supabase = createClient()

  let query = supabase.from('orders').select('*', { count: 'exact' })

  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, count } = await query.range(from, to).returns<UserType[]>()

  const pagination = {
    current: currentPage,
    total: count || 0,
    pageSize: PAGE_SIZE
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={18}>
        <PageHeader title="購入履歴" routes={routes} />
        <LogTable dataSource={data || []} pagination={pagination} searchParams={searchParams} />
      </Col>
    </Row>
  )
}
