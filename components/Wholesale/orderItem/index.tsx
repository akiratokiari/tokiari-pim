import style from './style.module.css'
import { FC } from 'react'
import Image from 'next/image'
import { blurDataURL } from '@/constants/blurDataURL'
import { OrderWithPurchasedProductType } from '@/app/wholesale/(src)/(static)/account/orders/page'
import { formatDateTime } from '@/helper/dateFormat'
import { ORDER_DELIVERY_OPTION } from '@/constants/app'

type Props = {
  order: OrderWithPurchasedProductType
}

export const OrderItem: FC<Props> = ({ order }) => {
  const orderInfo = order.order
  const products = order.purchasedProducts
  return (
    <div className={style.body}>
      <div>
        <div className={style.caption}>注文番号:{orderInfo.id}</div>
        <div className={style.caption}>購入時刻:{formatDateTime(orderInfo.created_at)}</div>
        {orderInfo.option === ORDER_DELIVERY_OPTION.Exist && (
          <div>
            <div className={style.caption}>{orderInfo.delivery_date}</div>
            <div className={style.caption}>{orderInfo.delivery_time}</div>
          </div>
        )}
      </div>
      {products &&
        products.map((product, index) => {
          return (
            <div className={style.itemWrapper} key={index}>
              <div className={style.imageWrapper}>
                {product.product_variants &&
                product.product_variants.product_images &&
                product.product_variants.product_images.length > 0 ? (
                  <Image
                    src={product.product_variants.product_images[0].image_url}
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
                  <div className={style.title}>{product.products?.title}</div>
                  <div className={style.caption}>
                    {product.product_variants?.color} /{' '}
                    {product.product_variants_size?.product_size}
                  </div>
                  <div className={style.caption}>
                    ¥{product.product_variants?.price.toLocaleString()}円
                  </div>
                </div>
                <div className={style.inputWrapper}>
                  <div className={style.caption}>購入点数 : {product.quantity}個</div>
                </div>
                <div className={style.subTotalCaption}>
                  ¥{(product.price * product.quantity).toLocaleString()}円
                </div>
              </div>
            </div>
          )
        })}
      <div>
        <div className={style.caption}>購入点数 {orderInfo.quantity}点</div>
        <div className={style.caption}>小計 ¥{orderInfo.sub_total.toLocaleString()}円</div>
        <div className={style.caption}>送料 ¥{orderInfo.shipping_price?.toLocaleString()}円</div>
        <div className={style.caption}>合計金額 ¥{orderInfo.total_price.toLocaleString()}円</div>
      </div>
    </div>
  )
}
