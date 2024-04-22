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
        {options.map((o, index) => {
          return (
            <option key={index} value={o.value}>
              {o.value}
            </option>
          )
        })}
      </select>
    </div>
  )
}
