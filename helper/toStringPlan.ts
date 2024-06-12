import { PLAN_COLLABORATION_SHIRT, PLAN_ZERO_SHIRT } from '@/constants/app'

export const toStringPlan = (plan?: number) => {
  if (plan === PLAN_ZERO_SHIRT) {
    return 'A-1'
  }
  if (plan === PLAN_COLLABORATION_SHIRT) {
    return 'A-2'
  }
  return '未選択'
}
