'use client'
import {
  ProductImagesRowType,
  ProductVariantsRowType,
  ProductVariantsSizeRowType
} from '@/utils/supabase/type'
import { FC } from 'react'
import { VariantSizeSelector } from '../variantSizeSelector'

type Props = {
  product: ProductType
  variants: VariantType[]
}

export type ProductType = {
  id: string
  product_group_code: string
}

export type VariantType = ProductVariantsRowType & {
  product_images: ProductImagesRowType[]
  product_variants_size: ProductVariantsSizeRowType[]
}

export const ProductVariantSelector: FC<Props> = ({ product, variants }) => {
  return (
    <div>
      <div>
        {variants.map((pv) => (
          <div key={pv.id}>
            色 {pv.color}
            <div>
              {pv.product_variants_size.map((pvs) => {
                const variantData = {
                  id: pv.id,
                  color: pv.color,
                  seriesNumber: pv.series_number
                }
                const variantSizeData = {
                  id: pvs.id,
                  size: pvs.product_size,
                  modelNumber: pvs.model_number
                }

                return (
                  <VariantSizeSelector
                    key={pvs.id}
                    productData={product}
                    variantData={variantData}
                    variantSizeData={variantSizeData}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 'use client'
// import { CartContext, CartItemType } from '@/contexts/cart/context'
// import {
//   ProductImagesRowType,
//   ProductVariantsRowType,
//   ProductVariantsSizeRowType
// } from '@/utils/supabase/type'
// import { FC, useContext, useEffect, useState } from 'react'

// type Props = {
//   variants: VariantType[]
// }

// export type VariantType = ProductVariantsRowType & {
//   product_images: ProductImagesRowType[]
//   product_variants_size: ProductVariantsSizeRowType[]
// }

// type QuantityData = {
//   id: string
//   color: string
//   seriesNumber: string
//   variants: {
//     id: string
//     size: string
//     quantity: number
//     modelNumber: string
//   }[]
// }

// export const ProductVariantSelector: FC<Props> = ({ variants }) => {
//   const [quantities, setQuantities] = useState<QuantityData[]>([])
//   const [inputMode, setInputMode] = useState<{ [key: string]: boolean }>({})
//   const { cart, addToCart } = useContext(CartContext)

//   console.log(cart)

//   useEffect(() => {
//     if (variants) {
//       const data = variants.map((v) => ({
//         id: v.id,
//         color: v.color,
//         seriesNumber: v.series_number,
//         variants:
//           v.product_variants_size.map((pvs) => ({
//             id: pvs.id,
//             size: pvs.product_size,
//             quantity: 0,
//             modelNumber: pvs.model_number
//           })) || []
//       }))
//       setQuantities(data)
//     }
//   }, [variants])

//   const handleQuantityChange = (variantId: string, variantSizeId: string, amount: number) => {
//     setQuantities((prevQuantities) =>
//       prevQuantities.map((variant) =>
//         variant.id === variantId
//           ? {
//               ...variant,
//               variants: variant.variants.map((size) =>
//                 size.id === variantSizeId
//                   ? { ...size, quantity: Math.max(0, size.quantity + amount) }
//                   : size
//               )
//             }
//           : variant
//       )
//     )
//   }

//   const handleQuantityInput = (variantId: string, variantSizeId: string, value: string) => {
//     const quantity = Math.max(0, parseInt(value, 10) || 0)
//     setQuantities((prevQuantities) =>
//       prevQuantities.map((variant) =>
//         variant.id === variantId
//           ? {
//               ...variant,
//               variants: variant.variants.map((size) =>
//                 size.id === variantSizeId ? { ...size, quantity } : size
//               )
//             }
//           : variant
//       )
//     )
//   }

//   const handleSelectChange = (variantId: string, variantSizeId: string, value: string) => {
//     if (parseInt(value, 10) === 10) {
//       setInputMode((prev) => ({ ...prev, [`${variantId}-${variantSizeId}`]: true }))
//     } else {
//       handleQuantityInput(variantId, variantSizeId, value)
//     }
//   }

//   const handleAddToCart = (quantityItem: QuantityData) => {
//     const item: CartItemType = {
//       id: quantityItem.id,
//       color: quantityItem.color,
//       seriesNumber: quantityItem.seriesNumber,
//       variants: quantityItem.variants.filter((variant) => variant.quantity > 0)
//     }
//     addToCart(item)
//     console.log(quantityItem)
//   }

//   return (
//     <div>
//       <div>
//         {variants.map((pv) => (
//           <div key={pv.id}>
//             色 {pv.color}
//             <div>
//               {pv.product_variants_size.map((pvs) => {
//                 const quantityData = quantities.find((q) => q.id === pv.id)
//                 const isInputMode = inputMode[`${pv.id}-${pvs.id}`]
//                 if (quantityData) {
//                   return (
//                     <div key={pvs.id}>
//                       {pvs.product_size} | {pvs.model_number}
//                       <button onClick={() => handleQuantityChange(pv.id, pvs.id, -1)}>-</button>
//                       {isInputMode ? (
//                         <input
//                           type="number"
//                           value={quantityData.variants.find((v) => v.id === pvs.id)?.quantity || 10}
//                           onChange={(e) => handleQuantityInput(pv.id, pvs.id, e.target.value)}
//                         />
//                       ) : (
//                         <select
//                           value={quantityData.variants.find((v) => v.id === pvs.id)?.quantity || 0}
//                           onChange={(e) => handleSelectChange(pv.id, pvs.id, e.target.value)}
//                         >
//                           {[...Array(10)].map((_, index) => (
//                             <option key={index + 1} value={index + 1}>
//                               {index + 1}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                       <button onClick={() => handleQuantityChange(pv.id, pvs.id, 1)}>+</button>
//                       <button onClick={() => handleAddToCart(quantityData)}>
//                         カートに追加する
//                       </button>
//                     </div>
//                   )
//                 }
//                 return null
//               })}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
