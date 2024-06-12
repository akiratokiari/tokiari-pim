import { ORDER_PAYMENT_STATUS } from '@/constants/app'
import { Tag } from 'antd'

export const DisplayPaymentStatus = (payment_status: number) => {
  if (payment_status === ORDER_PAYMENT_STATUS.Hold) {
    return <Tag>決済前</Tag>
  }
  if (payment_status === ORDER_PAYMENT_STATUS.Buy) {
    return <Tag color="success">決済完了</Tag>
  }
  if (payment_status === ORDER_PAYMENT_STATUS.Cancel) {
    return <Tag>キャンセル</Tag>
  }
  if (payment_status === ORDER_PAYMENT_STATUS.Refund) {
    return <Tag color="purple">払い戻し</Tag>
  }
  if (payment_status === ORDER_PAYMENT_STATUS.Expired) {
    return <Tag>決済期限切れ</Tag>
  }
  if (payment_status === ORDER_PAYMENT_STATUS.PaymentError) {
    return <Tag>決済失敗（Stripe）</Tag>
  }
}
