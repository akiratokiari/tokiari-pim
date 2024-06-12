import { PageHeader } from '@/components/Admin/PageHeader'
import { ADMIN_REQUESTS_ROUTE, ADMIN_ROUTE } from '@/constants/route'
import { Col, Row } from 'antd'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { RequestTable } from '@/components/Admin/Table/RequestTable'

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
    { title: <Link href={ADMIN_REQUESTS_ROUTE}>リクエスト一覧</Link> }
  ]
  const PAGE_SIZE = 10
  const currentPage = Number(searchParams.current) || 1
  const supabase = createClient()

  let query = supabase.from('users').select('*', { count: 'exact' }).is('user_role', null)

  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, count } = await query.range(from, to)

  const pagination = {
    current: currentPage,
    total: count || 0,
    pageSize: PAGE_SIZE
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <PageHeader title="リクエスト一覧" routes={routes} />
        <RequestTable dataSource={data || []} pagination={pagination} searchParams={searchParams} />
      </Col>
    </Row>
  )
}
