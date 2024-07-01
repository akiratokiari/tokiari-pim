'use client'
import { ORDER_PAYMENT_STATUS } from '@/constants/app'
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
  quantity: number
  price: number
  totalPrice: number
  thumbnail: string
  productId: string
  variantId: string
}

export const PurchasedProductTable: FC<Props> = ({ products }) => {
  const supabase = createClient()
  const [tableData, setTableData] = useState<ColumnType[]>([])

  const data = async () => {
    const { data: productsData } = await supabase
      .from('purchased_products')
      .update({ payment_status: ORDER_PAYMENT_STATUS.Buy })
      .eq('order_id', '315478ee-11fd-4335-b5e0-f829accfcffe')
      .select()
    if (productsData) {
      const awd = await Promise.all(
        productsData.map(async (p) => {
          const { data } = await supabase
            .from('product_variants_size')
            .select(`*,product_variants(*,products(*))`)
            .eq('id', p.product_variant_size_id)
            .single()
          console.log('購入した商品情報を取得', data)
          return {
            id: p.id,
            variantId: data?.product_variant_id || '',
            productId: data?.product_variants?.products?.id || '',
            title: data?.product_variants?.products?.title || '',
            color: data?.product_variants?.color || '',
            size: data?.product_size || '',
            model_number: data?.model_number || '',
            price: p.price,
            quantity: p.quantity,
            totalPrice: p.quantity * p.price
          }
        })
      )
      console.log(awd)
    }
  }

  data()

  useEffect(() => {
    const fetchTableData = async () => {
      const data = await Promise.all(
        products.map(async (p) => {
          const { data } = await supabase
            .from('product_variants_size')
            .select(`*,product_variants(*,products(*), product_images(*))`)
            .eq('id', p.product_variant_size_id)
            .single()

          return {
            id: p.id,
            variantId: data?.product_variant_id || '',
            productId: data?.product_variants?.products?.id || '',
            thumbnail: data?.product_variants?.product_images[0]?.image_url || '',
            title: data?.product_variants?.products?.title || '',
            color: data?.product_variants?.color || '',
            size: data?.product_size || '',
            model_number: data?.model_number || '',
            price: p.price,
            quantity: p.quantity,
            totalPrice: p.quantity * p.price
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
      render: (thumbnail) => <Image width={100} src={thumbnail} />
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
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => `${quantity.toLocaleString()}個`
    }
  ]

  return <Table columns={columns} dataSource={tableData} pagination={false} />
}
