import { AnchorHTMLAttributes, FC, ReactNode } from 'react'

type Props = {
  href: string
  children: ReactNode
  textDecoration?: 'underline'
} & AnchorHTMLAttributes<HTMLAnchorElement>

export const ExternalLink: FC<Props> = ({ href, children, textDecoration, ...props }) => {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      style={{ textDecoration: textDecoration, color: 'black' }}
    >
      {children}
    </a>
  )
}
