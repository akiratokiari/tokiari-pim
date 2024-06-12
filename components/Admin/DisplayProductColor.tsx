import { ColorArray } from '@/constants/color'
import { Tag } from 'antd'

export const DisplayProductColor = (color: string) => {
  const colorData = ColorArray.find((ca) => ca.value === color)
  console.log(colorData)
  return <Tag>{colorData?.value}</Tag>
}
