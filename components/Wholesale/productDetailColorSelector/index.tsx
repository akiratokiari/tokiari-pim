'use client'
import { ColorArray } from '@/constants/color'
import { WHOLESALE_PRODUCTS_DETAIL_ROUTE } from '@/constants/route'
import toHref from '@/helper/toHref'
import { toQuery } from '@/helper/toQuery'
import { ProductVariantWithRelation } from '@/utils/supabase/type'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import style from './style.module.css'

type Props = {
  productId: string
  currentColor: string
  variants: ProductVariantWithRelation[]
}

export const ProductDetailColorSelector: FC<Props> = ({ productId, variants, currentColor }) => {
  const router = useRouter()
  return (
    <div className={style.body}>
      {variants.map((v) => {
        const colorData = ColorArray.find((c) => c.value === v.color)
        return (
          <div
            className={style.buttonWrapper}
            onClick={() => {
              router.replace(
                toHref(WHOLESALE_PRODUCTS_DETAIL_ROUTE, { id: productId }) +
                  toQuery({ color: v.color })
              )
            }}
            key={v.id}
          >
            <button
              key={v.id}
              className={`${style.button} ${currentColor === colorData?.value && style.active}`}
              style={{ backgroundColor: `${colorData?.hex}` }}
            />
            <div className={style.label}>{v.color}</div>
          </div>
        )
      })}
    </div>
  )
}
