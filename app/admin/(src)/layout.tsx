import { LogoutButton } from '@/components/Admin'
import { createClient } from '@/utils/supabase/server'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Layout, Menu } from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import MenuItem from 'antd/es/menu/MenuItem'

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return (
    <AntdRegistry>
      <Layout hasSider>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0
          }}
        >
          <div
            style={{
              margin: '8px 8px 15px 8px',
              background: 'white',
              borderRadius: 4,
              padding: '4px 16px',
              lineHeight: '32px',
              backgroundColor: 'white'
            }}
          >
            PIM - 卸管理画面
          </div>
          <Menu theme="dark" mode="inline">
            <MenuItem>ダッシュボード</MenuItem>
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Header style={{ padding: 0, background: 'white' }}>
            {data.user?.email}
            <LogoutButton />
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>{children}</Content>
          <Footer style={{ textAlign: 'center' }}>TOKIARI ©{new Date().getFullYear()}</Footer>
        </Layout>
      </Layout>
    </AntdRegistry>
  )
}
