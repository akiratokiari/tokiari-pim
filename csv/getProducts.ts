
import fs from 'fs'
import Papa from 'papaparse'

type searchParams = {
  keyword?: string
  size?: string
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
  color,
  category
}: searchParams): Promise<any[] | []> {
  const csv = fs.readFileSync('./public/product.csv', 'utf8')
  const headerReplacedCsv = csv.replace(japaneseCsvHeader, englishCsvHeader)
  const parsedCsv = Papa.parse(headerReplacedCsv, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  })
  const productData = parsedCsv.data as any[] | []

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
  const formattedProducts = formattedProductSeries.map((fps) => {
    return {
      id: fps,
      series: fps,
      model: productData.filter((pd) => pd.seriesNumber === fps)
    }
  })

  let filteredProducts = formattedProducts

  if (keyword) {
    filteredProducts = filteredProducts.filter((p) => p.model[0].titleAuto.includes(keyword))
  }
  if (size) {
    filteredProducts = filteredProducts.filter((p) => {
      const isColor = p.model.find((m) => {
        if (String(m.size) === size) {
          return m
        }
      })
      return isColor ? true : false
    })
  }
  if (color) {
    filteredProducts = filteredProducts.filter((p) => p.model[0].title.includes(color))
  }
  if (category) {
    filteredProducts = filteredProducts.filter((p) => p.model[0].category === category)
  }

  return filteredProducts
}
