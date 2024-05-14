import type { Metadata } from 'next'
import { Header } from '@/components/Wholesale/header'


export const metadata: Metadata = {
  title: 'tokiari-pim',
  description: 'tokiari-pim'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  )
}
