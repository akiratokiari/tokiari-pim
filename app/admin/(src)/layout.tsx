import { LogoutButton } from '@/components/Admin'
import {
  ADMIN_PURCHASE_LOG_ROUTE,
  ADMIN_ROUTE,
  ADMIN_SHIPPING_ROUTE,
  ADMIN_USERS_ROUTE
} from '@/constants/route'
import { createClient } from '@/utils/supabase/server'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Dropdown, Layout, Menu, MenuProps, Space } from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import MenuItem from 'antd/es/menu/MenuItem'
import { DownOutlined } from '@ant-design/icons'
import Link from 'next/link'

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
            <MenuItem>
              <Link href={ADMIN_ROUTE}>ダッシュボード</Link>
            </MenuItem>
            <MenuItem>
              <Link href={ADMIN_USERS_ROUTE}>ユーザー</Link>
            </MenuItem>
            <MenuItem>
              <Link href={ADMIN_SHIPPING_ROUTE}>発送待ち</Link>
            </MenuItem>
            <MenuItem>
              <Link href={ADMIN_PURCHASE_LOG_ROUTE}>購入履歴</Link>
            </MenuItem>
          </Menu>
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
    </AntdRegistry>
  )
}
