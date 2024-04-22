import { FC, InputHTMLAttributes } from 'react'
import style from './style.module.css'
import { UseFormRegister, RegisterOptions } from 'react-hook-form'

type Props = {
  name: string
  register: UseFormRegister<any>
  registerOptions?: RegisterOptions
} & InputHTMLAttributes<HTMLInputElement>

export const Input: FC<Props> = ({ register, name, registerOptions, ...props }) => {
  return <input className={style.body} {...props} {...register(name, registerOptions)} />
}
