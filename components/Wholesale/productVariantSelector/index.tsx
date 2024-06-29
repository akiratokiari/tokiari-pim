'use client'
import { ProductVariantWithRelation } from '@/utils/supabase/type'
import { FC } from 'react'
import { VariantSizeSelector } from '../variantSizeSelector'
import style from './style.module.css'

type Props = {
  product: ProductType
  variants: ProductVariantWithRelation[]
  currentColor: string
}

export type ProductType = {
  id: string
  title: string
  product_group_code: string
}

export const ProductVariantSelector: FC<Props> = ({ product, variants, currentColor }) => {
  return (
    <div>
      {variants.map((pv, index) => {
        if (currentColor === pv.color) {
          return (
            <div key={pv.id} className={style.body}>
              {pv.product_variants_size.map((pvs) => {
                const cartFormatDataWithoutQuantity = {
                  productId: product.id,
                  modelId: pvs.id,
                  seriesId: pv.id,
                  color: pv.color,
                  title: product.title,
                  seriesNumber: pv.series_number,
                  size: pvs.product_size,
                  modelNumber: pvs.model_number,
                  thumbnail:
                    variants[index].product_images.length > 0
                      ? variants[index].product_images[0].image_url
                      : '',
                  product_group_code: product.product_group_code,
                  quantity: 1,
                  price: pv.price
                }
                return <VariantSizeSelector key={pvs.id} data={cartFormatDataWithoutQuantity} />
              })}
            </div>
          )
        }
      })}
    </div>
  )
}
