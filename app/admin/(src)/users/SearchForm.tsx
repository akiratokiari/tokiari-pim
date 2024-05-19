'use client'
import { ADMIN_USERS_ROUTE } from '@/constants/route'

import { toQuery } from '@/helper/toQuery'
import { Button, Card, Form, Input } from 'antd'
import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'

type Props = {
  id?: string
  company?: string
  email?: string
}

export const SearchForm: FC<Props> = ({ id, company, email }) => {
  const router = useRouter()
  const [searchForm] = Form.useForm()

  useEffect(() => {
    if (id) {
      searchForm.setFieldsValue({
        id: id
      })
    }
    if (company) {
      searchForm.setFieldsValue({
        company: company
      })
    }
    if (email) {
      searchForm.setFieldsValue({
        email: String(email)
      })
    }
  }, [id, company, email])

  const onSearchSubmit = (values: Props) => {
    const params: Props = {}
    if (values.id) {
      params.id = values.id
    }
    if (values.company) {
      params.company = values.company
    }
    if (values.email) {
      params.email = values.email
    }

    router.push(ADMIN_USERS_ROUTE + toQuery(params))
  }
  return (
    <Card>
      <Form form={searchForm} onFinish={onSearchSubmit}>
        <Form.Item name="id">
          <Input placeholder="ID" allowClear />
        </Form.Item>
        <Form.Item name="company">
          <Input placeholder="会社名" allowClear />
        </Form.Item>
        <Form.Item name="email">
          <Input placeholder="メールアドレス" allowClear />
        </Form.Item>
        <Button htmlType="submit" block type="primary">
          検索する
        </Button>
      </Form>
    </Card>
  )
}
