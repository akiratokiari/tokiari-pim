'use client'

import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC } from 'react'

import { ProductVariantsSizeRowType } from '@/utils/supabase/type'

type Props = {
  dataSource: ProductVariantsSizeRowType[]
}

type columnType = {
  gtin_code: string
  model_number: string
  product_size: string
}

export const ProductVariantSizeTable: FC<Props> = ({ dataSource }) => {
  const tableData: columnType[] = dataSource.map((product, index) => {
    return {
      key: index,
      gtin_code: product.gtin_code,
      product_size: product.product_size,
      model_number: product.model_number
    }
  })

  const columns: ColumnsType<columnType> = [
    {
      title: 'サイズ',
      dataIndex: 'product_size',
      key: 'product_size'
    },
    {
      title: 'GTINコード',
      dataIndex: 'gtin_code',
      key: 'gtin_code'
    },
    {
      title: 'モデル番号',
      dataIndex: 'model_number',
      key: 'model_number'
    }
  ]

  return <Table columns={columns} dataSource={tableData} pagination={false} />
}
