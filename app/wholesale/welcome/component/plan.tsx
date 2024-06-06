'use client'
import { PLAN_COLLABORATION_SHIRT, PLAN_ZERO_SHIRT } from '@/constants/app'
import { useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { AccountContext } from '@/contexts/account/context'
import { useRouter } from 'next/navigation'
import { WHOLESALE_ROUTE } from '@/constants/route'
import { toStringPlan } from '@/helper/toStringPlan'

export const Plan = () => {
  const { account, refresh } = useContext(AccountContext)
  const router = useRouter()
  const [plan, setPlan] = useState<number | undefined>(undefined)

  const [step, setStep] = useState<number>(0)

  useEffect(() => {
    refresh()

    if (!plan) {
      return setStep(0)
    }

    return setStep(2)
  }, [plan])

  const onSubmit = () => {
    const supabase = createClient()
    if (account) {
      supabase
        .from('users')
        .update({ plan: plan })
        .eq('email', account.email)
        .then((res) => {
          if (res.error) {
            return window.Error('エラーが発生しました')
          }
          refresh()
          router.push(WHOLESALE_ROUTE)
        })
    }
  }

  return (
    <div style={{ marginBottom: 20, padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>
          STEP 1 {plan ? toStringPlan(plan) : 'プランを選択してください'}
        </div>
      </div>
      {/* 入力フォーム */}
      <div>
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setPlan(PLAN_ZERO_SHIRT)}
            style={{ border: 'solid 1px black', padding: 10 }}
          >
            A-1（TKR_ZERO SHIRT）在庫ゼロ可能のシャツライン
            <div style={{ marginTop: 10, color: 'gray' }}>
              ・御社店頭でサンプル展示で受注オーダー可能
              <br />
              ・新作、バージョン更新モデルをすぐオーダー可能　→　HPで詳細ページ用意 ・ミニマム　０
              <br />
              ・１ヶ月後納品 ・追加オーダー可能　→　１ヶ月後納品 ・掛率60
              <br />
              ・支払方法　卸専用オンラインショップにてカード決済
            </div>
          </button>
        </div>
        <button
          onClick={() => setPlan(PLAN_COLLABORATION_SHIRT)}
          style={{ border: 'solid 1px black', padding: 10 }}
        >
          A-2（TKR_COLLABORATION SHIRT）TOKIARI＋御社様コラボシャツ
          <div style={{ marginTop: 10, color: 'gray' }}>
            ・オボイストさん方式 ・ミニマム　上代５０ ・追加オーダー可能　→　１ヶ月後納品
            <br />
            ・カスタムOK　→　弊社担当と打ち合わせ、または卸専用ECにて
            <br />
            ・御社ネームタグ製作（別途料金）
            <br />
            ・新作、バージョン更新モデルをすぐオーダー可能　→　HPで詳細ページ用意
            <br />
            ・支払方法　初回COD、その末締、翌月末支払い
          </div>
        </button>
      </div>
      <button onClick={onSubmit}>登録する</button>
    </div>
  )
}
