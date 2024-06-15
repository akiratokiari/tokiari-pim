'use client'
import { UsersInsertType } from '@/utils/supabase/type'
import { FC, FormEvent } from 'react'

type Props = {
  setFormData: any
  formData?: UsersInsertType
}

export const Form: FC<Props> = ({ formData, setFormData }) => {
  const updateUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault() // デフォルトのフォーム送信を阻止
    const formData = new FormData(event.currentTarget) // フォームデータを取得

    const signUpData = {
      postal_code: formData.get('postal_code') as string,
      prefecture: formData.get('prefecture') as string,
      city: formData.get('city') as string,
      street_address: formData.get('street_address') as string,
      building_name: formData.get('building_name') as string,
      company: formData.get('company') as string,
      phone: formData.get('phone') as string,
      contact_name: formData.get('contact_name') as string,
      site_url: formData.get('site_url') as string
    }
    setFormData(signUpData)
  }

  return (
    <form onSubmit={updateUser} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>===会社情報===</div>
      <label htmlFor="company">会社名:</label>
      <input
        defaultValue={formData ? formData.company : ''}
        id="company"
        name="company"
        type="text"
        required
      />
      <label htmlFor="phone">電話番号:</label>
      <input
        defaultValue={formData ? formData.phone : ''}
        id="phone"
        name="phone"
        type="tel"
        required
      />
      <label htmlFor="site_url">ホームページ:</label>
      <input
        defaultValue={formData ? formData.site_url || '' : ''}
        id="site_url"
        name="site_url"
        required
      />
      <label htmlFor="contact_name">担当者(お名前):</label>
      <input
        defaultValue={formData ? formData.contact_name : ''}
        id="contact_name"
        name="contact_name"
        type="text"
        required
      />
      <div>===住所情報===</div>
      <label htmlFor="postal_code">郵便番号:</label>
      <input
        defaultValue={formData ? formData.postal_code : ''}
        id="postal_code"
        name="postal_code"
        type="text"
        required
      />
      <label htmlFor="prefecture">都道府県:</label>
      <input
        defaultValue={formData ? formData.prefecture : ''}
        id="prefecture"
        name="prefecture"
        type="text"
        required
      />
      <label htmlFor="city">市区町村:</label>
      <input
        defaultValue={formData ? formData.city : ''}
        id="city"
        name="city"
        type="text"
        required
      />
      <label htmlFor="street_address">番地:</label>
      <input
        defaultValue={formData ? formData.street_address : ''}
        id="street_address"
        name="street_address"
        type="text"
        required
      />
      <label htmlFor="building_name">建物名・部屋番号</label>
      <input
        defaultValue={formData ? formData.building_name || '' : ''}
        id="building_name"
        name="building_name"
        type="text"
        required
      />
      <button type="submit">次へ</button>
    </form>
  )
}
