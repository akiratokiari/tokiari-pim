import { DeliveryFormType } from '@/app/api/resend/delivery/route'
import { Body, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import * as React from 'react'

export default function Delivery(formData: DeliveryFormType) {
  return (
    <Html>
      <Head />
      <Preview>商品が発送されました</Preview>
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
            <Text>ご注文ID:{formData.orderId}</Text>
            <br />
            <br />
            <Text style={{ whiteSpace: 'pre-wrap' }}>{formData.textarea}</Text>
            <br />
            <br />
            <Text>今後とも「TOKIARI 卸販売」をご愛顧賜りますようお願い申し上げます。</Text>
          </Section>
          <div style={{ width: '100%', height: 1, background: 'gray', margin: '10px 0px' }} />
        </Container>
      </Body>
    </Html>
  )
}
