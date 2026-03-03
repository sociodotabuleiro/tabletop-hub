/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteName, siteUrl, confirmationUrl }: InviteEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Você foi convidado para o Sócio do Tabuleiro</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://ubaqkhulkehlfqfiedxa.supabase.co/storage/v1/object/public/email-assets/logo.png" alt="Sócio do Tabuleiro" width="64" height="64" style={logo} />
        <Heading style={h1}>Você foi convidado!</Heading>
        <Text style={text}>
          Você recebeu um convite para fazer parte do{' '}
          <Link href={siteUrl} style={link}><strong>Sócio do Tabuleiro</strong></Link>.
          Clique no botão abaixo para aceitar o convite e criar sua conta.
        </Text>
        <Button style={button} href={confirmationUrl}>Aceitar Convite</Button>
        <Text style={footer}>Se você não esperava este convite, pode ignorar este e-mail com segurança.</Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '480px', margin: '0 auto' }
const logo = { margin: '0 auto 20px', display: 'block' as const }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, fontFamily: "'Playfair Display', Georgia, serif", color: '#0B0E14', margin: '0 0 20px', textAlign: 'center' as const }
const text = { fontSize: '14px', color: '#6B7280', lineHeight: '1.6', margin: '0 0 25px' }
const link = { color: '#F97316', textDecoration: 'underline' }
const button = { backgroundColor: '#F97316', color: '#0B0E14', fontSize: '14px', fontWeight: 'bold' as const, borderRadius: '12px', padding: '14px 24px', textDecoration: 'none', display: 'block' as const, textAlign: 'center' as const }
const footer = { fontSize: '12px', color: '#9CA3AF', margin: '30px 0 0', textAlign: 'center' as const }
