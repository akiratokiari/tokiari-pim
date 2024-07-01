export const getShippingDefaultDay = () => {
  const today = new Date()
  const fourDaysLater = new Date(today.setDate(today.getDate() + 4))
  const year = fourDaysLater.getFullYear()
  const month = String(fourDaysLater.getMonth() + 1).padStart(2, '0')
  const day = String(fourDaysLater.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
