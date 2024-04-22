import { getProducts } from '@/csv/getProducts'
import style from './style.module.css'
import { ProductGrid } from '@/components/productGrid'
import { FilterForm } from '@/components/filterForm'

type Props = {
  searchParams: {
    keyword?: string
    size?: string
    color?: string
    category?: string
  }
}

export default async function Page({ searchParams }: Props) {
  const products = await getProducts({ ...searchParams })

  return (
    <div className={style.body}>
      <div className={style.searchSection}>
        <div className={style.search}>
          <FilterForm searchParams={searchParams} />
        </div>
      </div>
      <div className={style.productSection}>
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
