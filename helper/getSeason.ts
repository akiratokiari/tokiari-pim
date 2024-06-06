export const getSeason = (sales_started_at: Date): string => {
  const salesStartedAt = new Date(sales_started_at)
  const month = salesStartedAt.getMonth() + 1 // getMonth()は0から始まるため、+1して1から12の範囲にする
  const year = salesStartedAt.getFullYear().toString().slice(-2) // 西暦の下二桁を取得

  if (month >= 3 && month <= 8) {
    return `${year}-SS` // Spring/Summer
  } else {
    return `${year}-AW` // Autumn/Winter
  }
}
