import { ProductEditForm } from '@/components/Admin/ProductEditForm'

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  return <ProductEditForm productId={params.id} />
}
