import { RequestResultFormType } from '@/app/api/resend/request-result/route'
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text
} from '@react-email/components'
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
            <Text>{formData.name} 様</Text>
            <br />
            <br />
            <Text>
              審査の結果、バイヤー登録が承認されました。
              <br />
              <br />
              これから「TOKIARI 卸販売」の会員として、様々な特典とサービスをご利用いただけます。
              <br />
              <br />
              <Button
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  padding: 10,
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderRadius: 2
                }}
              >
                ログインする
              </Button>
              <br />
              <br />
              今後とも「TOKIARI 卸販売」をご愛顧賜りますようお願い申し上げます。
            </Text>
          </Section>
          <div style={{ width: '100%', height: 1, background: 'gray', margin: '10px 0px' }} />
        </Container>
      </Body>
    </Html>
  )
}
