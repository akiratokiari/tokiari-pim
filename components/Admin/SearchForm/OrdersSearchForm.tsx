'use client'
import { ADMIN_ORDERS_ROUTE } from '@/constants/route'
import { toQuery } from '@/helper/toQuery'
import { Button, Card, Form, Input } from 'antd'
import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'

type Props = {
  orderId?: string
  company?: string
}

export const OrdersSearchForm: FC<Props> = ({ orderId, company }) => {
  const router = useRouter()
  const [searchForm] = Form.useForm()

  useEffect(() => {
    if (orderId) {
      searchForm.setFieldsValue({
        orderId: orderId
      })
    }
    if (company) {
      searchForm.setFieldsValue({
        company: company
      })
    }
  }, [orderId, company])

  const onSearchSubmit = (values: Props) => {
    const params: Props = {}

    if (values.orderId) {
      params.orderId = values.orderId
    }
    if (values.company) {
      params.company = values.company
    }

    router.push(ADMIN_ORDERS_ROUTE + toQuery(params))
    router.refresh()
  }
  return (
    <Card>
      <Form form={searchForm} onFinish={onSearchSubmit}>
        <Form.Item name="orderId">
          <Input placeholder="注文ID" allowClear />
        </Form.Item>
        <Form.Item name="company">
          <Input placeholder="会社名" allowClear />
        </Form.Item>
        <Button htmlType="submit" block type="primary">
          検索する
        </Button>
      </Form>
    </Card>
  )
}
