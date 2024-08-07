export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div style={{ padding: '20px 20px 50px 20px', backgroundColor: ' rgb(245, 245, 245)' }}>
      <div style={{ margin: '0 auto', maxWidth: '800px' }}>{children}</div>
    </div>
  )
}
