import { FC, ReactNode } from 'react'

type Props = {
  href: string
  children: ReactNode
  textDecoration?: 'underline'
}

export const ExternalLink: FC<Props> = ({ href, children, textDecoration }) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      style={{ textDecoration: textDecoration }}
    >
      {children}
    </a>
  )
}
