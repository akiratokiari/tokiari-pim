'use client'
import { restartBodyScroll, stopBodyScroll } from '@/helper/bodyScroll'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import styles from './style.module.css'
import { MenuContext } from '@/contexts/menu/context'
import Link from 'next/link'
import { WHOLESALE_ACCOUNT_ORDERS_ROUTE, WHOLESALE_ACCOUNT_ROUTE } from '@/constants/route'
import MenuSVG from '../../../public/menu_24.svg'
import Image from 'next/image'
import { LogoutButton } from '../logoutButton'
import { Button } from '@/components/button'
import { AccountContext } from '@/contexts/account/context'

export default function Menu() {
  const { isOpen, close, open } = useContext(MenuContext)
  const router = useRouter()
  const pathname = usePathname()
  const [isInitial, setIsInitial] = useState(true)
  const searchParams = useSearchParams()
  const { account } = useContext(AccountContext)

  useEffect(() => {
    if (isOpen) {
      close()
      restartBodyScroll()
    }
  }, [pathname, searchParams])

  useEffect(() => {
    if (isOpen) {
      stopBodyScroll()
    }
    if (!isOpen) {
      restartBodyScroll()
    }
  }, [isOpen, router])

  useEffect(() => {
    if (isInitial) {
      setIsInitial(false)
      return
    }

    // 要素の取得
    const bodyElement = document.getElementById('mobileMenuBody')
    const backgroundElement = document.getElementById('mobileMenuBackground')
    if (!bodyElement || !backgroundElement) return

    // 初期値削除 & 基本のスタイル設定
    if (styles.body) bodyElement.classList.remove(styles.body)
    if (styles.openedBody) bodyElement.classList.add(styles.openedBody)

    // 開閉のスタイル
    if (styles.bodyOpen) bodyElement.classList.toggle(styles.bodyOpen, isOpen)
    if (styles.bodyClose) bodyElement.classList.toggle(styles.bodyClose, !isOpen)

    // 背景のスタイル
    if (styles.backgroundOpen) backgroundElement.classList.toggle(styles.backgroundOpen, isOpen)
    if (styles.backgroundClose) backgroundElement.classList.toggle(styles.backgroundClose, !isOpen)
  }, [isOpen, isInitial])

  return (
    <>
      <button aria-label="Open cart" onClick={open}>
        <Image src={MenuSVG} alt={MenuSVG} />
      </button>
      <div id="mobileMenuBody" className={styles.body}>
        <div className={styles.contents}>
          <div className={styles.innerContents}>
            <div className={styles.accountName}>{account?.company} 様</div>
            <div className={styles.accountServiceWrapper}>
              <Link
                style={{ color: 'black', fontSize: 14, textAlign: 'right' }}
                href={WHOLESALE_ACCOUNT_ROUTE}
              >
                <div>基本情報の確認/変更</div>
              </Link>
              <Link
                style={{ color: 'black', fontSize: 14, textAlign: 'right' }}
                href={WHOLESALE_ACCOUNT_ORDERS_ROUTE}
              >
                <div>注文履歴</div>
              </Link>
              <LogoutButton />
            </div>
            <div className={styles.border} />
            <Link className={styles.menu} href={'/wholesale/search'}>
              PRODUCTS
            </Link>
            <Link className={styles.menu} href={'/wholesale/cart'}>
              CART
            </Link>
            <div className={styles.border} />

            <Link className={styles.menu} href="/wholesale/trade-law">
              特定商取引法に基づく表示
            </Link>
          </div>
        </div>
      </div>
      <div id="mobileMenuBackground" className={styles.background} onClick={close} />
    </>
  )
}
