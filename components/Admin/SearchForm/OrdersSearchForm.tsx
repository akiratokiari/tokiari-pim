'use client'
import { ADMIN_ORDERS_ROUTE } from '@/constants/route'
import { toQuery } from '@/helper/toQuery'
import { Button, Card, Form, Input } from 'antd'
import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'

type Props = {
  paymentIntent?: string
  company?: string
}

export const OrdersSearchForm: FC<Props> = ({ paymentIntent, company }) => {
  const router = useRouter()
  const [searchForm] = Form.useForm()

  useEffect(() => {
    if (paymentIntent) {
      searchForm.setFieldsValue({
        paymentIntent: paymentIntent
      })
    }
    if (company) {
      searchForm.setFieldsValue({
        company: company
      })
    }
  }, [paymentIntent, company])

  const onSearchSubmit = (values: Props) => {
    const params: Props = {}

    if (values.paymentIntent) {
      params.paymentIntent = values.paymentIntent
    }
    if (values.company) {
      params.company = values.company
    }

    router.push(ADMIN_ORDERS_ROUTE + toQuery(params))
  }
  return (
    <Card>
      <Form form={searchForm} onFinish={onSearchSubmit}>
        <Form.Item name="paymentIntent">
          <Input placeholder="決済ID" allowClear />
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
