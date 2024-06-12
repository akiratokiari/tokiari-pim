'use client'
import { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import Image from 'next/image'

type Props = { data: images[] }

type images = {
  created_at: string
  deleted_at: string | null
  id: string
  image_url: string
  product_variant_id: string
  updated_at: string
}

export const ProductGallery: FC<Props> = ({ data }) => {
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      loop
      style={{ width: '100px', height: '150px', aspectRatio: '3/2' }}
    >
      {data.map((i, index) => {
        return (
          <SwiperSlide key={index}>
            <Image src={i.image_url} width={100} height={150} alt="" />
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}
