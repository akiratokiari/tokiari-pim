'use client'
import { Button } from '@/components/button'
import { Helmet, Input } from '@/components/Form'
import { FC, useContext, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import style from './style.module.css'
import { AccountContext } from '@/contexts/account/context'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { WHOLESALE_ACCOUNT_ROUTE } from '@/constants/route'

type Props = {
  setFormData?: any
  formData?: any
}

export type FormValue = {
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

export const Form: FC<Props> = () => {
  const { account, refresh } = useContext(AccountContext)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    refresh()
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValue>({})

  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    // accountの値が変更された時にフォームの値をリセット
    reset({
      building_name: account?.building_name || '',
      company: account?.company || '',
      postal_code: account?.postal_code || '',
      prefecture: account?.prefecture || '',
      city: account?.city || '',
      street_address: account?.street_address || '',
      phone: account?.phone || '',
      contact_name: account?.contact_name || '',
      contact_kana: account?.contact_kana || '',
      site_url: account?.site_url || ''
    })
  }, [account, reset])

  const onSubmit: SubmitHandler<FormValue> = async (values) => {
    if (!isSending) {
      const userId = (await supabase.auth.getUser()).data.user?.id
      if (!userId) {
        return '予期せぬエラーが発生しました'
      }
      try {
        await supabase.from('users').update(values).eq('id', userId)
      } catch {
        return '予期せぬエラーが発生しました'
      }

      router.push(WHOLESALE_ACCOUNT_ROUTE)
      router.refresh()
      setIsSending(true)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
        <div className={style.section}>登録情報</div>
        <Helmet label="会社名" error={errors.company?.message}>
          <Input
            placeholder="会社名を入力してください"
            type="text"
            name="company"
            register={register}
            registerOptions={{
              required: 'は必須項目です'
            }}
          />
        </Helmet>
        <Helmet label="電話番号" error={errors.phone?.message}>
          <Input
            type="text"
            placeholder="電話番号を入力してください"
            name="phone"
            register={register}
            registerOptions={{
              required: 'は必須項目です'
            }}
          />
        </Helmet>
        <Helmet label="サイトURL" error={errors.site_url?.message}>
          <Input
            type="url"
            placeholder="サイトURLを入力してください"
            name="site_url"
            register={register}
            registerOptions={{
              required: 'は必須項目です'
            }}
          />
        </Helmet>
        <Helmet label="お名前" error={errors.contact_name?.message}>
          <Input
            type="text"
            placeholder="お名前を入力してください"
            name="contact_name"
            register={register}
            registerOptions={{
              required: 'は必須項目です'
            }}
          />
        </Helmet>
        <Helmet label="お名前(カナ)" error={errors.contact_kana?.message}>
          <Input
            type="text"
            placeholder="お名前(カナ)を入力してください"
            name="contact_kana"
            register={register}
            registerOptions={{
              required: 'お名前(カナは必須項目です'
            }}
          />
        </Helmet>
        <div className={style.section}>住所情報</div>
        <Helmet label="郵便番号" error={errors.postal_code?.message}>
          <Input
            type="text"
            placeholder="郵便番号を入力してください"
            name="postal_code"
            register={register}
            registerOptions={{
              required: 'は必須項目です'
            }}
          />
        </Helmet>
        <Helmet label="都道府県" error={errors.prefecture?.message}>
          <Input
            type="text"
            placeholder="都道府県を入力してください"
            name="prefecture"
            register={register}
            registerOptions={{
              required: 'は必須項目です'
            }}
          />
        </Helmet>
        <Helmet label="市区町村" error={errors.city?.message}>
          <Input
            type="text"
            placeholder="市区町村を入力してください"
            name="city"
            register={register}
            registerOptions={{
              required: 'は必須項目です'
            }}
          />
        </Helmet>
        <Helmet label="番地" error={errors.street_address?.message}>
          <Input
            type="text"
            placeholder="番地を入力してください"
            name="street_address"
            register={register}
            registerOptions={{
              required: 'は必須項目です'
            }}
          />
        </Helmet>
        <Helmet label="建物名・部屋番号" required={false}>
          <Input
            type="text"
            placeholder="建物名・部屋番号を入力してください"
            name="building_name"
            register={register}
          />
        </Helmet>
        <div className={style.buttonWrapper}>
          <Button isLoading={isSending} disabled={isSending} color="black" type="submit">
            編集する
          </Button>
        </div>
      </form>
    </div>
  )
}
