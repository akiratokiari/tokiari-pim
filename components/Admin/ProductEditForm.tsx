'use client'
import { Button, Card, Col, DatePicker, Form, Input,  message, Row, Select } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import {
  ADMIN_PRODUCTS_DETAIL_EDIT_ROUTE,
  ADMIN_PRODUCTS_DETAIL_ROUTE,
  ADMIN_PRODUCTS_ROUTE,
  ADMIN_ROUTE
} from '@/constants/route'
import { PageHeader } from './PageHeader'
import { createClient } from '@/utils/supabase/client'
import toHref from '@/helper/toHref'
import moment from 'moment'
import { CategoryArray } from '@/constants/category'

type Props = {
  productId: string
}

export const ProductEditForm: FC<Props> = ({ productId }) => {
  const router = useRouter()
  const supabase = createClient()
  const [form] = Form.useForm<any>()
  const [productData, setProductData] = useState<any | null>()
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_PRODUCTS_ROUTE}>商品一覧</Link> },
    {
      title: (
        <Link href={toHref(ADMIN_PRODUCTS_DETAIL_ROUTE, { id: productId })}>
          {productData?.title ? productData.title : '詳細'}
        </Link>
      )
    },
    { title: <Link href={toHref(ADMIN_PRODUCTS_DETAIL_EDIT_ROUTE, { id: productId })}>編集</Link> }
  ]
  const [isSending, setIsSending] = useState<boolean>(false)

  useEffect(() => {
    getProductData()
  }, [])

  useEffect(() => {
    if (productData) {
      form.setFieldsValue({
        title: productData.title,
        kana: productData.kana,
        description: productData.description,
        category: productData.category,
        material: productData.material,
        product_code: productData.product_code,
        jicfs_code: productData.jicfs_code,
        gpc_code: productData.gpc_code,
        product_group_code: productData.product_group_code,
        sales_started_at: moment(productData.sales_started_at)
      })
    }
  }, [productData, form, setProductData])

  const getProductData = async () => {
    const { data } = await supabase.from('products').select().eq('id', productId).single()
    setProductData(data)
  }

  const onFinish = async (values: any) => {
    if (isSending) return
    setIsSending(true)

    const _product = {
      // =============================
      title: values.title,
      description: values.description,
      kana: values.kana,
      material: values.material,
      category: values.category,
      // =============================
      product_code: values.product_code,
      jicfs_code: values.jicfs_code,
      gpc_code: values.gpc_code,
      product_group_code: values.product_group_code,
      // =============================
      sales_started_at: values.sales_started_at
    }
    const { error } = await supabase
      .from('products')
      .update({ ..._product })
      .eq('id', productData.id)
      .select()
      .single()
    if (error) {
      message.error('エラーが発生しました')
    }
    router.push(toHref(ADMIN_PRODUCTS_DETAIL_ROUTE, { id: productId }))
  }

  return (
    <Form form={form} layout={'vertical'} onFinish={onFinish}>
      <Row gutter={[24, 24]}>
        <Col span={18}>
          <PageHeader routes={routes} title="商品編集" />
          <Card title="基本情報" style={{ marginBottom: '16px' }}>
            <Form.Item name="title" label="商品名" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="kana" label="商品名(フリガナ)" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="説明" rules={[{ required: true }]}>
              <Input.TextArea rows={6} style={{ width: '100%', height: '60px' }} />
            </Form.Item>
            <Form.Item name="category" label="カテゴリー" rules={[{ required: true }]}>
              <Select>
                {CategoryArray.map((c) => {
                  return <Select.Option value={c}>{c}</Select.Option>
                })}
              </Select>
            </Form.Item>
            <Form.Item name="material" label="素材" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Card>
          <Card title="コード情報" style={{ marginBottom: '16px' }}>
            <Form.Item name="product_code" label="商品コード" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="jicfs_code" label="JICFSコード" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="gpc_code" label="GPCコード" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="product_group_code"
              label="商品グループコード"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Card>
          <Card title="システム情報" style={{ marginBottom: '16px' }}>
            <Form.Item name="sales_started_at" label="販売開始日時" rules={[{ required: true }]}>
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY年MM月DD日 HH:mm"
                placeholder=""
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
