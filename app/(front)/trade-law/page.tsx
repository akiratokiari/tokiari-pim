import style from './style.module.css'
import { PageHeader } from '@/components/Wholesale/pageHeader'

export default async function Page() {
  return (
    <div style={{ padding: 20 }}>
      <PageHeader>特定商取引法に基づく表示</PageHeader>
      <div className={style.title}>販売事業者の名称</div>
      <div className={style.description}>合同会社時在服飾設</div>
      <div className={style.title}>代表責任者</div>
      <div className={style.description}>代表　高橋　輝</div>
      <div className={style.title}>販売事業者の所在地</div>
      <div className={style.description}>
        〒215-0001 神奈川県川崎市麻生区細山3-7-10
        ※返品交換の受付窓口とは異なりますのでご注意ください。
      </div>
      <div className={style.title}>販売事業者の連絡先</div>
      <div className={style.description}>info@tokiari.com にお問い合わせください</div>
      <div className={style.title}>商品の販売価格</div>
      <div className={style.description}>商品ごとに表示</div>
      <div className={style.title}>商品代金以外の必要金額</div>
      <div className={style.description}>
        ・支払手数料 <br />
        ・送料（北海道は1,300円、沖縄は1,800円、北海道・沖縄以外700円）
      </div>
      <div className={style.title}>支払方法・支払い期限</div>
      <div className={style.description}>
        ・クレジットカード
        <br />
        　（締め日や契約内容により異なります。ご利用のカード会社までお問い合わせください。）
      </div>
      <div className={style.title}>商品の引渡時期</div>
      <div className={style.description}>ご注文日から５営業日以内に発送いたします。</div>
      <div className={style.title}>注文の取消し・返品・交換の規定</div>
      <div className={style.description}>商品到着後７日以内に限り返品・交換が可能です。</div>
      <div className={style.title}>返品送料</div>
      <div className={style.description}>
        商品に欠陥がある場合には当方負担、お客様のご都合による返品・交換の場合にはお客様負担となります。
      </div>
    </div>
  )
}
