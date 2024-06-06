'use client'
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import {
  ADMIN_PRODUCTS_CREATE_ROUTE,
  ADMIN_PRODUCTS_DETAIL_ROUTE,
  ADMIN_PRODUCTS_ROUTE,
  ADMIN_ROUTE
} from '@/constants/route'
import { PageHeader } from './PageHeader'
import { createClient } from '@/utils/supabase/client'
import toHref from '@/helper/toHref'

export const ProductCreateForm: FC = () => {
  const router = useRouter()
  const supabase = createClient()
  const [form] = Form.useForm<any>()
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_PRODUCTS_ROUTE}>商品一覧</Link> },
    { title: <Link href={ADMIN_PRODUCTS_CREATE_ROUTE}>作成</Link> }
  ]
  const [isSending, setIsSending] = useState<boolean>(false)

  const onFinish = async (values: any) => {
    if (isSending) return
    setIsSending(true)

    const _product = {
      // =============================
      publish_status: values.publish_status,
      title: values.title,
      description: values.description,
      furigana: values.furigana,
      material: values.material,
      category: values.category,
      price: values.price,
      // =============================
      product_code: values.product_code,
      jicfs_code: values.jicfs_code,
      gpc_code: values.gpc_code,
      product_group_code: values.product_group_code,
      // =============================
      sales_started_at: values.sales_started_at
    }
    const { data, error } = await supabase
      .from('products')
      .insert({ ..._product })
      .select()
    if (error) return
    router.push(toHref(ADMIN_PRODUCTS_DETAIL_ROUTE, { id: data[0].id }))

    // ここでProduct(親)を作成する
  }

  return (
    <Form form={form} layout={'vertical'} onFinish={onFinish}>
      <Row gutter={[24, 24]}>
        <Col span={18}>
          <PageHeader routes={routes} title="商品作成" />
          <Card title="基本情報" style={{ marginBottom: '16px' }}>
            <Form.Item name="title" label="商品名" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="furigana" label="商品名(フリガナ)" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="説明" rules={[{ required: true }]}>
              <Input.TextArea rows={6} style={{ width: '100%', height: '60px' }} />
            </Form.Item>
            <Form.Item name="category" label="カテゴリー" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="material" label="素材" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Card>
          <Card title="値段情報" style={{ marginBottom: '16px' }}>
            <Form.Item name="price" label="販売価格" rules={[{ required: true }]}>
              <InputNumber />
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
              作成する
            </Button>
          </Card>
        </Col>
      </Row>
    </Form>
  )
}
