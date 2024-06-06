import { LogoutButton } from '@/components/Admin'
import { createClient } from '@/utils/supabase/server'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { App, Dropdown, Layout, MenuProps } from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { DownOutlined } from '@ant-design/icons'
import { Suspense } from 'react'
import { MenuSider } from '@/components/Admin/Menu'

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <LogoutButton />
    }
  ]
  return (
    <AntdRegistry>
      <App>
        <Layout hasSider>
          {/* <ContextHolderProvider /> */}

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
            <Suspense fallback={<></>}>
              <MenuSider />
            </Suspense>
          </Sider>
          <Layout style={{ marginLeft: 200 }}>
            <Header
              style={{
                padding: 0,
                background: 'white',
                display: 'flex',
                justifyContent: 'right',
                paddingRight: 16
              }}
            >
              <Dropdown menu={{ items }} overlayStyle={{ cursor: 'pointer' }}>
                <a>
                  {data.user?.email}
                  <DownOutlined style={{ marginLeft: 8 }} />
                </a>
              </Dropdown>
            </Header>
            <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>{children}</Content>
            <Footer style={{ textAlign: 'center' }}>TOKIARI PIM©{new Date().getFullYear()}</Footer>
          </Layout>
        </Layout>
      </App>
    </AntdRegistry>
  )
}
