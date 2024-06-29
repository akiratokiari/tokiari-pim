'use client'
import { ADMIN_PRODUCT_VARIANT_DETAIL_ROUTE } from '@/constants/route'
import toHref from '@/helper/toHref'
import { createClient } from '@/utils/supabase/client'
import { PurchasedProductsRowType } from '@/utils/supabase/type'
import { Image, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'

type Props = {
  products: PurchasedProductsRowType[]
}

type ColumnType = {
  id: string
  title: string
  color: string
  model_number: string
  size: string
  amount: number
  price: number
  totalPrice: number
  thumbnail: string
  productId: string
  variantId: string
}

export const PurchasedProductTable: FC<Props> = ({ products }) => {
  const supabase = createClient()
  const [tableData, setTableData] = useState<ColumnType[]>([])

  useEffect(() => {
    const fetchTableData = async () => {
      const data = await Promise.all(
        products.map(async (p) => {
          const { data } = await supabase
            .from('product_variants_size')
            .select(`*,product_variants(*,products(*), product_images(*))`)
            .eq('model_number', p.model_number)
            .single()

          return {
            id: p.id,
            variantId: data?.product_variant_id || '',
            productId: data?.product_variants?.products.id || '',
            thumbnail: data?.product_variants?.product_images[0]?.image_url || '',
            title: data?.product_variants?.products?.title || '',
            color: data?.product_variants?.color || '',
            size: data?.product_size || '',
            model_number: p.model_number,
            price: p.price,
            amount: p.amount,
            totalPrice: p.amount * p.price
          }
        })
      )
      setTableData(data)
    }

    fetchTableData()
  }, [products, supabase])

  const columns: ColumnsType<ColumnType> = [
    {
      title: '商品名',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '商品ID',
      dataIndex: 'model_number',
      key: 'model_number',
      render: (_, data) => (
        <Link
          href={toHref(ADMIN_PRODUCT_VARIANT_DETAIL_ROUTE, {
            id: data.productId,
            variantId: data.variantId
          })}
        >
          {data.model_number}
        </Link>
      )
    },
    {
      title: '商品画像',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail) => <Image width={100} height={150} src={thumbnail} />
    },
    {
      title: '色',
      dataIndex: 'color',
      key: 'color'
    },
    {
      title: 'サイズ',
      dataIndex: 'size',
      key: 'size',
      render: (size) => <Tag>{size}</Tag>
    },
    {
      title: '値段',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()}円`
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount.toLocaleString()}個`
    }
  ]

  return <Table columns={columns} dataSource={tableData} pagination={false} />
}
