import { PageHeader } from '@/components/Admin/PageHeader'
import { ADMIN_ROUTE, ADMIN_USERS_ROUTE, ADMIN_USERS_DETAIL_ROUTE } from '@/constants/route'
import { Button, Card, Col, Descriptions, DescriptionsProps, Row } from 'antd'
import Link from 'next/link'
import toHref from '@/helper/toHref'
import { createClient } from '@/utils/supabase/server'
import { UserType } from '@/app/wholesale/(src)/account/page'
import { ExternalLink } from '@/components/externalLink'

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

  const supabase = createClient()
  const { data } = await supabase.from('users').select().eq('id', params.id).returns<UserType[]>()

  const userData = data && data[0]
  const descriptions = {
    id: userData.id,
    updatedAt: userData.created_at,
    createdAt: userData.updated_at
  }

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
      label: '担当者',
      children: userData?.contact_name,
      span: 3
    }
  ]

  return (
    <Row gutter={[24, 24]}>
      <Col span={18}>
        <PageHeader title="ユーザー詳細" routes={routes} descriptions={descriptions} />
        <Card>
          <Descriptions bordered title="会社情報" items={items} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Button block danger>
            削除
          </Button>
        </Card>
      </Col>
    </Row>
  )
}
