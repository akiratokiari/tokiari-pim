'use client'
import { DisplayPaymentStatus } from '@/components/Admin/DisplayPaymentStatus'
import { ADMIN_ORDERS_DETAIL_ROUTE, ADMIN_USERS_DETAIL_ROUTE } from '@/constants/route'
import { formatDateTime } from '@/helper/dateFormat'
import toHref from '@/helper/toHref'
import { OrdersRowType, PurchasedProductsRowType } from '@/utils/supabase/type'
import { Card, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Link from 'next/link'
import { FC } from 'react'

type Props = {
  dataSource: DataSource[]
}

type columnType = {
  id: string
  company: string
  payment_status: number
  total_price: number
}

type DataSource = OrdersRowType & {
  purchased_products: PurchasedProductsRowType[]
}

export const ShippingTable: FC<Props> = ({ dataSource }) => {
  const tableData: columnType[] = dataSource.map((order) => {
    let _count = 0
    order.purchased_products.map((pp) => {
      _count = _count + pp.quantity
    })

    return {
      id: order.id,
      user_id: order.user_id,
      company: order.company,
      payment_status: order.payment_status,
      total_price: order.total_price,
      count: _count,
      created_at: order.created_at
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

  return (
    <Card style={{ marginBottom: 10 }}>
      <Table columns={columns} dataSource={tableData} pagination={false} />
    </Card>
  )
}
