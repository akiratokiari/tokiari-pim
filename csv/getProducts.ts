import { Model, Product } from '@/type/product'
import fs from 'fs'
import Papa from 'papaparse'

type searchParams = {
  keyword?: string
  size?: string
  title?: string
  color?: string
  category?: string
}

const japaneseCsvHeader =
  'No,商品名（全角）,商品名（詳細）<自動>,商品名（半角）,商品名（フリガナ）,自社商品カテゴリ,取扱品目コード,JICFS分類コード,GPCコード,商品グループコード,品番（自社シリーズ）,型番（自社SKU),サイズ,GTIN（JANコード）,発売日,販売価格,原価,素材'
const englishCsvHeader =
  'no,titleFullWidth,titleAuto,title,furigana,category,productCode,JICFSCode,GPCCode,productGroupCode,seriesNumber,modelNumber,size,GTINCode,salesStartedAt,sellingPrice,costPrice,material'

export async function getProducts({
  keyword,
  size,
  title,
  color,
  category
}: searchParams): Promise<Product[] | []> {
  const csv = fs.readFileSync('./public/product.csv', 'utf8')
  const headerReplacedCsv = csv.replace(japaneseCsvHeader, englishCsvHeader)
  const parsedCsv = Papa.parse(headerReplacedCsv, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  })
  const productData = parsedCsv.data as Model[] | []

  // シリーズだけを取得
  const _productSeries = productData.map((ps) => {
    return ps.seriesNumber
  })
  // 重複したシリーズを削除
  const productSeries = new Set(_productSeries)
  const formattedProductSeries: string[] = []
  productSeries.forEach((value) => {
    formattedProductSeries.push(value)
  })
  // シリーズ(親) - モデル(子)[]の配列を作成、フォーマット
  const formattedProducts: Product[] = formattedProductSeries.map((fps) => {
    return { id: fps, series: fps, model: [] }
  })
  formattedProducts.map((p) => {
    return (p.model = productData.filter((pd) => pd.seriesNumber === p.series))
  })

  return formattedProducts
}
