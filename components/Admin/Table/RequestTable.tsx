'use client'
import { ADMIN_REQUESTS_DETAIL_ROUTE, ADMIN_USERS_ROUTE } from '@/constants/route'
import { formatDateTime } from '@/helper/dateFormat'
import toHref from '@/helper/toHref'
import { toQuery } from '@/helper/toQuery'

import { Card, Empty, Table, Typography } from 'antd'
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
  status: number
  email: string
}

export const RequestTable: FC<Props> = ({ dataSource, pagination, searchParams }) => {
  const router = useRouter()

  const tableData: columnType[] =
    dataSource.map((user) => {
      return {
        id: user.id,
        company: user.company,
        status: user.status,
        email: user.email
      }
    }) || []

  const columns: ColumnsType<columnType> = [
    {
      title: '会社名',
      dataIndex: 'company',
      key: 'company'
    },
    {
      title: 'メールアドレス',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <Text ellipsis={{ tooltip: `${email}` }}>{email}</Text>
    },
    {
      title: '申請時刻',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => formatDateTime(created_at)
    },
    {
      title: '詳細',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <div>
          <Link href={toHref(ADMIN_REQUESTS_DETAIL_ROUTE, { id: id })}>詳細</Link>
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
      {dataSource.length !== 0 ? (
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={pagination}
          onChange={onPaginationChange}
        />
      ) : (
        <Empty/>
      )}
    </Card>
  )
}
