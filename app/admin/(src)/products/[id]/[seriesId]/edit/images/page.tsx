'use client'
import { Button, Card, Col, Form, Row } from 'antd'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuid } from 'uuid'

import { ImageUpload } from '@/components/Admin/DnD/ImageUpload'
import {
  ADMIN_PRODUCT_SERIES_DETAIL_ROUTE,
  ADMIN_PRODUCTS_DETAIL_ROUTE,
  ADMIN_PRODUCTS_ROUTE,
  ADMIN_ROUTE
} from '@/constants/route'
import toHref from '@/helper/toHref'
import { createClient } from '@/utils/supabase/client'

type Props = {
  params: {
    id: string
    seriesId: string
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
      .eq('product_variant_id', params.seriesId)
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
  console.log(file)

  useEffect(() => {
    getImages()
  }, [params])

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

  const onFinish = async (e: any) => {
    await supabase.from('product_images').delete().eq('product_variant_id', params.seriesId)

    const _params = e.images.map((image: any) => {
      return { product_variant_id: params.seriesId, image_url: image }
    })

    _params.map(async (p: any) => {
      await supabase.from('product_images').insert({ ...p })
    })

    router.push(
      toHref(ADMIN_PRODUCT_SERIES_DETAIL_ROUTE, { id: params.id, seriesId: params.seriesId })
    )
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
