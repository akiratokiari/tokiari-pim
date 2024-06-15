import { ProductGallery } from '@/components/ProductGallery'
import { ProductVariantSelector } from '@/components/Wholesale/productVariantSelector-before'
import { createClient } from '@/utils/supabase/server'
import style from './style.module.css'
import { ProductDetailColorSelector } from '@/components/Wholesale/productDetailColorSelector'

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
  const { data: products } = await supabase
    .from('products')
    .select('*,product_variants(*,product_images(*), product_variants_size(*))')
    .eq('id', params.id)
    .single()

  if (!products || (products && !products.id)) return

  const variants = products.product_variants.find((pv) => {
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
            {variants?.product_images && <ProductGallery data={variants.product_images} />}
          </div>
        </div>
        <div className={style.right}>
          <div className={style.detail}>
            <div className={style.category}>{products?.category}</div>
            <div className={style.title}>{products?.title}</div>
            <div className={style.seriesNumber}>Series Number：{variants?.series_number}</div>
            <div className={style.price}>¥{variants?.price.toLocaleString()}</div>
            <div className={style.colorSelector}>
              <ProductDetailColorSelector
                variants={products.product_variants}
                productId={params.id}
                currentColor={variants?.color || products.product_variants[0].color}
              />
            </div>
            <div>
              {variants && (
                <ProductVariantSelector
                  product={{
                    title: products.title,
                    id: products.id,
                    product_group_code: products.product_group_code
                  }}
                  currentColor={variants?.color || products.product_variants[0].color}
                  variants={products.product_variants}
                />
              )}
            </div>
          </div>
          <div className={style.description}>{products.description}</div>
          <div className={style.attention}>
            ＊ 全国一律700円 ※北海道1,300円・沖縄1,800円 3万円以上のお買上で送料無料
          </div>
        </div>
      </div>
    </div>
  )
}
