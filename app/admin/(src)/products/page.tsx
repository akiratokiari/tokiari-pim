import { PageHeader } from '@/components/Admin/PageHeader'
import { ADMIN_ROUTE, ADMIN_USERS_ROUTE } from '@/constants/route'
import { Card, Col, Empty, Row } from 'antd'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ProductsTable } from '@/components/Admin/ProductsTable'
import { ProductsSearchForm } from '@/components/Admin/ProductsSearchForm'

export type ProductsSearchParams = {
  id?: string
  title?: string
  category?: string
  publish_status?: number
  season?: string
  current?: string
}
type Props = {
  searchParams: ProductsSearchParams
}

export default async function Page({ searchParams }: Props) {
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_USERS_ROUTE}>ユーザ一覧</Link> }
  ]

  const PAGE_SIZE = 10
  const currentPage = Number(searchParams.current) || 1
  const supabase = createClient()

  let query = supabase.from('products').select(`*`)

  if (searchParams.id) {
    query = query.eq('id', searchParams.id)
  }
  if (searchParams.title) {
    query = query.eq('title', searchParams.title)
  }
  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }
  if (searchParams.publish_status) {
    query = query.eq('publish_status', searchParams.publish_status)
  }
  if (searchParams.season) {
    query = query.eq('season', searchParams.season)
  }

  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, count, error } = await query.range(from, to)

  const pagination = {
    current: currentPage,
    total: count || 0,
    pageSize: PAGE_SIZE
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={18}>
        <PageHeader title="商品ー覧" routes={routes} />
        <Card>
          {data ? (
            <ProductsTable dataSource={data} pagination={pagination} searchParams={searchParams} />
          ) : (
            <Empty />
          )}
        </Card>
      </Col>
      <Col span={6}>
        <ProductsSearchForm
          id={searchParams.id}
          title={searchParams.title}
          category={searchParams.category}
          publish_status={searchParams.publish_status}
          season={searchParams.season}
        />
      </Col>
    </Row>
  )
}
