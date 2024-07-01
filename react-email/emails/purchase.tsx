import { PurchaseFormType } from '@/app/api/resend/purchase/route'
import { Body, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import * as React from 'react'

export default function Purchase(formData: PurchaseFormType) {
  const productDetails = formData.products
    ? formData.products
        .map(
          (p) => `
    <div>
      <div>商品名: </div>
      <div>サイズ: ${p.size}</div>
      <div>個数: ${p.quantity}</div>
      <div>金額: ${p.price}</div>
    </div>
  `
        )
        .join('')
    : ''

  return (
    <Html>
      <Head />
      <Preview>この度は、「TOKIARI 卸販売」でご購入いただき誠にありがとうございます。</Preview>
      <Body
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          width: '100%',
          maxWidth: '800px',
          lineHeight: '1.5',
          color: '#333'
        }}
      >
        <Container>
          <Section>
            <Text>{formData.company}</Text>
            <Text>{formData.name}</Text>
            <br />
            <br />
            <Text>
              ご購入ありがとう御座います。
              <br />
              <br />
              発送終了後にお荷物お問い合わせ番号をメールにてお知らせ致します。
              <br />
              発送までしばらくお待ちください。
            </Text>
          </Section>
          <div style={{ width: '100%', height: 1, background: 'gray', margin: '10px 0px' }} />
          <Section>
            <Text>ご注文内容</Text>
            <Text>ご注文ID:{formData.orderId}</Text>
            <div dangerouslySetInnerHTML={{ __html: productDetails }} />
          </Section>
          <Section>
            <Text>合計金額</Text>
            <div>
              <div>{formData.totalPrice}</div>
            </div>
          </Section>
          <div style={{ width: '100%', height: 1, background: 'gray', margin: '10px 0px' }} />
          <Section>
            <Text>決済方法</Text>
            <div>
              <div>クレジットカード決済</div>
            </div>
          </Section>
          <div style={{ width: '100%', height: 1, background: 'gray', margin: '10px 0px' }} />
          <Section>
            <Text>お届け先</Text>
            <div>
              <div>〒{formData.postal_code}</div>
              <div>
                {formData.prefecture}
                {formData.city}
                {formData.street_address}
              </div>
              <div>{formData.building_name}</div>
            </div>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
