'use client'
import { Button } from '@/components/button'
import { Helmet, Input } from '@/components/Form'
import { FC, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import style from './style.module.css'

type Props = {
  setFormData?: any
  formData?: any
}

export type FormValue = {
  postal_code: string
  prefecture: string
  city: string
  email: string
  password: string
  street_address: string
  building_name?: string
  company: string
  phone: string
  contact_name: string
  contact_kana: string
  site_url: string
}

export const Form: FC<Props> = ({ formData, setFormData }) => {
  useEffect(() => {
    if (formData) {
      Object.keys(formData).forEach((key) => {
        setValue(key as keyof FormValue, formData[key as keyof FormValue])
      })
    }
  }, [formData])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValue>()
  const [isSending, setIsSending] = useState(false)
  const onSubmit: SubmitHandler<FormValue> = (values) => {
    if (!isSending) {
      setIsSending(true)
      setFormData(values)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className={style.body}>
        <div className={style.section}>基本情報</div>
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
        <Helmet label="メールアドレス" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="メールアドレスを入力してください"
            name="email"
            register={register}
            registerOptions={{
              required: 'は必須項目です'
            }}
          />
        </Helmet>
        <Helmet label="パスワード" error={errors.password?.message}>
          <Input
            type="text"
            placeholder="パスワードを入力してください"
            name="password"
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
        <div className={style.section}>住所</div>
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
            次へ進む
          </Button>
        </div>
      </form>
    </div>
  )
}
