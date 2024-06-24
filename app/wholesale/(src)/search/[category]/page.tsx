import { ProductGrid } from '@/components/Wholesale/productGrid'
import { createClient } from '@/utils/supabase/server'
import style from './style.module.css'

type Props = {
  params: {
    category: string
  }
}

export default async function Page({ params }: Props) {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*,product_variants(*,product_images(*), product_variants_size(*))')
    .eq('category', `${params.category}`)

  return (
    <div className={style.body}>
      {products && products.length !== 0 ? <ProductGrid products={products} /> : '商品がありません'}
    </div>
  )
}
