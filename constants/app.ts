export const APP_URL = ''

export const PLAN_ZERO_SHIRT = 1
export const PLAN_COLLABORATION_SHIRT = 2

export const USER_PLAN = {
  BASIC: 1,
  Collaboration: 2
}

export const USER_ROLE = {
  Buyer: 1, // バイヤー
  Denied: 2, // リクエスト拒否
  Admin: 3 // 管理人
}

export const ORDER_STATUS_BEFORE_PAYMENT = 1

export const ORDER_STATUS_COMPLETED = 2

export const ORDER_STATUS_CANCEL = 3

export const ORDER_STATUS_REFUND = 4

export const ORDER_PAYMENT_STATUS = {
  Hold: 1, // 決済前
  Buy: 2, // 購入成功
  Cancel: 3, // キャンセル
  Refund: 4, // 払い戻し
  Expired: 9, // 決済期限切れ
  PaymentError: 99 // 決済失敗（Stripe）
}

export const PRODUCT_PUBLISH_STATUS = {
  Public: 1, // 公開中
  Private: 2 // 非公開
}

export const ORDER_DELIVERY_OPTION = {
  Exist: 1, // あり
  Whenever: 2 // なし
}
