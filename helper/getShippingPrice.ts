export const getShippingPrice = (totalPrice: number, prefecture: string) => {
  if (totalPrice >= 30000) {
    return 0
  }
  if (prefecture === 'Hokkaido') {
    return 1300
  }
  if (prefecture === 'Okinawa') {
    return 1800
  }
  return 700
}
