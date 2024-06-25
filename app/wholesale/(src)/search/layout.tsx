import type { Metadata } from 'next'
import { CategoryFilter } from '@/components/Wholesale/categoryFilter'
import style from './layout.module.css'

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
    <div className={style.body}>
      <CategoryFilter />
      <div className={style.contents}>{children}</div>
    </div>
  )
}
