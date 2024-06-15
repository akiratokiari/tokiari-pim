'use client'
import { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import style from './style.module.css'
import { Oval } from 'react-loader-spinner'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  color?: 'black' | 'white'
  isLoading?: boolean
}

export const Button: FC<Props> = ({
  children,
  color = 'white',
  type,
  isLoading = false,
  ...props
}) => {
  return (
    <button type={type} className={`${style.body} ${style[color]}`} {...props}>
      <>
        {isLoading ? (
          <Oval
            visible={true}
            height="20"
            width="20"
            strokeWidth={4}
            color="white"
            ariaLabel="oval-loading"
            wrapperClass=""
            secondaryColor="gray"
          />
        ) : (
          children
        )}
      </>
    </button>
  )
}
