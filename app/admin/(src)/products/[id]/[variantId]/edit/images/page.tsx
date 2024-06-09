'use client'
import { Button, Card, Col, Form, message, Row } from 'antd'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuid } from 'uuid'

import { ImageUpload } from '@/components/Admin/DnD/ImageUpload'
import {
  ADMIN_PRODUCT_VARIANT_DETAIL_EDIT_IMAGE_ROUTE,
  ADMIN_PRODUCT_VARIANT_DETAIL_ROUTE,
  ADMIN_PRODUCTS_DETAIL_ROUTE,
  ADMIN_PRODUCTS_ROUTE,
  ADMIN_ROUTE
} from '@/constants/route'
import toHref from '@/helper/toHref'
import { createClient } from '@/utils/supabase/client'
import { PageHeader } from '@/components/Admin/PageHeader'

type Props = {
  params: {
    id: string
    variantId: string
  }
}

const MakerGalleryEdit: FC<Props> = ({ params }) => {
  const router = useRouter()
  const supabase = createClient()
  const [form] = Form.useForm()
  const [file, setFile] = useState<any[]>([])

  const getImages = async () => {
    const { data } = await supabase
      .from('product_images')
      .select()
      .eq('product_variant_id', params.variantId)
    if (data) {
      const _data = data.map((v) => {
        if (v.image_url)
          return {
            uid: uuid(),
            name: v.image_url,
            status: 'done',
            url: v.image_url
          }
      })
      setFile(_data)
    }
  }

  useEffect(() => {
    getImages()
  }, [params])

  const routes = [
    { title: <Link href={ADMIN_ROUTE}>ダッシュボード</Link> },
    { title: <Link href={ADMIN_PRODUCTS_ROUTE}>商品一覧</Link> },
    {
      title: <Link href={toHref(ADMIN_PRODUCTS_DETAIL_ROUTE, { id: params.id })}>詳細</Link>
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
          詳細
        </Link>
      )
    },
    {
      title: (
        <Link
          href={toHref(ADMIN_PRODUCT_VARIANT_DETAIL_EDIT_IMAGE_ROUTE, {
            id: params.id,
            variantId: params.variantId
          })}
        >
          ギャラリー編集
        </Link>
      )
    }
  ]

  const onFinish = async (e: any) => {
    // Delete the existing images for the given product_variant_id
    const { error: deleteError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_variant_id', params.variantId)

    if (deleteError) {
      return message.error('エラーが発生しました')
    }

    const _params = e.images.map((image: any) => ({
      product_variant_id: params.variantId,
      image_url: image
    }))

    for (const p of _params) {
      const { error } = await supabase.from('product_images').insert(p)
      if (error) {
        return message.error('エラーが発生しました')
      }
    }

    router.push(
      toHref(ADMIN_PRODUCT_VARIANT_DETAIL_ROUTE, { id: params.id, variantId: params.variantId })
    )
    router.refresh()
    return message.success('編集しました')
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[24, 24]}>
        <Col span={18}>
          <PageHeader title="商品画像編集" routes={routes} />
          <Form.Item name="images">{file && <ImageUpload file={file} />}</Form.Item>
        </Col>
        <Col span={6}>
          <Card>
            <Button block type="primary" htmlType="submit">
              編集する
            </Button>
          </Card>
        </Col>
      </Row>
    </Form>
  )
}

export default MakerGalleryEdit
