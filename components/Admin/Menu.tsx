'use client'
import { FC } from 'react'
import { Menu, MenuProps } from 'antd'
import {
  ADMIN_ORDERS_ROUTE,
  ADMIN_PRODUCTS_CREATE_ROUTE,
  ADMIN_PRODUCTS_ROUTE,
  ADMIN_REQUESTS_ROUTE,
  ADMIN_ROUTE,
  ADMIN_SHIPPING_ROUTE,
  ADMIN_USERS_ROUTE
} from '@/constants/route'
import { useRouter } from 'next/navigation'

type MenuItem = Required<MenuProps>['items'][number]

export const MenuSider: FC = () => {
  const router = useRouter()
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type
    } as MenuItem
  }

  const onClick: MenuProps['onClick'] = (e) => {
    return router.push(e.key)
  }

  const menuItems: MenuItem[] = [
    getItem('ダッシュボード', ADMIN_ROUTE),
    getItem('ユーザー', ADMIN_USERS_ROUTE),
    getItem('商品', 'makers', null, [
      getItem('商品一覧', ADMIN_PRODUCTS_ROUTE),
      getItem('新規作成', ADMIN_PRODUCTS_CREATE_ROUTE)
    ]),
    getItem('注文一覧', ADMIN_ORDERS_ROUTE),
    getItem('発送待ち', ADMIN_SHIPPING_ROUTE),
    getItem('バイヤー申請', ADMIN_REQUESTS_ROUTE)
  ]

  return <Menu theme="dark" mode="inline" items={menuItems} onClick={onClick} />
}
