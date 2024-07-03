'use client'
import { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import Image from 'next/image'
import style from './style.module.css'
import { blurDataURL } from '@/constants/blurDataURL'

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
    <div className={style.galleryContainer}>
      <div className={style.desktop}>
        {data.map((i, index) => {
          return (
            <div className={style.imageWrapper}>
              <Image
                key={index}
                src={i.image_url}
                fill
                alt=""
                blurDataURL={blurDataURL}
                placeholder="blur"
                priority
              />
            </div>
          )
        })}
      </div>
      <div className={style.mobile}>
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop
          pagination={{ clickable: true, el: '.swiper-pagination-custom' }}
          modules={[Pagination]}
        >
          {data.map((i, index) => {
            return (
              <SwiperSlide key={index} className={style.swiperSlide}>
                <Image
                  src={i.image_url}
                  fill
                  alt=""
                  blurDataURL={blurDataURL}
                  placeholder="blur"
                  priority
                />
              </SwiperSlide>
            )
          })}
        </Swiper>
        <div className="swiper-pagination-custom" />
      </div>
    </div>
  )
}
