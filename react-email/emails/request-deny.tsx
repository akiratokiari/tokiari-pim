import { RequestResultFormType } from '@/app/api/resend/request-result/route'
import { Body, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import * as React from 'react'

export default function RequestApprove(formData: RequestResultFormType) {
  return (
    <Html>
      <Head />
      <Preview>
        この度は、「TOKIARI 卸販売」に新規取引申請にお申し込み頂きまして、誠にありがとうございます。
      </Preview>
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
              誠に残念ながら審査の結果、本会員登録ができませんでした。
              <br />
              <br />
              誠に申し訳ございませんが、ご了承くださいますようお願い申し上げます。
              審査内容、審査結果の理由等についてはお答えできませんので、あらかじめご了承ください。
              <br />
              <br />
              今後ともご愛顧賜りますようよろしくお願い申し上げます。
            </Text>
          </Section>
          <div style={{ width: '100%', height: 1, background: 'gray', margin: '10px 0px' }} />
        </Container>
      </Body>
    </Html>
  )
}
