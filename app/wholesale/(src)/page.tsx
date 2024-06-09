import { ProductCard } from '@/components/Wholesale/productCard'
import { PRODUCT_PUBLISH_STATUS } from '@/constants/app'
import { WHOLESALE_PRODUCTS_DETAIL_ROUTE } from '@/constants/route'
import toHref from '@/helper/toHref'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Page() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*,product_variants(*,product_images(*), product_variants_size(*))')
    // .eq('publish_status', PRODUCT_PUBLISH_STATUS.Public)

  return (
    <div>
      {products
        ? products.map((p) => {
            return (
              <Link href={toHref(WHOLESALE_PRODUCTS_DETAIL_ROUTE, { id: p.id })}>
                <ProductCard product={p} />
              </Link>
            )
          })
        : '商品はありません'}
    </div>
  )
}
