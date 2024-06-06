import { PLAN_COLLABORATION_SHIRT, PLAN_ZERO_SHIRT } from '@/constants/app'

export const toStringPlan = (plan?: number) => {
  if (plan === PLAN_ZERO_SHIRT) {
    return 'A-1（TKR_ZERO SHIRT）在庫ゼロ可能のシャツライン'
  }
  if (plan === PLAN_COLLABORATION_SHIRT) {
    return 'A-2（TKR_COLLABORATION SHIRT）TOKIARI＋御社様コラボシャツ'
  }
  return '未選択'
}
