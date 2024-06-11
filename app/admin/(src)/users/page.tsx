import { PageHeader } from '@/components/Admin/PageHeader'
import { ADMIN_ROUTE, ADMIN_USERS_ROUTE } from '@/constants/route'
import { Col, Row } from 'antd'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { USER_ROLE } from '@/constants/app'
import { UsersTable } from '@/components/Admin/Table/UserTable'
import { UserSearchForm } from '@/components/Admin/UserSearchForm'

type Props = {
  searchParams: {
    id?: string
    company?: string
    email?: string
    current?: string
  }
}

export default async function Page({ searchParams }: Props) {
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_USERS_ROUTE}>ユーザ一覧</Link> }
  ]
  const PAGE_SIZE = 10
  const currentPage = Number(searchParams.current) || 1
  const supabase = createClient()

  let query = supabase
    .from('users')
    .select('*', { count: 'exact' })
    .eq('user_role', USER_ROLE.Buyer)

  if (searchParams.company) {
    query = query.eq('company', searchParams.company)
  }
  if (searchParams.id) {
    query = query.eq('id', searchParams.id)
  }
  if (searchParams.email) {
    query = query.eq('email', searchParams.email)
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
        <PageHeader title="ユーザー覧" routes={routes} />
        <UsersTable dataSource={data || []} pagination={pagination} searchParams={searchParams} />
      </Col>
      <Col span={6}>
        <UserSearchForm
          id={searchParams.id}
          email={searchParams.email}
          company={searchParams.company}
        />
      </Col>
    </Row>
  )
}
