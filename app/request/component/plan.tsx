'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { REQUEST_ROUTE, WHOLESALE_AUTH_ROUTE } from '@/constants/route'
import { Form } from './form'
import { getBaseUrl } from '@/helper/getBaseUrl'
import style from './style.module.css'
import { Button } from '@/components/button'
import { DisplayFormValue } from '@/components/displayFormValue'
import { toQuery } from '@/helper/toQuery'
import { useRouter } from 'next/navigation'
import { RequestFormType } from '@/app/api/resend/request-complete/route'

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
  site_url: string
}

export const Plan = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<SignUpUserType | undefined>(undefined)
  const [_formData, _setFormData] = useState<SignUpUserType | undefined>(formData)
  const [step, setStep] = useState<number>(1)
  const [isComplete, setIsComplete] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (formData) {
      _setFormData(formData)
    }
    if (!formData) {
      return setStep(1)
    }
    return setStep(2)
  }, [formData, setFormData])

  const onSubmit = async () => {
    if (!isSending) {
      setIsSending(true)
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

      const emailValue: RequestFormType = {
        email: formData.email,
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

      if (!signUpInfo.error) {
        await fetch(`/api/resend/request-complete`, {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailValue)
        })
          .then(() => {
            router.push(REQUEST_ROUTE + toQuery({ status: 'complete' }))
          })
          .catch(() => {
            window.alert('エラーが発生しました、もう一度やり直してください。')
          })
        await supabase.auth.signOut()
        setIsComplete(true)
      }
      if (signUpInfo.error) {
        setIsSending(false)
        setFormData(undefined)
        setErrorMessage(signUpInfo.error.message)
      }
    }
  }

  return (
    <div style={{ marginBottom: 20 }}>
      {isComplete ? (
        <div className={style.complete}>
          <div className={style.completeTitle}>申し込みが完了しました</div>
          <div className={style.completeText}>
            ご入力されたメールアドレス宛に確認メールをお送りしました。
            <br />
            3日を目処に審査結果をご連絡いたします。
          </div>
        </div>
      ) : (
        <>
          <div className={style.attention}>
            ここに申し込みにおける注意点や必要な項目についての文章を記入
          </div>
          {/* パンくずリスト */}
          {errorMessage && <div className={style.errorMessage}>ERROR：{errorMessage}</div>}
          {/* 入力フォーム */}
          {step === 1 && <Form formData={_formData} setFormData={setFormData} />}
          {step === 2 && formData && (
            <div>
              <div className={style.backButtonWrapper}>
                <Button color="white" onClick={() => setFormData(undefined)}>
                  フォームの入力に戻る
                </Button>
              </div>
              <div className={style.section}>基本情報</div>
              <div className={style.displayValue}>
                <DisplayFormValue first label="会社名" value={formData.company} />
                <DisplayFormValue label="サイト" value={formData.site_url} />
                <DisplayFormValue label="メールアドレス" value={formData.email} />
                <DisplayFormValue label="パスワード" value={formData.password} />
                <DisplayFormValue label="電話番号" value={formData.phone} />
                <DisplayFormValue label="担当者(お名前)" value={formData.contact_name} />
                <DisplayFormValue label="担当者(フリガナ)" value={formData.contact_kana} />
              </div>
              <div className={style.displayValue}>
                <div className={style.section}>住所</div>
                <DisplayFormValue first label="郵便番号" value={formData.postal_code} />
                <DisplayFormValue label="都道府県" value={formData.prefecture} />
                <DisplayFormValue label="市区町村" value={formData.city} />
                <DisplayFormValue label="住所" value={formData.street_address} />
                {formData.building_name && (
                  <DisplayFormValue label="ビル名・部屋番号(任意)" value={formData.building_name} />
                )}
              </div>
              <div className={style.buttonWrapper}>
                <Button color="black" onClick={onSubmit}>
                  申し込む
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
