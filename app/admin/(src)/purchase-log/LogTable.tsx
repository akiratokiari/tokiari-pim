'use client'
import { ADMIN_REQUESTS_DETAIL_ROUTE, ADMIN_USERS_ROUTE } from '@/constants/route'
import toHref from '@/helper/toHref'
import { toQuery } from '@/helper/toQuery'
import { Card, Table } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

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
  amount: number
}

export const LogTable: FC<Props> = ({ dataSource, pagination, searchParams }) => {
  const router = useRouter()
  const tableData: columnType[] = dataSource.map((user) => {
    return {
      id: user.id || '',
      company: user.company || '',
      status: user.status || 0,
      amount: user.amount
    }
  })

  const columns: ColumnsType<columnType> = [
    {
      title: '会社名',
      dataIndex: 'company',
      key: 'company'
    },
    {
      title: '合計金額',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount.toLocaleString()}円`
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
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={pagination}
        onChange={onPaginationChange}
      />
    </Card>
  )
}
