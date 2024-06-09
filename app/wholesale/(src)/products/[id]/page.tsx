import { ProductGallery } from '@/components/ProductGallery'
import { ProductVariantSelector } from '@/components/Wholesale/ProductVariantSelector'
import { createClient } from '@/utils/supabase/server'

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*,product_variants(*,product_images(*), product_variants_size(*))')
    .eq('id', params.id)
    .single()

  if (!products || (products && !products.id)) return

  const variants = products.product_variants

  return (
    <div>
      <div>{products?.title}</div>
      <div>{products?.category}</div>
      <div>
        {products?.product_variants.map((pv) => {
          return <ProductGallery data={pv.product_images} />
        })}
      </div>
      {variants && <ProductVariantSelector variants={variants} />}
    </div>
  )
}
