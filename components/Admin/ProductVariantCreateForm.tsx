'use client'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  InputNumberProps,
  message,
  Row,
  Select
} from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import {
  ADMIN_PRODUCT_VARIANT_DETAIL_ROUTE,
  ADMIN_PRODUCTS_DETAIL_ROUTE,
  ADMIN_PRODUCTS_DETAIL_VARIANT_CREATE_ROUTE,
  ADMIN_PRODUCTS_ROUTE,
  ADMIN_ROUTE
} from '@/constants/route'
import { PageHeader } from './PageHeader'
import { createClient } from '@/utils/supabase/client'
import toHref from '@/helper/toHref'
import { ColorArray } from '@/constants/color'
import { ProductVariantsInsertType } from '@/utils/supabase/type'

type Props = {
  productId: string
}

export const ProductVariantCreateForm: FC<Props> = ({ productId }) => {
  const router = useRouter()
  const supabase = createClient()
  const [form] = Form.useForm<any>()
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_PRODUCTS_ROUTE}>商品一覧</Link> },
    { title: <Link href={toHref(ADMIN_PRODUCTS_DETAIL_ROUTE, { id: productId })}>詳細</Link> },
    {
      title: (
        <Link href={toHref(ADMIN_PRODUCTS_DETAIL_VARIANT_CREATE_ROUTE, { id: productId })}>
          バリエーション作成
        </Link>
      )
    }
  ]
  const [isSending, setIsSending] = useState<boolean>(false)

  const onFinish = async (values: any) => {
    if (isSending) return
    setIsSending(true)

    const _productVariant: ProductVariantsInsertType = {
      product_id: productId,
      color: values.color,
      series_number: values.series_number,
      price: values.price
    }

    const { data: productVariant, error } = await supabase
      .from('product_variants')
      .insert({ ..._productVariant })
      .select()
      .single()

    if (error) {
      setIsSending(false)
      return message.error(error.message)
    }

    message.error('作成されました')
    router.push(
      toHref(ADMIN_PRODUCT_VARIANT_DETAIL_ROUTE, {
        id: productId,
        variantId: productVariant.id
      })
    )
    router.refresh()
  }

  return (
    <Form form={form} layout={'vertical'} onFinish={onFinish}>
      <Row gutter={[24, 24]}>
        <Col span={18}>
          <PageHeader routes={routes} title="バリエーションの作成" />
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
              作成する
            </Button>
          </Card>
        </Col>
      </Row>
    </Form>
  )
}
