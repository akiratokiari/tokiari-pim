import { PageHeader } from '@/components/Admin/PageHeader'
import {
  ADMIN_ROUTE,
  ADMIN_PRODUCTS_ROUTE,
  ADMIN_PRODUCTS_DETAIL_ROUTE,
  ADMIN_PRODUCT_VARIANT_DETAIL_ROUTE,
  ADMIN_PRODUCT_VARIANT_DETAIL_EDIT_IMAGE_ROUTE,
  ADMIN_PRODUCT_VARIANT_DETAIL_EDIT_ROUTE,
  ADMIN_PRODUCT_VARIANT_DETAIL_EDIT_SIZE_ROUTE
} from '@/constants/route'
import { Button, Card, Col, Descriptions, DescriptionsProps, Empty, Image, Row, Tag } from 'antd'
import Link from 'next/link'
import toHref from '@/helper/toHref'
import { createClient } from '@/utils/supabase/server'
import { DeleteProductVariantButton } from '@/components/Admin/Button/DeleteProductVariantButton'
import { UpdateVariantPublishStatusButton } from '@/components/Admin/Button/UpdateVariantPublishStatusButton'
import { LabelStyle } from '@/constants/adminCSS'
import { ProductVariantSizeTable } from '@/components/Admin/Table/ProductVariantSizeTable'
import { DisplayPublishStatus } from '@/components/Admin/DisplayPublishStatus'

type Props = {
  params: {
    id: string
    variantId: string
  }
}

export default async function Page({ params }: Props) {
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_PRODUCTS_ROUTE}>商品一覧</Link> },
    {
      title: <Link href={toHref(ADMIN_PRODUCTS_DETAIL_ROUTE, { id: params.id })}>商品詳細</Link>
    },
    {
      title: (
        <Link href={toHref(ADMIN_PRODUCTS_DETAIL_ROUTE, { id: params.id })}>
          バリエーション一覧
        </Link>
      )
    },
    {
      title: (
        <Link
          href={toHref(ADMIN_PRODUCT_VARIANT_DETAIL_ROUTE, {
            id: params.id,
            variantId: params.variantId
          })}
        >
          バリエーション詳細
        </Link>
      )
    }
  ]

  const supabase = createClient()
  const { data: productData } = await supabase
    .from('product_variants')
    .select('*, product_images(*), product_variants_size(*)')
    .eq('id', params.variantId)
    .single()
  if (!productData) return

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
      key: 'productCode',
      label: 'シリーズ番号',
      children: productData.series_number,
      span: 3
    }
  ]

  const priceItems: DescriptionsProps['items'] = [
    {
      key: 'price',
      label: '販売価格',
      children: `${productData.price.toLocaleString()}円`,
      span: 3
    }
  ]

  const publishStatusItems: DescriptionsProps['items'] = [
    {
      key: 'publishStatus',
      label: '公開ステータス',
      children: <DisplayPublishStatus publish_status={productData.publish_status} />,
      span: 3
    }
  ]

  return (
    <Row gutter={[24, 24]}>
      <Col span={18}>
        <PageHeader title="バリエーション詳細" routes={routes} descriptions={descriptions} />
        <Card
          title="基本情報"
          style={{ marginBottom: 16 }}
          extra={[
            <Button
              href={toHref(ADMIN_PRODUCT_VARIANT_DETAIL_EDIT_ROUTE, {
                id: params.id,
                variantId: params.variantId
              })}
            >
              編集する
            </Button>
          ]}
        >
          <Descriptions
            labelStyle={LabelStyle}
            style={{ marginBottom: 16 }}
            bordered
            items={items}
          />
          <Descriptions
            labelStyle={LabelStyle}
            style={{ marginBottom: 16 }}
            bordered
            items={priceItems}
          />
          <Descriptions
            labelStyle={LabelStyle}
            style={{ marginBottom: 16 }}
            bordered
            items={publishStatusItems}
          />
        </Card>

        <Card
          title="サイズ展開"
          extra={[
            <Button
              href={toHref(ADMIN_PRODUCT_VARIANT_DETAIL_EDIT_SIZE_ROUTE, {
                id: params.id,
                variantId: params.variantId
              })}
            >
              編集する
            </Button>
          ]}
          style={{ marginBottom: 16 }}
        >
          {productData && productData.product_variants_size.length > 0 ? (
            <ProductVariantSizeTable dataSource={productData.product_variants_size} />
          ) : (
            <Empty />
          )}
        </Card>

        <Card
          style={{ marginBottom: 16 }}
          extra={[
            <Button
              href={toHref(ADMIN_PRODUCT_VARIANT_DETAIL_EDIT_IMAGE_ROUTE, {
                id: params.id,
                variantId: params.variantId
              })}
              key="edit"
            >
              編集する
            </Button>
          ]}
          title="ギャラリー"
        >
          {productData && productData.product_images.length > 0 ? (
            <>
              {productData.product_images.map((image) => (
                <span key={image.id} style={{ marginRight: '16px' }}>
                  <Image width={200} src={image.image_url} alt="" />
                </span>
              ))}
            </>
          ) : (
            <Empty />
          )}
        </Card>
      </Col>
      <Col span={6}>
        <Card style={{ marginBottom: 16 }}>
          <UpdateVariantPublishStatusButton
            publish_status={productData.publish_status}
            variantId={params.variantId}
          />
        </Card>
        <Card>
          <DeleteProductVariantButton id={params.id} variantId={params.variantId} />
        </Card>
      </Col>
    </Row>
  )
}
