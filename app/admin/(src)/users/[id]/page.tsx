import { PageHeader } from '@/components/Admin/PageHeader'
import { ADMIN_ROUTE, ADMIN_USERS_ROUTE, ADMIN_USERS_DETAIL_ROUTE } from '@/constants/route'
import { Button, Card, Col, Descriptions, DescriptionsProps, Empty, Row } from 'antd'
import Link from 'next/link'
import toHref from '@/helper/toHref'
import { createClient } from '@/utils/supabase/server'
import { ExternalLink } from '@/components/externalLink'
import { formatDateTime } from '@/helper/dateFormat'
import { UserOrdersTable } from '@/components/Admin/Table/UserOrdersTable'
import { ORDER_PAYMENT_STATUS } from '@/constants/app'
import { LabelStyle } from '@/constants/adminCSS'

type Props = {
  params: {
    id?: string
  }
}

export default async function Page({ params }: Props) {
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_USERS_ROUTE}>ユーザ一覧</Link> },
    { title: <Link href={toHref(ADMIN_USERS_DETAIL_ROUTE, { id: params.id })}>ユーザー詳細</Link> }
  ]
  if (!params.id) return
  const supabase = createClient()
  const { data: userData } = await supabase.from('users').select().eq('id', params.id).single()
  if (!userData) return
  const descriptions = {
    id: userData.id,
    updatedAt: userData.created_at,
    createdAt: userData.updated_at
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*, purchased_products(*)')
    .eq('user_id', params.id)
    .in('payment_status', [ORDER_PAYMENT_STATUS.Buy, ORDER_PAYMENT_STATUS.Refund])

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '会社',
      children: userData?.company,
      span: 3
    },
    {
      key: 'phone',
      label: '電話番号',
      children: userData?.phone,
      span: 3
    },
    {
      key: 'email',
      label: 'メールアドレス',
      children: <a href={`mailto:${userData?.email}`}>{userData?.email}</a>,
      span: 3
    },
    {
      key: 'siteUrl',
      label: 'サイトURL',
      children: <ExternalLink href={userData?.site_url || ''}>{userData?.site_url}</ExternalLink>,
      span: 3
    },
    {
      key: 'address',
      label: '住所',
      children: (
        <div>
          〒 {userData?.postal_code}
          <br />
          {userData?.prefecture}
          {userData?.city}
          {userData?.street_address}
          {userData?.building_name && (
            <>
              <br />
              {userData?.building_name}
            </>
          )}
        </div>
      ),
      span: 3
    },
    {
      key: 'contactName',
      label: <>担当者名</>,
      children: `${userData?.contact_name} (${userData?.contact_kana})`,
      span: 3
    }
  ]

  const systemItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '登録日時',
      children: formatDateTime(userData?.permission_at || new Date()),
      span: 3
    }
  ]

  return (
    <Row gutter={[24, 24]}>
      <Col span={18}>
        <PageHeader title="ユーザー詳細" routes={routes} descriptions={descriptions} />
        <Card style={{ marginBottom: 16 }}>
          <Descriptions
            labelStyle={LabelStyle}
            style={{ marginBottom: 16 }}
            bordered
            title="会社情報"
            items={items}
          />
          <Descriptions labelStyle={LabelStyle} bordered items={systemItems} />
        </Card>
        <Card title="注文履歴">
          {orders && orders?.length > 0 ? <UserOrdersTable dataSource={orders} /> : <Empty />}
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Button block danger>
            削除する
          </Button>
        </Card>
      </Col>
    </Row>
  )
}
