import { PageHeader } from '@/components/Admin/PageHeader'
import { ADMIN_ROUTE, ADMIN_SHIPPING_ROUTE } from '@/constants/route'
import { Card, Col, Empty, Row } from 'antd'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ShippingTable } from '@/components/Admin/Table/ShippingTable'
import { ORDER_PAYMENT_STATUS } from '@/constants/app'
import { RequestTable } from '@/components/Admin/Table/RequestTable'

export default async function Page() {
  const supabase = createClient()

  const { data } = await supabase
    .from('orders')
    .select('*, purchased_products(*)', { count: 'exact' })
    .eq('payment_status', ORDER_PAYMENT_STATUS.Buy)
    .eq('is_delivered', false)

  const { data: dataSource } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .is('user_role', null)

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card title="発送待ち" style={{ marginBottom: 16 }}>
          {data?.length !== 0 && data ? <ShippingTable dataSource={data} /> : <Empty />}
        </Card>
        <Card title="リクエスト一覧">
          <RequestTable dataSource={dataSource || []} />
        </Card>
      </Col>
    </Row>
  )
}

// const PAGE_SIZE = 10
// const currentPage = Number(searchParams.current) || 1
// const supabase = createClient()

// let query = supabase.from('users').select('*', { count: 'exact' }).is('user_role', null)

// const from = (currentPage - 1) * PAGE_SIZE
// const to = from + PAGE_SIZE - 1
// const { data, count } = await query.range(from, to)

// const pagination = {
//   current: currentPage,
//   total: count || 0,
//   pageSize: PAGE_SIZE
// }

// return (
//   <Row gutter={[24, 24]}>
//     <Col span={24}>
//       <PageHeader title="リクエスト一覧" routes={routes} />
//       <RequestTable dataSource={data || []} pagination={pagination} searchParams={searchParams} />
//     </Col>
//   </Row>
// )
