'use client'
import {
  ADMIN_ORDERS_DETAIL_ROUTE,
  ADMIN_ORDERS_ROUTE,
  ADMIN_USERS_DETAIL_ROUTE
} from '@/constants/route'
import { formatDateTime } from '@/helper/dateFormat'
import toHref from '@/helper/toHref'
import { toQuery } from '@/helper/toQuery'
import { Table } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { DisplayDeliveryStatus } from '../DisplayDeliveryStatus'

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
  total_price: number
}

export const OrderTable: FC<Props> = ({ dataSource, pagination, searchParams }) => {
  const router = useRouter()
  const tableData: columnType[] = dataSource.map((order) => {
    let _count = 0
    order.purchased_products.map((pp: any) => {
      _count = _count + pp.total_price
    })

    return {
      id: order.id,
      user_id: order.user_id,
      company: order.company,
      payment_status: order.payment_status,
      total_price: order.total_price,
      created_at: order.created_at,
      count: _count,
      is_delivered: order.is_delivered
    }
  })

  const columns: ColumnsType<columnType> = [
    // {
    //   title: '支払い',
    //   dataIndex: 'payment_status',
    //   key: 'payment_status',
    //   render: (payment_status) => DisplayPaymentStatus(payment_status)
    // },
    {
      title: '購入者',
      dataIndex: '',
      key: '',
      render: (column) => (
        <Link href={toHref(ADMIN_USERS_DETAIL_ROUTE, { id: column.user_id })}>
          {column.company}
        </Link>
      )
    },
    {
      title: '配送',
      dataIndex: 'is_delivered',
      key: 'is_delivered',
      render: (is_delivered) => DisplayDeliveryStatus(is_delivered)
    },
    {
      title: '購入点数',
      dataIndex: 'count',
      key: 'count',
      render: (count) => `${count}点`
    },
    {
      title: '合計金額',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (total_price) => `${total_price.toLocaleString()}円`
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
      ADMIN_ORDERS_ROUTE +
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
