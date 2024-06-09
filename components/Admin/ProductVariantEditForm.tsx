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
import { SizeArray } from '@/constants/size'
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
        price: productData.price,
        variant:
          productData.product_variants_size.map((pvs: any) => ({
            product_size: pvs.product_size,
            model_number: pvs.model_number,
            gtin_code: pvs.gtin_code
          })) || []
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
    const { error } = await supabase
      .from('product_variants')
      .update({ ..._productVariant })
      .eq('id', productData.id)
      .select()

    if (error) {
      return message.error('予期せぬエラーが発生しました')
    }

    await supabase.from('product_variants_size').delete().eq('product_variant_id', productData.id)

    // variant_sizeのupdate
    const _size = values.variant.map((v: any) => {
      return {
        product_variant_id: productData.id,
        product_size: v.product_size,
        model_number: v.model_number,
        gtin_code: v.gtin_code
      }
    })

    _size.map(async (vs: any) => {
      await supabase
        .from('product_variants_size')
        .insert({ ...vs })
        .eq('model_number', vs.model_number)
    })

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
                            {SizeArray.map((s, index) => {
                              return (
                                <Select.Option key={index} value={s}>
                                  {s}
                                </Select.Option>
                              )
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
              編集する
            </Button>
          </Card>
        </Col>
      </Row>
    </Form>
  )
}
