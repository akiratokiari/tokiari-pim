import type { Metadata } from 'next'
import { CategoryFilter } from '@/components/Wholesale/categoryFilter'

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
    <div style={{ display: 'flex' }}>
      <CategoryFilter />
      <div style={{ padding: '0px 20px 0px 20px', width: '100%' }}>{children}</div>
      {/* <SortFilter /> */}
    </div>
  )
}
