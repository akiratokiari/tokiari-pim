import { CartItemType } from '@/contexts/cart/context'
import style from './style.module.css'
import { FC } from 'react'
import { CartProductAmountInput } from '../cartProductAmountInput'
import Image from 'next/image'
import Link from 'next/link'
import { WHOLESALE_PRODUCTS_DETAIL_ROUTE } from '@/constants/route'
import toHref from '@/helper/toHref'
import { blurDataURL } from '@/constants/blurDataURL'

type Props = {
  data: CartItemType
}

export const CartItem: FC<Props> = ({ data }) => {
  return (
    <div className={style.itemWrapper}>
      <div className={style.imageWrapper}>
        {data.thumbnail ? (
          <Image
            src={data.thumbnail}
            fill
            alt=""
            blurDataURL={blurDataURL}
            placeholder="blur"
            priority
          />
        ) : (
          <Image
            src={blurDataURL}
            fill
            alt=""
            blurDataURL={blurDataURL}
            placeholder="blur"
            priority
          />
        )}
      </div>
      <div className={style.item}>
        <div className={style.descriptionWrapper}>
          <Link href={toHref(WHOLESALE_PRODUCTS_DETAIL_ROUTE, { id: data.productId })}>
            <div className={style.title}>{data.title}</div>
          </Link>
          <div className={style.caption}>
            {data.color} / {data.size}
          </div>
          <div className={style.caption}>¥{data.price.toLocaleString()}円</div>
        </div>
        <div className={style.inputWrapper}>
          <CartProductAmountInput data={data} />
        </div>
        <div className={style.subTotalCaption}>
          ¥{(data.price * data.quantity).toLocaleString()}円
        </div>
      </div>
    </div>
  )
}
