import { ProductVariantSizeEditForm } from '@/components/Admin/ProductVariantSizeEditForm'

type Props = {
  params: {
    id: string
    variantId: string
  }
}

export default function Page({ params }: Props) {
  return <ProductVariantSizeEditForm variantId={params.variantId} productId={params.id} />
}
