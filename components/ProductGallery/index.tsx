'use client'
import { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import Image from 'next/image'
import style from './style.module.css'

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
    <Swiper spaceBetween={0} slidesPerView={1} loop>
      {data.map((i, index) => {
        return (
          <SwiperSlide key={index} className={style.swiperSlide}>
            <Image src={i.image_url} fill alt="" />
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}
