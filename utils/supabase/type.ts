import type { Database } from './generatedTypes'

export type OrdersRowType = Database['public']['Tables']['orders']['Row']
export type OrdersInsertType = Database['public']['Tables']['orders']['Insert']
export type OrdersUpdateType = Database['public']['Tables']['orders']['Update']

export type ProductImagesRowType = Database['public']['Tables']['product_images']['Row']
export type ProductImagesInsertType = Database['public']['Tables']['product_images']['Insert']
export type ProductImagesUpdateType = Database['public']['Tables']['product_images']['Update']

export type ProductVariantsRowType = Database['public']['Tables']['product_variants']['Row']
export type ProductVariantsInsertType = Database['public']['Tables']['product_variants']['Insert']
export type ProductVariantsUpdateType = Database['public']['Tables']['product_variants']['Update']

export type ProductVariantsSizeRowType =
  Database['public']['Tables']['product_variants_size']['Row']
export type ProductVariantsSizeInsertType =
  Database['public']['Tables']['product_variants_size']['Insert']
export type ProductVariantsSizeUpdateType =
  Database['public']['Tables']['product_variants_size']['Update']

export type ProductsRowType = Database['public']['Tables']['products']['Row']
export type ProductsInsertType = Database['public']['Tables']['products']['Insert']
export type ProductsUpdateType = Database['public']['Tables']['products']['Update']

export type PurchasedProductsRowType = Database['public']['Tables']['purchased_products']['Row']
export type PurchasedProductsInsertType =
  Database['public']['Tables']['purchased_products']['Insert']
export type PurchasedProductsUpdateType =
  Database['public']['Tables']['purchased_products']['Update']

export type UsersRowType = Database['public']['Tables']['users']['Row']
export type UsersInsertType = Database['public']['Tables']['users']['Insert']
export type UsersUpdateType = Database['public']['Tables']['users']['Update']

