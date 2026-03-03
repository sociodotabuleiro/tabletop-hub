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
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({ siteName, confirmationUrl }: MagicLinkEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Seu link de acesso — Sócio do Tabuleiro</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://ubaqkhulkehlfqfiedxa.supabase.co/storage/v1/object/public/email-assets/logo.png" alt="Sócio do Tabuleiro" width="64" height="64" style={logo} />
        <Heading style={h1}>Seu link de acesso</Heading>
        <Text style={text}>Clique no botão abaixo para entrar no Sócio do Tabuleiro. Este link expira em breve.</Text>
        <Button style={button} href={confirmationUrl}>Entrar Agora</Button>
        <Text style={footer}>Se você não solicitou este link, pode ignorar este e-mail com segurança.</Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '480px', margin: '0 auto' }
const logo = { margin: '0 auto 20px', display: 'block' as const }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, fontFamily: "'Playfair Display', Georgia, serif", color: '#0B0E14', margin: '0 0 20px', textAlign: 'center' as const }
const text = { fontSize: '14px', color: '#6B7280', lineHeight: '1.6', margin: '0 0 25px' }
const button = { backgroundColor: '#F97316', color: '#0B0E14', fontSize: '14px', fontWeight: 'bold' as const, borderRadius: '12px', padding: '14px 24px', textDecoration: 'none', display: 'block' as const, textAlign: 'center' as const }
const footer = { fontSize: '12px', color: '#9CA3AF', margin: '30px 0 0', textAlign: 'center' as const }
