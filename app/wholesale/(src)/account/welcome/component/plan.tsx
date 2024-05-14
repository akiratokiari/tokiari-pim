'use client'
import { PLAN_COLLABORATION_SHIRT, PLAN_ZERO_SHIRT } from '@/constants/app'
import { useContext, useEffect, useState } from 'react'
import { Form } from './form'
import { UserType } from '../../page'
import { createClient } from '@/utils/supabase/client'
import { AccountContext } from '@/contexts/account/context'
import { useRouter } from 'next/navigation'
import { WHOLESALE_ROUTE } from '@/constants/route'

export const Plan = () => {
  const { account, refresh } = useContext(AccountContext)
  const router = useRouter()
  const [plan, setPlan] = useState<number | undefined>(undefined)
  const [formData, setFormData] = useState<UserType | undefined>(undefined)
  const [_formData, _setFormData] = useState<UserType | undefined>(formData)
  const [step, setStep] = useState<number>(0)

  const toStringPlan = (plan: number) => {
    if (plan === PLAN_ZERO_SHIRT) {
      return 'A-1（TKR_ZERO SHIRT）在庫ゼロ可能のシャツライン'
    }
    if (plan === PLAN_COLLABORATION_SHIRT) {
      return 'A-2（TKR_COLLABORATION SHIRT）TOKIARI＋御社様コラボシャツ'
    }
  }

  useEffect(() => {
    if (formData) {
      _setFormData(formData)
    }
    if (!plan) {
      return setStep(0)
    }
    if (!formData) {
      return setStep(1)
    }
    return setStep(2)
  }, [plan, formData])

  const onSubmit = () => {
    const supabase = createClient()
    if (account) {
      supabase
        .from('users')
        .update(formData)
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
    <div style={{ marginBottom: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>
          STEP 1 {plan ? toStringPlan(plan) : 'プランを選択してください'}
        </div>
        <div style={{ marginBottom: 10 }}> STEP 2 お客様情報を入力してください</div>
        <div> STEP 3 確認・登録</div>
      </div>
      {/* パンくずリスト */}
      <div style={{ marginBottom: 10 }}>
        {step === 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>プランを選択してください</div>
            <div>お客様情報入力</div>
          </div>
        )}
        {step === 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <button onClick={() => setPlan(undefined)}>プランの選択に戻る</button>
            </div>
            <div>確認・登録</div>
          </div>
        )}
        {step === 2 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <button onClick={() => setFormData(undefined)}>フォームの入力に戻る</button>
            </div>
          </div>
        )}
      </div>
      {/* 入力フォーム */}
      {step === 0 && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <button onClick={() => setPlan(PLAN_ZERO_SHIRT)}>
              A-1（TKR_ZERO SHIRT）在庫ゼロ可能のシャツライン
            </button>
            <button disabled>B-1（TKR_COLLECTION）</button>
            <button disabled>B-2 （TKR_FULL COLLECTION）</button>
          </div>
          <button onClick={() => setPlan(PLAN_COLLABORATION_SHIRT)}>
            A-2（TKR_COLLABORATION SHIRT）TOKIARI＋御社様コラボシャツ
          </button>
        </div>
      )}
      {step === 1 && <Form formData={_formData} setFormData={setFormData} />}
      {step === 2 && formData && plan && (
        <div>
          <div>===プラン===</div>
          <div>{toStringPlan(plan)}</div>
          <div>===会社===</div>
          <div>会社名：{formData.company}</div>
          <div>サイト{formData.site_url}</div>
          <div>メールアドレス:{formData.email}</div>
          <div>電話番号：{formData.phone}</div>
          <div>担当者(お名前){formData.contact_name}</div>
          <div>===住所情報===</div>
          <div>郵便番号:{formData.postal_code}</div>
          <div>都道府県:{formData.prefecture}</div>
          <div>市区町村:{formData.city}</div>
          <div>番地:{formData.street_address}</div>
          <div>ビル名・部屋番号(任意):{formData.address_option}</div>
          <button onClick={onSubmit}>登録</button>
        </div>
      )}
    </div>
  )
}
