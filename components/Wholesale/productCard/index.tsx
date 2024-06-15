'use client'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import style from './style.module.css'
import { ProductVariantWithRelation, ProductWithRelationType } from '@/utils/supabase/type'
import { ProductColorSelector } from '../productColorSelector'
import Link from 'next/link'
import toHref from '@/helper/toHref'
import { WHOLESALE_PRODUCTS_DETAIL_ROUTE } from '@/constants/route'

type Props = {
  product: ProductWithRelationType
}

export const ProductCard: FC<Props> = ({ product }) => {
  const [currentProduct, setCurrentProduct] = useState<ProductVariantWithRelation>()
  const [currentColor, setCurrentColor] = useState<string>()

  useEffect(() => {
    setCurrentProduct(product.product_variants[0])
    setCurrentColor(product.product_variants[0].color)
  }, [product])

  useEffect(() => {
    const _currentProductVariant = product.product_variants.find((pv) => pv.color === currentColor)
    setCurrentProduct(_currentProductVariant)
  }, [currentColor])

  const minPrice = Math.min(...product.product_variants.map((product) => product.price))
  const maxPrice = Math.max(...product.product_variants.map((product) => product.price))

  return (
    <div className={style.body}>
      <Link href={toHref(WHOLESALE_PRODUCTS_DETAIL_ROUTE, { id: product.id })}>
        <div className={style.imageWrapper}>
          <Image
            src={currentProduct?.product_images[0].image_url || ''}
            fill
            alt={currentProduct?.product_images[0].image_url || ''}
          />
        </div>
      </Link>
      <div className={style.details}>
        <div className={style.title}>{product.title}</div>
        <div className={style.price}>
          {maxPrice === minPrice
            ? `¥${maxPrice.toLocaleString()}`
            : `¥${minPrice.toLocaleString()} 〜 ¥${maxPrice.toLocaleString()}`}
        </div>
        <div className={style.colorSelector}>
          <ProductColorSelector
            currentColor={currentColor || product.product_variants[0].color}
            setCurrentColor={setCurrentColor}
            variants={product.product_variants}
          />
        </div>
      </div>
    </div>
  )
}
