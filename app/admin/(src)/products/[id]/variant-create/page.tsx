import { ProductVariantCreateForm } from "@/components/Admin/ProductVariantCreateForm"


type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  return <ProductVariantCreateForm productId={params.id} />
}
