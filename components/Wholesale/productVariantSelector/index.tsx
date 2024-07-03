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
      {variants.map((pv) => {
        if (currentColor === pv.color) {
          return (
            <div key={pv.id} className={style.body}>
              {pv.product_variants_size.map((pvs) => {
                const cartFormatDataWithoutQuantity = {
                  product_id: product.id,
                  product_variant_size_id: pvs.id,
                  product_variant_id: pv.id,
                  quantity: 1,
                  size: pvs.product_size
                }
                return (
                  <div>
                    <VariantSizeSelector key={pvs.id} data={cartFormatDataWithoutQuantity} />
                  </div>
                )
              })}
            </div>
          )
        }
      })}
    </div>
  )
}
