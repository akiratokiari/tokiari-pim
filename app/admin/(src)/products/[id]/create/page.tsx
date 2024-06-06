import { ProductSeriesCreateForm } from '@/components/Admin/ProductSeriesCreateForm'

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  return <ProductSeriesCreateForm productId={params.id} />
}
