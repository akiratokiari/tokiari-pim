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
    color?: string
  }
}

export default async function Page({ params, searchParams }: Props) {
  const supabase = createClient()

  // Fetch the product details
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .eq('publish_status', PRODUCT_PUBLISH_STATUS.Public)
    .single()

  if (!product || productError) {
    console.error('Error fetching product:', productError)
    return <div>商品の取得中にエラーが発生しました。</div>
  }

  // Fetch the product variants
  const { data: productVariants, error: productVariantError } = await supabase
    .from('product_variants')
    .select('*,product_images(*), product_variants_size(*)')
    .eq('product_id', product.id)
    .eq('publish_status', PRODUCT_PUBLISH_STATUS.Public)
    .order('created_at', { ascending: false })

  if (productVariantError) {
    console.error('Error fetching product variants:', productVariantError)
    return <div>商品の取得中にエラーが発生しました。</div>
  }

  // Filter the product variants to ensure they have sizes
  const filteredProductVariants = productVariants.filter(
    (pv) => pv.product_variants_size.length > 0
  )

  // Find the current variant based on searchParams.color
  const currentVariant =
    filteredProductVariants.find((pv) => {
      if (!searchParams.color) return true
      return pv.color === searchParams.color
    }) || filteredProductVariants[0]

  if (!currentVariant) {
    return <div>該当する商品がありません。</div>
  }

  return (
    <div className={style.body}>
      <div className={style.content}>
        <div className={style.left}>
          {currentVariant.product_images.length > 0 ? (
            <ProductGallery data={currentVariant.product_images} />
          ) : (
            <div className={style.imageWrapper}>
              <Image
                src={blurDataURL}
                fill
                alt=""
                blurDataURL={blurDataURL}
                placeholder="blur"
                priority
              />
            </div>
          )}
        </div>
        <div className={style.right}>
          <div style={{ position: 'sticky', top: 77 }}>
            <div className={style.detail}>
              <div className={style.category}>{product.category}</div>
              <div className={style.title}>{product.title}</div>
              <div className={style.priceWrapper}>
                <div className={style.price}>¥{currentVariant.price.toLocaleString()}</div>
                <div className={style.wholesalePrice}>
                  　¥{(currentVariant.price / 2).toLocaleString()}
                </div>
              </div>
              <div className={style.colorSelector}>
                <ProductDetailColorSelector
                  variants={filteredProductVariants}
                  productId={params.id}
                  currentColor={currentVariant.color}
                />
              </div>
              <div>
                <ProductVariantSelector
                  product={{
                    title: product.title,
                    id: product.id,
                    product_group_code: product.product_group_code
                  }}
                  currentColor={currentVariant.color}
                  variants={filteredProductVariants}
                />
              </div>
            </div>
            <div className={style.description}>{product.description}</div>
            <div className={style.attention}>【送料】</div>
            <div className={style.attention}>
              全国一律700円 ※北海道1,300円・沖縄1,800円 3万円以上のお買上で送料無料
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
