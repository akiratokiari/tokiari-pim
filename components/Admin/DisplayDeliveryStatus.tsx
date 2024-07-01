import { Tag } from 'antd'

export const DisplayDeliveryStatus = (is_delivered: boolean) => {
  console.log(is_delivered)
  return is_delivered ? <Tag color="green">配送済み</Tag> : <Tag color="purple">配送待ち</Tag>
}
