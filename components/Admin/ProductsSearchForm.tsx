'use client'
import { ProductsSearchParams } from '@/app/admin/(src)/products/page'
import { ADMIN_USERS_ROUTE } from '@/constants/route'

import { toQuery } from '@/helper/toQuery'
import { Button, Card, Form, Input } from 'antd'
import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'

type Props = ProductsSearchParams

export const ProductsSearchForm: FC<Props> = ({ title, category, publish_status }) => {
  const router = useRouter()
  const [searchForm] = Form.useForm()

  useEffect(() => {
    if (title) {
      searchForm.setFieldsValue({
        title: title
      })
    }
    if (category) {
      searchForm.setFieldsValue({
        category: String(category)
      })
    }
    if (publish_status) {
      searchForm.setFieldsValue({
        publish_status: String(publish_status)
      })
    }
  }, [title, category, publish_status])

  const onSearchSubmit = (values: Props) => {
    const params: Props = {}

    if (values.title) {
      params.title = values.title
    }
    if (values.category) {
      params.category = values.category
    }
    if (values.publish_status) {
      params.publish_status = values.publish_status
    }

    router.push(ADMIN_USERS_ROUTE + toQuery(params))
  }
  return (
    <Card>
      <Form form={searchForm} onFinish={onSearchSubmit}>
        <Form.Item name="title">
          <Input placeholder="商品名" allowClear />
        </Form.Item>
        <Form.Item name="category">
          <Input placeholder="カテゴリー" allowClear />
        </Form.Item>
        <Form.Item name="publish_status">
          <Input placeholder="ステータス" allowClear />
        </Form.Item>
        <Button htmlType="submit" block type="primary">
          検索する
        </Button>
      </Form>
    </Card>
  )
}
