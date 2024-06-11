import { PageHeader } from '@/components/Admin/PageHeader'
import { ADMIN_REQUESTS_ROUTE, ADMIN_ROUTE } from '@/constants/route'
import { Col, Empty, Row } from 'antd'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { OrderTable } from '@/components/Admin/Table/OrderTable'
import { OrdersSearchForm } from '@/components/Admin/SearchForm/OrdersSearchForm'

type Props = {
  searchParams: {
    company?: string
    paymentIntent?: string
    current?: string
  }
}

export default async function Page({ searchParams }: Props) {
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_REQUESTS_ROUTE}>注文一覧</Link> }
  ]
  const PAGE_SIZE = 10
  const currentPage = Number(searchParams.current) || 1
  const supabase = createClient()

  let query = supabase
    .from('orders')
    .select('*, purchased_products(*)', { count: 'exact' })
    .in('payment_status', [2, 4])

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
      <Col span={18}>
        <PageHeader title="注文一覧" routes={routes} />
        {data ? (
          <OrderTable dataSource={data} pagination={pagination} searchParams={searchParams} />
        ) : (
          <Empty />
        )}
      </Col>
      <Col span={6}>
        <OrdersSearchForm
          paymentIntent={searchParams.paymentIntent}
          company={searchParams.company}
        />
      </Col>
    </Row>
  )
}
