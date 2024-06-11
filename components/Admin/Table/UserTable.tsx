'use client'
import { ADMIN_USERS_DETAIL_ROUTE, ADMIN_USERS_ROUTE } from '@/constants/route'
import { formatDate } from '@/helper/dateFormat'
import toHref from '@/helper/toHref'
import { toQuery } from '@/helper/toQuery'
import { toStringPlan } from '@/helper/toStringPlan'
import { Card, Table, Typography } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

const { Text } = Typography

type Props = {
  dataSource: any[] | []
  pagination: {
    current: number
    total: number
    pageSize: number
  }
  searchParams: {
    id?: string
    company?: string
    email?: string
  }
}

type columnType = {
  id: string
  company: string
  plan: number
  email: string
}

export const UsersTable: FC<Props> = ({ dataSource, pagination, searchParams }) => {
  const router = useRouter()
  const tableData: columnType[] = dataSource.map((user) => {
    return {
      id: user.id,
      company: user.company,
      plan: user.plan || 0,
      email: user.email
    }
  })

  const columns: ColumnsType<columnType> = [
    {
      title: '会社名',
      dataIndex: 'company',
      key: 'company'
    },
    {
      title: 'プラン',
      dataIndex: 'plan',
      key: 'plan',
      render: (plan: number) => toStringPlan(plan)
    },
    {
      title: 'メールアドレス',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <Text ellipsis={{ tooltip: `${email}` }}>{email}</Text>
    },
    {
      title: '登録日時',
      dataIndex: 'arrowed_at',
      key: 'arrowed_at',
      render: (arrowed_at: Date) => formatDate(arrowed_at)
    },
    {
      title: '詳細',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <div>
          <Link href={toHref(ADMIN_USERS_DETAIL_ROUTE, { id: id })}>詳細</Link>
        </div>
      )
    }
  ]

  const onPaginationChange = (values: TablePaginationConfig) => {
    router.push(
      ADMIN_USERS_ROUTE +
        toQuery({
          ...searchParams,
          current: values.current || 1
        })
    )
  }

  return (
    <Card>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={pagination}
        onChange={onPaginationChange}
      />
    </Card>
  )
}
