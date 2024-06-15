import { ProductGrid } from '@/components/Wholesale/productGrid'
import { ProductsFilter } from '@/components/Wholesale/productsFilter'
import { createClient } from '@/utils/supabase/server'
import style from './style.module.css'

type Props = {
  searchParams: {
    color?: string
    title?: string
    category?: string
    current?: string
  }
}

export type ProductsFilterSearchParamsType = {
  color?: string
  title?: string
  category?: string
  current?: string
}

export default async function Page({ searchParams }: Props) {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*,product_variants(*,product_images(*), product_variants_size(*))')

  return (
    <div className={style.body}>
      <ProductsFilter searchParams={searchParams} />
      {products && products.length !== 0 ? <ProductGrid products={products} /> : '商品がありません'}
    </div>
  )
}
