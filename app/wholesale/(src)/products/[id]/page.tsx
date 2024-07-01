import { ProductGallery } from '@/components/ProductGallery'
import { ProductVariantSelector } from '@/components/Wholesale/productVariantSelector'
import { createClient } from '@/utils/supabase/server'
import style from './style.module.css'
import { ProductDetailColorSelector } from '@/components/Wholesale/productDetailColorSelector'
import { PRODUCT_PUBLISH_STATUS } from '@/constants/app'
import Image from 'next/image'
import { blurDataURL } from '@/constants/blurDataURL'

type Props = {
  params: {
    id: string
  }
  searchParams: {
    color: string
  }
}

export default async function Page({ params, searchParams }: Props) {
  const supabase = createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .eq('publish_status', PRODUCT_PUBLISH_STATUS.Public)
    .order('created_at', { ascending: false })
    .single()

  if (!products || error) return

  const { data: productVariants, error: productVariantError } = await supabase
    .from('product_variants')
    .select('*,product_images(*), product_variants_size(*)')
    .eq('product_id', products?.id)
    .eq('publish_status', PRODUCT_PUBLISH_STATUS.Public)
    .order('created_at', { ascending: false })

  if (productVariantError) return

  const currentVariants = productVariants.find((pv) => {
    if (!searchParams.color) return pv
    if (pv.color === searchParams.color) {
      return pv
    }
  })

  return (
    <div className={style.body}>
      <div className={style.content}>
        <div className={style.left}>
          <div className={style.leftBody}>
            {currentVariants && currentVariants?.product_images.length > 0 ? (
              <ProductGallery data={currentVariants.product_images} />
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
        </div>
        <div className={style.right}>
          <div className={style.detail}>
            
            <div className={style.category}>{products?.category}</div>
            <div className={style.title}>{products?.title}</div>
            {/* <div className={style.seriesNumber}>
              Series Number：{currentVariants?.series_number}
            </div> */}
            <div className={style.price}>¥{currentVariants?.price.toLocaleString()}</div>
            <div className={style.colorSelector}>
              <ProductDetailColorSelector
                variants={productVariants}
                productId={params.id}
                currentColor={currentVariants?.color || productVariants[0].color}
              />
            </div>
            <div>
              {currentVariants && (
                <ProductVariantSelector
                  product={{
                    title: products.title,
                    id: products.id,
                    product_group_code: products.product_group_code
                  }}
                  currentColor={currentVariants?.color || productVariants[0].color}
                  variants={productVariants}
                />
              )}
            </div>
          </div>
          <div className={style.description}>{products.description}</div>
          <div className={style.attention}>
            ＊ ここに送料に関しても注意書きが入ります
          </div>
        </div>
      </div>
    </div>
  )
}
