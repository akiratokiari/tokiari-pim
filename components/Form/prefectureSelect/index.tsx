import { FC, SelectHTMLAttributes } from 'react'
import style from './style.module.css'
import { UseFormRegister, RegisterOptions } from 'react-hook-form'

type option = {
  value: string
}

type Props = {
  name: string
  register: UseFormRegister<any>
  registerOptions?: RegisterOptions
  placeholder: string
  options: option[]
} & SelectHTMLAttributes<HTMLSelectElement>

export const Select: FC<Props> = ({
  register,
  name,
  registerOptions,
  placeholder,
  options,
  ...props
}) => {
  return (
    <div className={style.bodyWrapper}>
      <select className={style.body} {...props} {...register(name, registerOptions)}>
        <option disabled value="">
          選択
        </option>
        <option value="Hokkaido">北海道 — Hokkaido</option>
        <option value="Aomori">青森県 — Aomori</option>
        <option value="Iwate">岩手県 — Iwate</option>
        <option value="Miyagi">宮城県 — Miyagi</option>
        <option value="Akita">秋田県 — Akita</option>
        <option value="Yamagata">山形県 — Yamagata</option>
        <option value="Fukushima">福島県 — Fukushima</option>
        <option value="Ibaraki">茨城県 — Ibaraki</option>
        <option value="Tochigi">栃木県 — Tochigi</option>
        <option value="Gunma">群馬県 — Gunma</option>
        <option value="Saitama">埼玉県 — Saitama</option>
        <option value="Chiba">千葉県 — Chiba</option>
        <option value="Tokyo">東京都 — Tokyo</option>
        <option value="Kanagawa">神奈川県 — Kanagawa</option>
        <option value="Niigata">新潟県 — Niigata</option>
        <option value="Toyama">富山県 — Toyama</option>
        <option value="Ishikawa">石川県 — Ishikawa</option>
        <option value="Fukui">福井県 — Fukui</option>
        <option value="Yamanashi">山梨県 — Yamanashi</option>
        <option value="Nagano">長野県 — Nagano</option>
        <option value="Gifu">岐阜県 — Gifu</option>
        <option value="Shizuoka">静岡県 — Shizuoka</option>
        <option value="Aichi">愛知県 — Aichi</option>
        <option value="Mie">三重県 — Mie</option>
        <option value="Shiga">滋賀県 — Shiga</option>
        <option value="Kyoto">京都府 — Kyoto</option>
        <option value="Osaka">大阪府 — Osaka</option>
        <option value="Hyogo">兵庫県 — Hyogo</option>
        <option value="Nara">奈良県 — Nara</option>
        <option value="Wakayama">和歌山県 — Wakayama</option>
        <option value="Tottori">鳥取県 — Tottori</option>
        <option value="Shimane">島根県 — Shimane</option>
        <option value="Okayama">岡山県 — Okayama</option>
        <option value="Hiroshima">広島県 — Hiroshima</option>
        <option value="Yamaguchi">山口県 — Yamaguchi</option>
        <option value="Tokushima">徳島県 — Tokushima</option>
        <option value="Kagawa">香川県 — Kagawa</option>
        <option value="Ehime">愛媛県 — Ehime</option>
        <option value="Kochi">高知県 — Kochi</option>
        <option value="Fukuoka">福岡県 — Fukuoka</option>
        <option value="Saga">佐賀県 — Saga</option>
        <option value="Nagasaki">長崎県 — Nagasaki</option>
        <option value="Kumamoto">熊本県 — Kumamoto</option>
        <option value="Oita">大分県 — Oita</option>
        <option value="Miyazaki">宮崎県 — Miyazaki</option>
        <option value="Kagoshima">鹿児島県 — Kagoshima</option>
        <option value="Okinawa">沖縄県 — Okinawa</option>)
      </select>
    </div>
  )
}
