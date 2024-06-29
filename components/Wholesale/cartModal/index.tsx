'use client'
import { restartBodyScroll, stopBodyScroll } from '@/helper/bodyScroll'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import styles from './style.module.css'
import { WHOLESALE_CART_ROUTE } from '@/constants/route'
import { CartContext } from '@/contexts/cart/context'
import { Button } from '@/components/button'
import { CartItem } from '../cartItem'

export default function CartModal() {
  const router = useRouter()
  const [isInitial, setIsInitial] = useState(true)
  const { cart, isOpen, openCart, closeCart } = useContext(CartContext)
  const [cartItems, setCartItems] = useState(cart)
  const pathname = usePathname()

  useEffect(() => {
    setCartItems(cart)
  }, [cart, setCartItems])

  useEffect(() => {
    if (isOpen) {
      closeCart()
      restartBodyScroll()
    }
  }, [pathname])

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
    const bodyElement = document.getElementById('cartBody')
    const backgroundElement = document.getElementById('cartBackground')
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
      <button aria-label="Open cart" onClick={openCart}>
        🛒
      </button>
      <div id="cartBody" className={styles.body}>
        <div className={styles.contents}>
          <div className={styles.innerContents}>
            {cartItems.length > 0 ? (
              cartItems.map((c, index) => {
                return <CartItem key={index} data={c} />
              })
            ) : (
              <div>
                <div style={{ textAlign: 'center', marginTop: 20, fontWeight: 'bold' }}>
                  カートは空です
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.buttonWrapper}>
          {cartItems.length > 0 && (
            <Link href={WHOLESALE_CART_ROUTE}>
              <Button color="black">Check Out</Button>
            </Link>
          )}
          <Button style={{ marginTop: 10 }} aria-label="Close cart" onClick={closeCart}>
            閉じる
          </Button>
        </div>
      </div>
      <div id="cartBackground" className={styles.background} onClick={closeCart} />
    </>
  )
}
