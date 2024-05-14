'use client'
import { useFormState } from 'react-dom'
import { updateUser } from './actions'
import style from './style.module.css'
import { FC, useContext } from 'react'
import { AccountContext } from '@/contexts/account/context'

export const Form: FC = () => {
  const { account } = useContext(AccountContext)
  const [_, formAction] = useFormState(updateUser, null)

  return (
    <form action={formAction} className={style.form}>
      <div>===会社情報===</div>
      <label htmlFor="company">会社名:</label>
      <input id="company" defaultValue={account?.company} name="company" type="text" required />
      <label htmlFor="phone">電話番号:</label>
      <input id="phone" defaultValue={account?.phone} name="phone" type="tel" required />
      <label htmlFor="site_url">ホームページ:</label>
      <input id="site_url" defaultValue={account?.site_url} name="site_url" required />
      <label htmlFor="contact_name">担当者(お名前):</label>
      <input
        id="contact_name"
        defaultValue={account?.contact_name}
        name="contact_name"
        type="text"
        required
      />
      <div>===住所情報===</div>
      <label htmlFor="postal_code">郵便番号:</label>
      <input
        id="postal_code"
        defaultValue={account?.postal_code}
        name="postal_code"
        type="text"
        required
      />
      <label htmlFor="prefecture">都道府県:</label>
      <input
        id="prefecture"
        defaultValue={account?.prefecture}
        name="prefecture"
        type="text"
        required
      />
      <label htmlFor="city">市区町村:</label>
      <input id="city" defaultValue={account?.city} name="city" type="text" required />
      <label htmlFor="street_address">番地:</label>
      <input
        id="street_address"
        defaultValue={account?.street_address}
        name="street_address"
        type="text"
        required
      />
      <label htmlFor="address_option">建物名・部屋番号</label>
      <input
        id="address_option"
        defaultValue={account?.address_option}
        name="address_option"
        type="text"
        required
      />
      <button type="submit">変更</button>
    </form>
  )
}
