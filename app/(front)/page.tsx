import { ExternalLink } from '@/components/externalLink'
import style from './page.module.css'
import { Button } from '@/components/button'
import Link from 'next/link'

export default async function Page() {
  return (
    <div className={style.body}>
      <div className={style.contents}>
        <div className={style.content}>
          <div>
            本サイトは
            <ExternalLink textDecoration="underline" href="https://tokiari.com/about/tokiari/">
              時在服飾設計
            </ExternalLink>
            の卸向け商品紹介・販売サイトです。
            <br />
            <br />
            商品の購入にはバイヤー申請が必要になります。
          </div>
          <div className={style.buttonWrapper}>
            <Link href="/search">
              <Button>取り扱い商品を見る</Button>
            </Link>
            <Link href="/request">
              <Button color="black">バイヤー申請を行う</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
