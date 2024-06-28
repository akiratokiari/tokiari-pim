'use client'
import { DisplayPaymentStatus } from '@/components/Admin/DisplayPaymentStatus'
import {
  ADMIN_ORDERS_DETAIL_ROUTE,
  ADMIN_USERS_DETAIL_ROUTE,
  ADMIN_USERS_ROUTE
} from '@/constants/route'
import { formatDateTime } from '@/helper/dateFormat'
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
  payment_status: number
  amount: number
}

export const OrderTable: FC<Props> = ({ dataSource, pagination, searchParams }) => {
  const router = useRouter()
  const tableData: columnType[] = dataSource.map((order) => {
    let _count = 0
    order.purchased_products.map((pp: any) => {
      _count = _count + pp.amount
    })

    return {
      id: order.id,
      user_id: order.user_id,
      company: order.company,
      payment_status: order.payment_status,
      amount: order.amount,
      created_at: order.created_at,
      count: _count
    }
  })

  const columns: ColumnsType<columnType> = [
    {
      title: '会社名',
      dataIndex: '',
      key: '',
      render: (column) => (
        <Link href={toHref(ADMIN_USERS_DETAIL_ROUTE, { id: column.user_id })}>
          {column.company}
        </Link>
      )
    },
    {
      title: '支払いステータス',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (payment_status) => DisplayPaymentStatus(payment_status)
    },
    {
      title: '購入点数',
      dataIndex: 'count',
      key: 'count',
      render: (count) => `${count}点`
    },
    {
      title: '合計金額',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount.toLocaleString()}円`
    },
    {
      title: '購入時刻',
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
          <Link href={toHref(ADMIN_ORDERS_DETAIL_ROUTE, { id: id })}>詳細</Link>
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
    <Table
      columns={columns}
      dataSource={tableData}
      pagination={pagination}
      onChange={onPaginationChange}
    />
  )
}
