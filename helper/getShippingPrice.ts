export const getShippingPrice = (totalPrice: number, prefecture: string) => {
  if (totalPrice >= 30000) {
    return 0
  }
  if (prefecture === '北海道') {
    return 1300
  }
  if (prefecture === '沖縄県') {
    return 1800
  }
  return 700
}
