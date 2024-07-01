import { Card, Col, Empty, Row } from 'antd'
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
