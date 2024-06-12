'use client'
import Image from 'next/image'
import { FC } from 'react'

type Props = {
  product: any
}

export const ProductCard: FC<Props> = ({ product }) => {
  return (
    <div style={{ marginBottom: 16, padding: 32, border: 'solid 1px black' }}>
      <div>{product.title}</div>
      <br />
      <div>{product.category}</div>
      {product.product_variants.map((pv: any) => {
        const imagesData =
          pv.product_images.length !== 0
            ? { src: pv.product_images[0].image_url, alt: pv.product_images[0].image_url }
            : null

        return (
          <>
            {imagesData && (
              <Image src={imagesData.src} width={100} height={100} alt={imagesData.alt} />
            )}
            <div>色 : {pv.color}</div>
          </>
        )
      })}
      <br />
    </div>
  )
}
