import { PageHeader } from '@/components/Admin/PageHeader'
import { ADMIN_ROUTE, ADMIN_USERS_DETAIL_ROUTE, ADMIN_REQUESTS_ROUTE } from '@/constants/route'
import { Card, Col, Descriptions, DescriptionsProps, Row } from 'antd'
import Link from 'next/link'
import toHref from '@/helper/toHref'
import { createClient } from '@/utils/supabase/server'
import { ExternalLink } from '@/components/externalLink'
import { formatDateTime } from '@/helper/dateFormat'
import { RequestPermissionButtons } from '@/components/Admin/Button/RequestPermissionButtons'

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_REQUESTS_ROUTE}>リクエスト一覧</Link> },
    {
      title: <Link href={toHref(ADMIN_USERS_DETAIL_ROUTE, { id: params.id })}>リクエスト詳細</Link>
    }
  ]
  if (!params.id) return
  const supabase = createClient()
  const { data } = await supabase.from('users').select().eq('id', params.id)
  if (!data) return
  const userData = data && data[0]
  console.log(data?.length === 0)

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
      children: userData?.email,
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
      label: '担当者',
      children: userData?.contact_name,
      span: 3
    },
    {
      key: 'contactKana',
      label: '担当者(フリガナ)',
      children: userData?.contact_kana,
      span: 3
    }
  ]

  const systemItems: DescriptionsProps['items'] = [
    {
      key: 'contactName',
      label: 'リクエスト時刻',
      children: formatDateTime(userData?.created_at),
      span: 3
    }
  ]

  return (
    <Row gutter={[24, 24]}>
      <Col span={18}>
        <PageHeader title="リクエスト詳細" routes={routes} />
        <Card style={{ marginBottom: 16 }}>
          <Descriptions bordered title="会社情報" items={items} />
        </Card>
        <Card>
          <Descriptions bordered title="システム情報" items={systemItems} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <RequestPermissionButtons userId={userData?.id || ''} />
        </Card>
      </Col>
    </Row>
  )
}
