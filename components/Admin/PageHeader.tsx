'use client'
import { formatDateTime } from '@/helper/dateFormat'
import { Breadcrumb, Card, Descriptions, Typography } from 'antd'
import { FC } from 'react'

type Props = {
  routes: Routes[]
  title: string
  descriptions?: DescriptionsType
}

type DescriptionsType = {
  id: number | string
  updatedAt: Date
  createdAt: Date
}

type Routes = {
  title: JSX.Element
}

export const PageHeader: FC<Props> = ({ routes, title, descriptions }) => {
  return (
    <Card style={{ marginBottom: '16px' }}>
      <Breadcrumb items={routes} style={{ marginBottom: '12px' }} />
      <Typography.Title level={4}>{title}</Typography.Title>
      {descriptions && (
        <>
          <Descriptions size="small" style={{ paddingTop: '8px' }}>
            <Descriptions.Item label="ID" style={{ paddingBottom: '0px' }}>
              {descriptions.id}
            </Descriptions.Item>
            <Descriptions.Item label="更新日時" style={{ paddingBottom: '0px' }}>
              {formatDateTime(descriptions.updatedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="作成日時" style={{ paddingBottom: '0px' }}>
              {formatDateTime(descriptions.createdAt)}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Card>
  )
}
