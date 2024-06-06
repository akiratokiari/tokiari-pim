import { USER_STATUS_ARROWED, USER_STATUS_DENIED } from '@/constants/app'

export const toStringStatus = (status?: number) => {
  if (status === USER_STATUS_DENIED) {
    return '不認可'
  }
  if (status === USER_STATUS_ARROWED) {
    return '許可'
  }
  return '未設定'
}
