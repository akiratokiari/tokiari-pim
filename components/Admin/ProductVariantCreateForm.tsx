'use client'
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Select } from 'antd'
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
import { SizeArray } from '@/constants/size'

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

    const _productVariant = {
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
      return message.error('予期せぬエラーが発生しました')
    }

    const _size = values.variant.map((v: any) => {
      return {
        product_variant_id: productVariant.id,
        product_size: v.product_size,
        model_number: v.model_number,
        gtin_code: v.gtin_code
      }
    })

    _size.map(async (vs: any) => {
      await supabase
        .from('product_variants_size')
        .insert({ ...vs })
        .select()
    })

    router.push(
      toHref(ADMIN_PRODUCT_VARIANT_DETAIL_ROUTE, { id: productId, variantId: productVariant.id })
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
                {ColorArray.map((c) => {
                  return <Select.Option value={c.value}>{c.value}</Select.Option>
                })}
              </Select>
            </Form.Item>
            <Form.Item name="series_number" label="シリーズ番号" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Card>
          <Card title="値段情報" style={{ marginBottom: '16px' }}>
            <Form.Item name="price" label="販売価格" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Card>
          <Card title="サイズ展開">
            <Form.Item name="variant" style={{ marginBottom: -24 }}>
              <Form.List name="variant">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field) => (
                      <div key={field.key} style={{ display: 'flex' }}>
                        <Form.Item
                          name={[field.name, 'product_size']}
                          rules={[{ required: true, message: 'サイズは必須項目です' }]}
                          style={{ width: '33.3%' }}
                        >
                          <Select placeholder="サイズ">
                            {SizeArray.map((s) => {
                              return <Select.Option value={s}>{s}</Select.Option>
                            })}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          name={[field.name, 'model_number']}
                          rules={[{ required: true, message: 'モデル番号は必須項目です' }]}
                          style={{ width: '33.3%', margin: '0 16px' }}
                        >
                          <Input placeholder="モデル番号" />
                        </Form.Item>
                        <Form.Item
                          name={[field.name, 'gtin_code']}
                          rules={[{ required: true, message: 'GTIN番号は必須項目です' }]}
                          style={{ width: '33.3%', marginRight: 16 }}
                        >
                          <Input placeholder="GTIN番号" />
                        </Form.Item>
                        <Button onClick={() => remove(field.name)} type="dashed" danger>
                          削除
                        </Button>
                      </div>
                    ))}
                    <Form.Item>
                      <Button onClick={() => add()} style={{ width: '100%' }}>
                        サイズを追加する
                      </Button>
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>
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