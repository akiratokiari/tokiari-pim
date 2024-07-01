import { PRODUCT_PUBLISH_STATUS } from '@/constants/app'
import { Tag } from 'antd'

export const DisplayPublishStatus = ({ publish_status }: { publish_status: number }) => {
  if (publish_status === PRODUCT_PUBLISH_STATUS.Public) {
    return <Tag color="success">公開中</Tag>
  }
  if (publish_status === PRODUCT_PUBLISH_STATUS.Private) {
    return <Tag color="purple">非公開</Tag>
  }
}
