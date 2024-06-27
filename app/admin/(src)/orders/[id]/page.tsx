import { ShippingStatusButton } from '@/components/Admin/Button/ShippingStatusButton'
import { DisplayPaymentStatus } from '@/components/Admin/DisplayPaymentStatus'
import { PageHeader } from '@/components/Admin/PageHeader'
import { PurchasedProductTable } from '@/components/Admin/Table/PurchasedProductTable'
import { LabelStyle } from '@/constants/adminCSS'
import { ORDER_DELIVERY_OPTION } from '@/constants/app'
import {
  ADMIN_ROUTE,
  ADMIN_SHIPPING_DETAIL_ROUTE,
  ADMIN_SHIPPING_ROUTE,
  ADMIN_USERS_DETAIL_ROUTE
} from '@/constants/route'
import { formatDateTime } from '@/helper/dateFormat'
import toHref from '@/helper/toHref'
import { createClient } from '@/utils/supabase/server'
import { Alert, Card, Col, Descriptions, DescriptionsProps, Row } from 'antd'
import Link from 'next/link'

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const supabase = createClient()
  const { data: order } = await supabase
    .from('orders')
    .select('*, purchased_products(*)', { count: 'exact' })
    .eq('id', params.id)
    .single()
  if (!order) return

  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_SHIPPING_ROUTE}>発送待ち一覧</Link> },
    {
      title: <Link href={toHref(ADMIN_SHIPPING_DETAIL_ROUTE, { id: params.id })}>詳細</Link>
    }
  ]
  if (!params.id) return

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '購入者',
      children: (
        <Link href={toHref(ADMIN_USERS_DETAIL_ROUTE, { id: order.user_id })}>{order.company}</Link>
      ),
      span: 3
    },
    {
      key: 'phone',
      label: '電話番号',
      children: order.phone,
      span: 3
    },
    {
      key: 'address',
      label: '住所',
      children: (
        <div>
          〒 {order.postal_code}
          <br />
          {order.prefecture}
          {order.city}
          {order.street_address}
          {order.building_name && (
            <>
              <br />
              {order.building_name}
            </>
          )}
        </div>
      ),
      span: 3
    }
  ]
  const deliveryOptionItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '配送希望日',
      children: order.option === ORDER_DELIVERY_OPTION.Exist ? order.delivery_date : '指定なし',
      span: 3
    },
    {
      key: 'phone',
      label: '配送時間帯',
      children: order.option === ORDER_DELIVERY_OPTION.Exist ? order.delivery_time : '指定なし',
      span: 3
    },
    {
      key: 'remarks',
      label: '備考欄',
      children: <div style={{ whiteSpace: 'pre-wrap' }}>{order.remarks}</div>,
      span: 3
    }
  ]

  const systemItems: DescriptionsProps['items'] = [
    {
      label: '決済ID',
      key: 'payment_intent',
      children: order.payment_intent,
      span: 3
    },
    {
      label: '決済ステータス',
      key: 'payment_status',
      children: DisplayPaymentStatus(order.payment_status),
      span: 3
    },
    {
      label: '決済金額',
      key: '',
      children: `${order.amount.toLocaleString()}円`,
      span: 3
    },
    {
      label: '決済時刻',
      key: 'created_at',
      children: formatDateTime(order.created_at),
      span: 3
    }
  ]

  return (
    <Row gutter={[24, 24]}>
      <Col span={18}>
        {!order.is_delivered && (
          <Alert style={{ marginBottom: 16 }} message="決済が完了しています。商品を発送してください。" type="success" />
        )}
        <PageHeader title="購入履歴詳細" routes={routes} />
        <Card style={{ marginBottom: 16 }}>
          <Descriptions
            labelStyle={LabelStyle}
            bordered
            title="配送先"
            items={items}
            style={{ marginBottom: 16 }}
          />
          <Descriptions
            labelStyle={LabelStyle}
            bordered
            title="配送オプション"
            items={deliveryOptionItems}
          />
        </Card>
        <Card title="購入商品" style={{ marginBottom: 16 }}>
          <PurchasedProductTable products={order.purchased_products} />
        </Card>
        <Card>
          <Descriptions labelStyle={LabelStyle} bordered title="決済情報" items={systemItems} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <ShippingStatusButton orderId={params.id} />
        </Card>
      </Col>
    </Row>
  )
}
