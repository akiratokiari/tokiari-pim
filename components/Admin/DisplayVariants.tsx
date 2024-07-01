'use client'
import { ADMIN_PRODUCT_VARIANT_DETAIL_ROUTE } from '@/constants/route'
import toHref from '@/helper/toHref'
import { Card, Image, List } from 'antd'
import Link from 'next/link'
import { FC } from 'react'

type Props = {
  data: {
    id: string
    title: string
    thumbnailUrl: string
  }[]
  productId: string
}

export const DisplayVariants: FC<Props> = ({ data, productId }) => {
  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <Card
            key={item.id}
            title={item.title}
            extra={[
              <Link
                key={item.id}
                href={toHref(ADMIN_PRODUCT_VARIANT_DETAIL_ROUTE, {
                  id: productId,
                  variantId: item.id
                })}
              >
                詳細
              </Link>
            ]}
          >
            <Image src={item.thumbnailUrl} />
          </Card>
        </List.Item>
      )}
    />
  )
}
