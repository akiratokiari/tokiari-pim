import { createClient } from '@/utils/supabase/server'
import style from './style.module.css'
import { PageHeader } from '@/components/Wholesale/pageHeader'
import { ORDER_PAYMENT_STATUS } from '@/constants/app'
import { OrderItem } from '@/components/Wholesale/orderItem'
import {
  OrdersRowType,
  ProductImagesRowType,
  ProductsRowType,
  ProductVariantsRowType,
  ProductVariantsSizeRowType,
  PurchasedProductsRowType
} from '@/utils/supabase/type'

export type OrderWithPurchasedProductType = {
  purchasedProducts?: PurchasedProductType[]
  order: OrdersRowType
}

type PurchasedProductType = PurchasedProductsRowType & {
  products?: ProductsRowType
  product_variants?: ProductVariantsRowType & {
    product_images?: ProductImagesRowType[]
  }
  product_variants_size?: ProductVariantsSizeRowType
}

export default async function Page() {
  const supabase = createClient()

  try {
    const { data, error: userError } = await supabase.auth.getUser()
    if (userError) throw new Error('ユーザーの取得に失敗しました')

    const userId = data.user.id
    if (!userId) throw new Error('ユーザーIDが見つかりません')

    const { data: orderData, error: dataError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
    if (dataError || !orderData) throw new Error('データの取得に失敗しました')

    const orderWithProductData = await Promise.all(
      orderData.map(async (order) => {
        const { data: purchasedProducts, error: productError } = await supabase
          .from('purchased_products')
          .update({ payment_status: ORDER_PAYMENT_STATUS.Buy })
          .eq('order_id', order.id)
          .select('*,product_variants(*, product_images(*)),products(*),product_variants_size(*)')

        if (productError) throw new Error('商品の更新に失敗しました')

        return {
          purchasedProducts: purchasedProducts,
          order: order
        } as OrderWithPurchasedProductType
      })
    )

    return (
      <div>
        <div className={style.menuWrapper}>
          <PageHeader>購入履歴</PageHeader>
        </div>
        <div className={style.orderWrapper}>
          {orderWithProductData.length > 0 ? (
            <>
              {orderWithProductData.map((order, index) => {
                return <OrderItem key={index} order={order} />
              })}
            </>
          ) : (
            <div className={style.empty}> 購入履歴はありません</div>
          )}
        </div>
      </div>
    )
  } catch (error: any) {
    return <div>{error.message}</div>
  }
}
