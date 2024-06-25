import type { Metadata } from 'next'
import { Header } from '@/components/Wholesale/header'
import { Footer } from '@/components/Wholesale/footer'

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
      <div style={{ padding: '85px 20px 50px 20px', backgroundColor: ' rgb(245, 245, 245)' }}>
        {children}
      </div>
      <Footer />
    </div>
  )
}
