import { getProducts } from '@/csv/getProducts'
import style from './style.module.css'
import { ProductGrid } from '@/components/productGrid'

export default async function Page() {
  const products = await getProducts({})

  return (
    <div className={style.body}>
      <ProductGrid products={products} />
    </div>
  )
}
