import { PageHeader } from '@/components/Admin/PageHeader'
import {
  ADMIN_ROUTE,
  ADMIN_PRODUCTS_ROUTE,
  ADMIN_PRODUCTS_DETAIL_ROUTE,
  ADMIN_PRODUCT_SERIES_DETAIL_ROUTE,
  ADMIN_PRODUCT_SERIES_DETAIL_EDIT_IMAGE_ROUTE
} from '@/constants/route'
import { Card, Col, Descriptions, DescriptionsProps, Image, Row, Tag } from 'antd'
import Link from 'next/link'
import toHref from '@/helper/toHref'
import { createClient } from '@/utils/supabase/server'
import { DeleteProductVariantButton } from '@/components/Admin/Button/DeleteProductVariantButton'

type Props = {
  params: {
    id: string
    seriesId: string
  }
}

export default async function Page({ params }: Props) {
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_PRODUCTS_ROUTE}>商品一覧</Link> },
    {
      title: <Link href={toHref(ADMIN_PRODUCTS_DETAIL_ROUTE, { id: params.seriesId })}>詳細</Link>
    },
    {
      title: (
        <Link
          href={toHref(ADMIN_PRODUCT_SERIES_DETAIL_ROUTE, {
            id: params.id,
            seriesId: params.seriesId
          })}
        >
          シリーズ詳細
        </Link>
      )
    }
  ]

  const supabase = createClient()
  const { data, error } = await supabase
    .from('product_variants')
    .select('*, product_images(*), product_variants_size(*)')
    .eq('id', params.seriesId)

  if (!data) return
  const productData = data && data[0]
  const descriptions = {
    id: productData.id,
    updatedAt: productData.updated_at,
    createdAt: productData.created_at
  }

  const items: DescriptionsProps['items'] = [
    {
      key: 'color',
      label: '色',
      children: productData.color,
      span: 3
    },
    {
      key: 'size',
      label: 'サイズ展開',
      children: productData.product_variants_size.map((pvs) => {
        return <Tag>{pvs.product_size}</Tag>
      }),
      span: 3
    }
  ]

  const codeInfoItems: DescriptionsProps['items'] = [
    {
      key: 'productCode',
      label: 'シリーズ番号',
      children: productData.series_number,
      span: 3
    },
    {
      key: 'modelCode',
      label: 'モデル番号',
      children: productData.product_variants_size.map((pvs) => {
        return (
          <>
            {pvs.product_size} : {pvs.model_number}
            <br />
          </>
        )
      }),
      span: 3
    }
  ]

  return (
    <Row gutter={[24, 24]}>
      <Col span={18}>
        <PageHeader title="商品(シリーズ)詳細" routes={routes} descriptions={descriptions} />
        <Card style={{ marginBottom: 16 }}>
          <Descriptions
            labelStyle={{ width: 180 }}
            style={{ marginBottom: 16 }}
            bordered
            title="商品情報"
            items={items}
          />
          <Descriptions
            labelStyle={{ width: 180 }}
            style={{ marginBottom: 16 }}
            bordered
            title="コード情報"
            items={codeInfoItems}
          />
        </Card>
        <Card
          style={{ marginBottom: 16 }}
          extra={[
            <Link
              href={toHref(ADMIN_PRODUCT_SERIES_DETAIL_EDIT_IMAGE_ROUTE, {
                id: params.id,
                seriesId: params.seriesId
              })}
              key="edit"
            >
              編集する
            </Link>
          ]}
          title="ギャラリー"
        >
          {productData.product_images.map((image) => (
            <span key={image.id} style={{ marginRight: '16px' }}>
              <Image width={200} src={image.image_url} />
            </span>
          ))}
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <DeleteProductVariantButton id={params.id} seriesId={params.seriesId} />
        </Card>
      </Col>
    </Row>
  )
}
