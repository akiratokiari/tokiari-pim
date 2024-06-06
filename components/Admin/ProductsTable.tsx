'use client'
import { ProductsSearchParams } from '@/app/admin/(src)/products/page'
import { ADMIN_PRODUCTS_DETAIL_ROUTE, ADMIN_PRODUCTS_ROUTE } from '@/constants/route'
import { getSeason } from '@/helper/getSeason'
import toHref from '@/helper/toHref'
import { toQuery } from '@/helper/toQuery'
import { Image, Table } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { DisplayPublishStatus } from './DisplayPublishStatus'

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
  season: string
  price: string
  publish_status: number
  // thumbnail_image?: string
}

export const ProductsTable: FC<Props> = ({ dataSource, pagination, searchParams }) => {
  const router = useRouter()
  const tableData: columnType[] = dataSource.map((product) => {
    return {
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      season: product.sales_started_at,
      publish_status: product.publish_status
      // thumbnail: product.product_images.find((image: any) => image.image_order === 1) || ''
    }
  })

  const columns: ColumnsType<columnType> = [
    {
      title: '商品名',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'ステータス',
      dataIndex: 'publish_status',
      key: 'publish_status',
      render: (publish_status) => DisplayPublishStatus(publish_status)
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
      title: '値段',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()}円`
    },
    {
      title: 'シーズン',
      dataIndex: 'season',
      key: 'season',
      render: (arrowed_at: Date) => getSeason(arrowed_at)
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
