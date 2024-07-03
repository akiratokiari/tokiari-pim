import { ProductGrid } from '@/components/Wholesale/productGrid'
import { createClient } from '@/utils/supabase/server'
import style from './style.module.css'
import { PRODUCT_PUBLISH_STATUS } from '@/constants/app'

type Props = {
  params: {
    category: string
  }
}

export default async function Page({ params }: Props) {
  const supabase = createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('*,product_variants(*,product_images(*), product_variants_size(*))')
    .eq('category', `${params.category}`)
    .eq('publish_status', PRODUCT_PUBLISH_STATUS.Public)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return (
      <div className={style.body}>
        <div className={style.emptyText}>商品の取得中にエラーが発生しました。</div>
      </div>
    )
  }

  const filteredProducts =
    products
      ?.map((product) => {
        const variants = product.product_variants
          .filter((pv) => pv.publish_status === PRODUCT_PUBLISH_STATUS.Public)
          .filter((pv) => pv.product_variants_size.length > 0)
        return { ...product, product_variants: variants }
      })
      .filter((product) => product.product_variants.length > 0) || []

  const isProductVariantsExist = filteredProducts.length > 0

  return (
    <div className={style.body}>
      {isProductVariantsExist && filteredProducts.length !== 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className={style.emptyText}>該当する商品がありません</div>
      )}
    </div>
  )
}
