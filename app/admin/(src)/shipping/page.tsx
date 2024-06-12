import { PageHeader } from '@/components/Admin/PageHeader'
import { ADMIN_ROUTE, ADMIN_SHIPPING_ROUTE } from '@/constants/route'
import { Col, Empty, Row } from 'antd'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ShippingTable } from '@/components/Admin/Table/ShippingTable'
import { ORDER_PAYMENT_STATUS } from '@/constants/app'

export default async function Page() {
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_SHIPPING_ROUTE}>発送待ち</Link> }
  ]

  const supabase = createClient()

  const { data } = await supabase
    .from('orders')
    .select('*, purchased_products(*)', { count: 'exact' })
    .eq('payment_status', ORDER_PAYMENT_STATUS.Buy)
    .eq('is_delivered', false)

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <PageHeader title="発送待ち" routes={routes} />
        {data?.length !== 0 && data ? <ShippingTable dataSource={data} /> : <Empty />}
      </Col>
    </Row>
  )
}
