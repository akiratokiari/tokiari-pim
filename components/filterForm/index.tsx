'use client'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Helmet, Input, Select } from '@/components/Form'
import style from './style.module.css'
import { useRouter } from 'next/navigation'
import { PRODUCT_ROUTE } from '@/constants/route'
import { toQuery } from '@/helper/toQuery'
import { FC } from 'react'

export type FormValue = {
  color?: string
  size?: string
  category?: string
  keyword?: string
}

export type Props = {
  searchParams: {
    color?: string
    size?: string
    category?: string
    keyword?: string
  }
}

export const FilterForm: FC<Props> = ({ searchParams }) => {
  const router = useRouter()
  const { register, handleSubmit, reset } = useForm<FormValue>()
  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    console.log(data)
    const params: FormValue = {}
    if (data.category) {
      params.category = data.category
    }
    if (data.color) {
      params.color = data.color
    }
    if (data.size) {
      params.size = data.size
    }
    if (data.category) {
      params.category = data.category
    }
    if (data.keyword) {
      params.keyword = data.keyword
    }
    console.log(params)
    router.push(PRODUCT_ROUTE + toQuery({ ...params }))
  }

  const onReset = () => {
    reset({ category: '', color: '', keyword: '', size: '' })
  }

  const colorOptions = [
    { value: '' },
    { value: 'BK' },
    { value: 'WH' },
    { value: 'RED' },
    { value: 'RU' },
    { value: 'BR' },
    { value: 'KH' },
    { value: 'IB' },
    { value: 'GR' },
    { value: 'BE' },
    { value: 'BL' },
    { value: 'KN' },
    { value: 'KW' }
  ]
  const sizeOptions = [
    { value: '' },
    { value: '0' },
    { value: '1' },
    { value: '2' },
    { value: 'F' }
  ]
  const categoryOptions = [
    { value: '' },
    { value: 'シャツ' },
    { value: 'トップス' },
    { value: 'アウター' },
    { value: 'パンツ' }
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.body}>
      <Helmet required={false} label="色">
        <Select
          placeholder="色"
          defaultValue={searchParams.color || ''}
          name="color"
          register={register}
          options={colorOptions}
        />
      </Helmet>
      <Helmet required={false} label="サイズ">
        <Select
          placeholder="サイズ"
          name="size"
          defaultValue={searchParams.size || ''}
          register={register}
          options={sizeOptions}
        />
      </Helmet>
      <Helmet required={false} label="カテゴリー">
        <Select
          placeholder="色"
          name="category"
          defaultValue={searchParams.category || ''}
          register={register}
          options={categoryOptions}
        />
      </Helmet>
      <Helmet required={false} label="キーワード">
        <Input
          type="text"
          defaultValue={searchParams.keyword || ''}
          name="keyword"
          register={register}
        />
      </Helmet>

      <div className={style.buttonWrapper}>
        <button className={style.button} type="submit">
          検索する
        </button>
        <button className={style.resetButton} onClick={onReset}>
          リセット
        </button>
      </div>
    </form>
  )
}
