'use client'
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Select } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import {
  ADMIN_PRODUCT_VARIANT_DETAIL_EDIT_ROUTE,
  ADMIN_PRODUCT_VARIANT_DETAIL_ROUTE,
  ADMIN_PRODUCTS_DETAIL_ROUTE,
  ADMIN_PRODUCTS_ROUTE,
  ADMIN_ROUTE
} from '@/constants/route'
import { PageHeader } from './PageHeader'
import { createClient } from '@/utils/supabase/client'
import toHref from '@/helper/toHref'
import { ColorArray } from '@/constants/color'
import { ProductVariantsRowType, ProductVariantsSizeRowType } from '@/utils/supabase/type'

type Props = {
  productId: string
  variantId: string
}

export type ProductVariantWithRelation = ProductVariantsRowType & {
  product_variants_size: ProductVariantsSizeRowType[]
}

export const ProductVariantEditForm: FC<Props> = ({ variantId, productId }) => {
  const router = useRouter()
  const supabase = createClient()
  const [form] = Form.useForm<any>()
  const [productData, setProductData] = useState<ProductVariantWithRelation | null>()
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_PRODUCTS_ROUTE}>商品一覧</Link> },
    {
      title: <Link href={toHref(ADMIN_PRODUCTS_DETAIL_ROUTE, { id: productId })}>詳細</Link>
    },
    {
      title: (
        <Link href={toHref(ADMIN_PRODUCTS_DETAIL_ROUTE, { id: productId })}>
          バリエーション一覧
        </Link>
      )
    },
    {
      title: (
        <Link href={toHref(ADMIN_PRODUCT_VARIANT_DETAIL_ROUTE, { id: productId, variantId })}>
          詳細
        </Link>
      )
    },
    {
      title: (
        <Link href={toHref(ADMIN_PRODUCT_VARIANT_DETAIL_EDIT_ROUTE, { id: productId, variantId })}>
          編集
        </Link>
      )
    }
  ]
  const [isSending, setIsSending] = useState<boolean>(false)

  useEffect(() => {
    getProductData()
  }, [])

  const getProductData = async () => {
    const { data } = await supabase
      .from('product_variants')
      .select('*, product_variants_size(*)')
      .eq('id', variantId)
      .single()
    setProductData(data)
  }

  useEffect(() => {
    if (productData) {
      form.setFieldsValue({
        color: productData.color,
        series_number: productData.series_number,
        price: productData.price
      })
    }
  }, [productData, form, setProductData])

  const onFinish = async (values: any) => {
    if (!productData) return
    if (isSending) return
    setIsSending(true)

    // variantのupdate
    const _productVariant = {
      product_id: productId,
      color: values.color,
      price: values.price,
      series_number: values.series_number
    }
    const { error: variantError } = await supabase
      .from('product_variants')
      .update({ ..._productVariant })
      .eq('id', productData.id)
      .select()

    if (variantError) {
      setIsSending(false)
      return message.error(variantError.message)
    }

    const { error: deleteError } = await supabase
      .from('product_variants_size')
      .delete()
      .eq('product_variant_id', productData.id)

    if (deleteError) {
      setIsSending(false)
      return message.error(deleteError.message)
    }

    message.success('編集されました')
    router.push(
      toHref(ADMIN_PRODUCT_VARIANT_DETAIL_ROUTE, { id: productId, variantId: productData.id })
    )
    router.refresh()
  }

  return (
    <Form form={form} layout={'vertical'} onFinish={onFinish}>
      <Row gutter={[24, 24]}>
        <Col span={18}>
          <PageHeader routes={routes} title="バリエーションの編集" />
          <Card title="基本情報" style={{ marginBottom: '16px' }}>
            <Form.Item name="color" label="色" rules={[{ required: true }]}>
              <Select placeholder="色">
                {ColorArray.map((c, index) => {
                  return (
                    <Select.Option key={index} value={c.value}>
                      {c.value}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item name="series_number" label="シリーズ番号" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Card>
          <Card title="値段情報" style={{ marginBottom: '16px' }}>
            <Form.Item name="price" label="販売価格" rules={[{ required: true }]}>
              <InputNumber<number>
                defaultValue={1000}
                formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\¥\s?|(,*)/g, '') as unknown as number}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Button type="primary" htmlType="submit" block>
              編集する
            </Button>
          </Card>
        </Col>
      </Row>
    </Form>
  )
}
