import { PageHeader } from '@/components/Admin/PageHeader'
import {
  ADMIN_ROUTE,
  ADMIN_PRODUCTS_ROUTE,
  ADMIN_PRODUCTS_DETAIL_ROUTE,
  ADMIN_PRODUCTS_DETAIL_VARIANT_CREATE_ROUTE,
  ADMIN_PRODUCTS_DETAIL_EDIT_ROUTE
} from '@/constants/route'
import { Button, Card, Col, Descriptions, DescriptionsProps, Row } from 'antd'
import Link from 'next/link'
import toHref from '@/helper/toHref'
import { createClient } from '@/utils/supabase/server'
import { DisplayVariants } from '@/components/Admin/DisplayVariants'
import { DeleteProductButton } from '@/components/Admin/Button/DeleteProductButton'
import { UpdateProductPublishStatusButton } from '@/components/Admin/Button/UpdateProductPublishStatus'

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_PRODUCTS_ROUTE}>商品一覧</Link> },
    { title: <Link href={toHref(ADMIN_PRODUCTS_DETAIL_ROUTE, { id: params.id })}>詳細</Link> }
  ]

  const supabase = createClient()
  const { data: productData } = await supabase
    .from('products')
    .select('*, product_variants(*, product_variants_size(*), product_images(*))')
    .eq('id', params.id)
    .single()

  if (!productData) return

  const descriptions = {
    id: productData.id,
    updatedAt: productData.updated_at,
    createdAt: productData.created_at
  }

  const codeInfoItems: DescriptionsProps['items'] = [
    {
      key: 'gpcCode',
      label: 'GPCコード',
      children: productData.gpc_code,
      span: 3
    },
    {
      key: 'jicfsCode',
      label: 'JICFSコード',
      children: productData.jicfs_code,
      span: 3
    },
    {
      key: 'productCode',
      label: '商品コード',
      children: productData.product_code,
      span: 3
    },
    {
      key: 'productGroupCode',
      label: '商品グループコード',
      children: productData.product_group_code,
      span: 3
    }
  ]
  const systemInfoItems: DescriptionsProps['items'] = [
    {
      key: 'publishStatus',
      label: '公開ステータス',
      children: productData.publish_status === 1 ? '公開' : '非公開',
      span: 3
    },
    {
      key: 'salesStartedAt',
      label: '販売開始日時',
      children: productData.sales_started_at,
      span: 3
    }
  ]
  const items: DescriptionsProps['items'] = [
    {
      key: 'title',
      label: '商品名',
      children: productData.title,
      span: 3
    },
    {
      key: 'furigana',
      label: 'フリガナ',
      children: productData.furigana,
      span: 3
    },
    {
      key: 'description',
      label: '説明',
      children: <span style={{ whiteSpace: 'pre-wrap' }}>{productData.description}</span>,
      span: 3
    },
    {
      key: 'category',
      label: 'カテゴリ',
      children: productData.category,
      span: 3
    },
    {
      key: 'material',
      label: '素材',
      children: productData.material,
      span: 3
    }
  ]
  const priceItems: DescriptionsProps['items'] = [
    {
      key: 'price',
      label: '販売価格',
      children: `${productData.price}円`,
      span: 3
    }
  ]

  const variants = productData.product_variants.map((pv) => {
    return {
      id: pv.id,
      title: pv.color,
      thumbnailUrl: pv?.product_images[0]?.image_url || ''
    }
  })

  return (
    <Row gutter={[24, 24]}>
      <Col span={18}>
        <PageHeader title="商品詳細" routes={routes} descriptions={descriptions} />
        <Card
          title="商品情報"
          style={{ marginBottom: 16 }}
          extra={[
            <Button href={toHref(ADMIN_PRODUCTS_DETAIL_EDIT_ROUTE, { id: params.id })}>
              編集する
            </Button>
          ]}
        >
          <Descriptions
            size="small"
            labelStyle={{ width: 180 }}
            style={{ marginBottom: 16 }}
            bordered
            items={items}
          />
          <Descriptions
            size="small"
            labelStyle={{ width: 180 }}
            style={{ marginBottom: 16 }}
            bordered
            items={priceItems}
          />
          <Descriptions
            size="small"
            labelStyle={{ width: 180 }}
            style={{ marginBottom: 16 }}
            bordered
            items={codeInfoItems}
          />
          <Descriptions
            size="small"
            labelStyle={{ width: 180 }}
            style={{ marginBottom: 16 }}
            bordered
            title="システム情報"
            items={systemInfoItems}
          />
        </Card>
        <Card
          title="カラーバリエーション"
          extra={[
            <Link href={toHref(ADMIN_PRODUCTS_DETAIL_VARIANT_CREATE_ROUTE, { id: params.id })}>
              <Button block>カラーバリエーションを追加する</Button>
            </Link>
          ]}
        >
          <DisplayVariants data={variants} productId={params.id} />
        </Card>
      </Col>
      <Col span={6}>
        <Card style={{ marginBottom: 16 }}>
          <UpdateProductPublishStatusButton
            publish_status={productData.publish_status}
            productId={params.id}
          />
        </Card>
        <Card>
          <DeleteProductButton productId={params.id} />
        </Card>
      </Col>
    </Row>
  )
}
