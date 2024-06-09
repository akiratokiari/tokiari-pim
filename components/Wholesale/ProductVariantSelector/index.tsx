'use client'
import {
  ProductImagesRowType,
  ProductVariantsRowType,
  ProductVariantsSizeRowType
} from '@/utils/supabase/type'
import { FC, useEffect, useState } from 'react'

type Props = {
  variants: VariantType[]
}

export type VariantType = ProductVariantsRowType & {
  product_images: ProductImagesRowType[]
  product_variants_size: ProductVariantsSizeRowType[]
}

type QuantityData = {
  id: string
  color: string
  seriesNumber: string
  variants: {
    id: string
    size: string
    quantity: number
    modelNumber: string
  }[]
}

export const ProductVariantSelector: FC<Props> = ({ variants }) => {
  const [quantities, setQuantities] = useState<QuantityData[]>([])

  useEffect(() => {
    if (variants) {
      const data = variants.map((v) => {
        return {
          id: v.id,
          color: v.color,
          seriesNumber: v.series_number,
          variants:
            v.product_variants_size.map((pvs) => {
              return {
                id: pvs.id,
                size: pvs.product_size,
                quantity: 0,
                modelNumber: pvs.model_number
              }
            }) || []
        }
      })
      setQuantities(data)
    }
  }, [variants])

  const handleQuantityChange = (variantId: string, variantSizeId: string, amount: number) => {
    setQuantities((prevQuantities) =>
      prevQuantities.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              variants: variant.variants.map((size) =>
                size.id === variantSizeId
                  ? { ...size, quantity: Math.max(0, size.quantity + amount) }
                  : size
              )
            }
          : variant
      )
    )
  }

  const handleQuantityInput = (variantId: string, variantSizeId: string, value: string) => {
    const quantity = Math.max(0, parseInt(value, 10) || 0)
    setQuantities((prevQuantities) =>
      prevQuantities.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              variants: variant.variants.map((size) =>
                size.id === variantSizeId ? { ...size, quantity } : size
              )
            }
          : variant
      )
    )
  }

  const handleAddToCart = () => {
    const selectedItems = variants.map((variant, index) => ({
      color: variant.color,
      amount: quantities[index]
    }))
    console.log(selectedItems)
  }

  return (
    <div>
      <div>
        {variants.map((pv, index) => {
          return (
            <div key={pv.id}>
              色 {pv.color}
              <div>
                {pv.product_variants_size.map((pvs) => {
                  const quantityData = quantities.find((q) => q.id === pv.id)
                  if (quantityData) {
                    return (
                      <div key={pvs.id}>
                        {pvs.product_size} | {pvs.model_number}
                        <button onClick={() => handleQuantityChange(pv.id, pvs.id, -1)}>-</button>
                        <input
                          type="number"
                          value={quantityData.variants.find((v) => v.id === pvs.id)?.quantity || 0}
                          onChange={(e) => handleQuantityInput(pv.id, pvs.id, e.target.value)}
                        />
                        <button onClick={() => handleQuantityChange(pv.id, pvs.id, 1)}>+</button>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )
        })}
      </div>
      <div>
        <button onClick={handleAddToCart}>カートに追加する</button>
      </div>
    </div>
  )
}
