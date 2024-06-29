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
      {filteredProducts && filteredProducts.length !== 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        '商品がありません'
      )}
    </div>
  )
}
