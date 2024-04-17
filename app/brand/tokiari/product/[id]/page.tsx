import { getProducts } from '@/csv/getProducts'
import { FC } from 'react'
import style from './style.module.css'

type Props = {
  params: {
    id: string
  }
}

const Page: FC<Props> = async ({ params }) => {
  const data = await getProducts({})
  const product = data.find((d) => d.id === decodeURI(params.id))

  return (
    <div className={style.body}>
      <div className={style.series}>{decodeURI(params.id)}</div>
      <div className={style.modelWrapper}>
        {product?.model?.map((m) => {
          return (
            <div className={style.model}>
              <div>モデル：{m.modelNumber}</div>
              <div>サイズ：{m.size}</div>
              <div>値段　：{m.sellingPrice}</div>
              <div>素材　：{m.material}</div>
              <div>発売日：{m.salesStartedAt}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Page
