import { ProductGrid } from '@/components/Wholesale/productGrid'
import { createClient } from '@/utils/supabase/server'
import style from './style.module.css'
import { PRODUCT_PUBLISH_STATUS } from '@/constants/app'
import { CategoryFilter } from '@/components/Wholesale/categoryFilter'

export default async function Page() {
  const currentDateTime = new Date().toISOString()
  const supabase = createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('*,product_variants(*,product_images(*), product_variants_size(*))')
    .eq('publish_status', PRODUCT_PUBLISH_STATUS.Public)
    .lt('sales_started_at', currentDateTime)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
  }

  const filteredProducts =
    (products &&
      products.map((product) => {
        const variants = product.product_variants.filter(
          (pv) => pv.publish_status === PRODUCT_PUBLISH_STATUS.Public
        )
        return { ...product, product_variants: variants }
      })) ||
    []

  return (
    <div className={style.body}>
      <CategoryFilter />
      <div className={style.contents}>
        <div className={style.content}>
          {filteredProducts && filteredProducts.length !== 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            '商品がありません'
          )}
        </div>
      </div>
    </div>
  )
}
