export type Model = {
  no: number // No
  titleFullWidth: string // 商品名（全角）
  titleAuto: string // 商品名（詳細）<自動>
  title: string // 商品名（半角）
  furigana: string // 商品名（フリガナ）
  category: string // 自社商品カテゴリ
  productCode: number // 取扱品目コード
  JICFSCode: number // JICFS分類コード
  GPCCode: number // GPCコード
  productGroupCode: string // 商品グループコード
  seriesNumber: string // 品番（自社シリーズ）
  modelNumber: string // 型番（自社SKU)
  size: string // サイズ
  GTINCode: number // GTIN（JANコード）
  salesStartedAt: string // 発売日
  sellingPrice: string // 販売価格
  costPrice: string // 原価
  material: string // 素材
}

export type Product = {
  id: string
  series: string
  model: Model[]
}
