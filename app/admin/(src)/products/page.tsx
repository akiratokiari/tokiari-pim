import { PageHeader } from '@/components/Admin/PageHeader'
import { ADMIN_PRODUCTS_ROUTE, ADMIN_ROUTE } from '@/constants/route'
import { Card, Col, Empty, Row } from 'antd'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ProductsTable } from '@/components/Admin/Table/ProductsTable'
import { ProductsSearchForm } from '@/components/Admin/SearchForm/ProductsSearchForm'

export type ProductsSearchParams = {
  title?: string
  category?: string
  publish_status?: number
  current?: string
}
type Props = {
  searchParams: ProductsSearchParams
}

export default async function Page({ searchParams }: Props) {
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_PRODUCTS_ROUTE}>ユーザ一覧</Link> }
  ]

  const PAGE_SIZE = 10
  const currentPage = Number(searchParams.current) || 1
  const supabase = createClient()

  let query = supabase.from('products').select(`*,product_variants(*)`)

  if (searchParams.title) {
    query = query.eq('title', searchParams.title)
  }
  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }
  if (searchParams.publish_status) {
    query = query.eq('publish_status', searchParams.publish_status)
  }

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
          title={searchParams.title}
          category={searchParams.category}
          publish_status={searchParams.publish_status}
        />
      </Col>
    </Row>
  )
}
