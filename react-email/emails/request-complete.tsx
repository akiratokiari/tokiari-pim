import { RequestFormType } from '@/app/api/resend/request-complete/route'
import { Body, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import * as React from 'react'

export default function RequestComplete(formData: RequestFormType) {
  return (
    <Html>
      <Head />
      <Preview>新規取引申請の受付を承りました。</Preview>
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
            <Text>
              <Text>{formData.company}</Text>
              <Text>{formData.contact_name}</Text>
              <br />
              <br />
              新規取引申請の受付を承りました。
              <br />
              この度は、「TOKIARI 卸販売サイト」に新規取引申請にお申し込み頂きまして、
              誠にありがとうございます。 現在は申請登録中の状態です。 <br />
              お申し込み内容を確認・認証後に改めて会員登録完了のご案内をメールにてお送りいたします。
              <br />
              ログインには今しばらくお待ち下さい。
            </Text>
          </Section>
          <div style={{ width: '100%', height: 1, background: 'gray', margin: '10px 0px' }} />
          <Section>
            <Text>基本情報</Text>
            <div>
              <div>会社名: {formData.company}</div>
              <div>サイト: {formData.site_url}</div>
              <div>メールアドレス: {formData.email}</div>
              <div>電話番号: {formData.phone}</div>
              <div>担当者(お名前): {formData.contact_name}</div>
              <div>担当者(フリガナ): {formData.contact_kana}</div>
            </div>
          </Section>
          <Section>
            <Text>住所</Text>
            <div>
              <div>郵便番号: {formData.postal_code}</div>
              <div>都道府県: {formData.prefecture}</div>
              <div>市区町村: {formData.city}</div>
              <div>住所: {formData.street_address}</div>
              {formData.building_name && (
                <div>ビル名・部屋番号(任意): {formData.building_name}</div>
              )}
            </div>
          </Section>
          <div style={{ width: '100%', height: 1, background: 'gray', margin: '10px 0px' }} />
          <Section>
            <Text>
              ※内容に誤りがある場合はメールフォームにてお問合せください。
              <br />
              ※７営業日以内にお申込みいただいた内容を確認致しまして審査の結果、
              「本会員登録完了」のメールをお送りいたします。 <br />
              本会員登録が完了いたしましたら改めてご登録内容ご確認メールをお送りいたします。 <br />
              また、当行規定によりご希望に添えない場合もございますのでご了承ください。
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
