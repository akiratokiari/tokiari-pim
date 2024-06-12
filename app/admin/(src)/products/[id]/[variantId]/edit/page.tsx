import { ProductVariantEditForm } from '@/components/Admin/ProductVariantEditForm'

type Props = {
  params: {
    id: string
    variantId: string
  }
}

export default async function Page({ params }: Props) {
  return <ProductVariantEditForm productId={params.id} variantId={params.variantId} />
}
