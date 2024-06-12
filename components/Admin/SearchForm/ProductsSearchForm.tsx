'use client'
import { ProductsSearchParams } from '@/app/admin/(src)/products/page'
import { CategoryArray } from '@/constants/category'
import { ADMIN_PRODUCTS_ROUTE } from '@/constants/route'
import { toQuery } from '@/helper/toQuery'
import { Button, Card, Form, Input, Select } from 'antd'
import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'

type Props = ProductsSearchParams

export const ProductsSearchForm: FC<Props> = ({ title, category }) => {
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
  }, [title, category])

  const onSearchSubmit = (values: Props) => {
    const params: Props = {}

    if (values.title) {
      params.title = values.title
    }
    if (values.category) {
      params.category = values.category
    }

    router.push(ADMIN_PRODUCTS_ROUTE + toQuery(params))
  }
  return (
    <Card>
      <Form form={searchForm} onFinish={onSearchSubmit}>
        <Form.Item name="title">
          <Input placeholder="商品名" allowClear />
        </Form.Item>
        <Form.Item name="category">
          <Select placeholder="カテゴリー" allowClear>
            {CategoryArray.map((c, index) => {
              return (
                <Select.Option key={index} value={c}>
                  {c}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Button htmlType="submit" block type="primary">
          検索する
        </Button>
      </Form>
    </Card>
  )
}
