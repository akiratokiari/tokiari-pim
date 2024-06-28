export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div style={{ margin: '0 auto', maxWidth: '1000px' }}>{children}</div>
}
