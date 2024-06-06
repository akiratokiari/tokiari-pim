'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { WHOLESALE_AUTH_ROUTE } from '@/constants/route'
import { Form } from './form'
import { getBaseUrl } from '@/helper/getBaseUrl'

type SignUpUserType = {
  password: string
  email: string

  postal_code: string
  prefecture: string
  city: string
  street_address: string
  building_name?: string

  company: string
  phone: string
  contact_name: string
  contact_kana: string
  site_url?: string
}

export const Plan = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<SignUpUserType | undefined>(undefined)
  const [_formData, _setFormData] = useState<SignUpUserType | undefined>(formData)
  const [step, setStep] = useState<number>(1)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (formData) {
      _setFormData(formData)
    }
    if (!formData) {
      return setStep(1)
    }
    return setStep(2)
  }, [formData])

  const onSubmit = async () => {
    const supabase = createClient()
    if (!formData) return
    const signUpData = {
      email: formData.email,
      password: formData.password
    }

    const signUpInfo = await supabase.auth.signUp({
      email: formData.email,
      password: signUpData.password,
      options: {
        emailRedirectTo: `${getBaseUrl() + WHOLESALE_AUTH_ROUTE}`,
        data: {
          postal_code: formData.postal_code,
          prefecture: formData.prefecture,
          city: formData.city,
          street_address: formData.street_address,
          company: formData.company,
          phone: formData.phone,
          contact_name: formData.contact_name,
          contact_kana: formData.contact_kana,
          building_name: formData.building_name,
          site_url: formData.site_url
        }
      }
    })
    if (!signUpInfo.error) {
      setIsComplete(true)
    }
  }

  return (
    <div style={{ marginBottom: 20, padding: 20 }}>
      {isComplete ? (
        <>完了！</>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <div> STEP 1 お客様情報を入力してください</div>
            <div> STEP 2 確認・登録</div>
            <div> STEP 3 完了</div>
          </div>
          {/* パンくずリスト */}
          <div style={{ marginBottom: 10 }}>
            {step === 2 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <button onClick={() => setFormData(undefined)}>フォームの入力に戻る</button>
                </div>
              </div>
            )}
          </div>
          {/* 入力フォーム */}
          {step === 1 && <Form formData={_formData} setFormData={setFormData} />}
          {step === 2 && formData && (
            <div>
              <div>===会社===</div>
              <div>会社名：{formData.company}</div>
              <div>サイト{formData.site_url}</div>
              <div>メールアドレス:{formData.email}</div>
              <div>パスワード:{formData.password}</div>
              <div>電話番号：{formData.phone}</div>
              <div>担当者(お名前){formData.contact_name}</div>
              <div>担当者(フリガナ){formData.contact_kana}</div>
              <div>===住所情報===</div>
              <div>郵便番号:{formData.postal_code}</div>
              <div>都道府県:{formData.prefecture}</div>
              <div>市区町村:{formData.city}</div>
              <div>番地:{formData.street_address}</div>
              <div>ビル名・部屋番号(任意):{formData.building_name}</div>
              <button onClick={onSubmit}>申請する</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
