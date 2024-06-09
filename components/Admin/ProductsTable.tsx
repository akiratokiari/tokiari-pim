'use client'
import { ProductsSearchParams } from '@/app/admin/(src)/products/page'
import { ADMIN_PRODUCTS_DETAIL_ROUTE, ADMIN_PRODUCTS_ROUTE } from '@/constants/route'
import toHref from '@/helper/toHref'
import { toQuery } from '@/helper/toQuery'
import { Table } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { formatDate } from '@/helper/dateFormat'

type Props = {
  dataSource: any[]
  pagination: {
    current: number
    total: number
    pageSize: number
  }
  searchParams: ProductsSearchParams
}

type columnType = {
  id: string
  title: string
  category: string
  sales_started_at: string
  // thumbnail_image?: string
}

export const ProductsTable: FC<Props> = ({ dataSource, pagination, searchParams }) => {
  const router = useRouter()
  const tableData: columnType[] = dataSource.map((product) => {
    return {
      id: product.id,
      title: product.title,
      category: product.category,
      sales_started_at: product.sales_started_at
      // thumbnail: product.product_images.find((image: any) => image.image_order === 1) || ''
    }
  })

  const columns: ColumnsType<columnType> = [
    {
      title: '商品名',
      dataIndex: 'title',
      key: 'title'
    },
    // {
    //   title: 'サムネイル',
    //   dataIndex: 'thumbnail',
    //   key: 'thumbnail',
    //   render: (thumbnail) => <Image src={thumbnail.image_url} width={100} height={125} />
    // },
    {
      title: 'カテゴリー',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: '販売開始日時',
      dataIndex: 'sales_started_at',
      key: 'sales_started_at',
      render: (sales_started_at) => formatDate(sales_started_at)
    },
    {
      title: '詳細',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <div>
          <Link href={toHref(ADMIN_PRODUCTS_DETAIL_ROUTE, { id: id })}>詳細</Link>
        </div>
      )
    }
  ]

  const onPaginationChange = (values: TablePaginationConfig) => {
    router.push(
      ADMIN_PRODUCTS_ROUTE +
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
