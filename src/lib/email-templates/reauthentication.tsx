import * as React from 'react'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from '@react-email/components'
import { brand, BRAND_NAME, BRAND_TAG } from './_brand'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code</Preview>
    <Body style={brand.main}>
      <Container style={brand.container}>
        <Section style={brand.header}>
          <Text style={brand.brandName}>{BRAND_NAME}</Text>
          <Text style={brand.brandTag}>{BRAND_TAG}</Text>
        </Section>
        <Heading style={brand.h1}>Confirm your identity</Heading>
        <Text style={brand.text}>Use the verification code below to confirm your identity:</Text>
        <Text style={brand.code}>{token}</Text>
        <Section style={brand.divider} />
        <Text style={brand.footer}>
          This code will expire shortly. If you didn't request this, you can safely ignore this email.
        </Text>
        <Text style={brand.footerBrand}>© {new Date().getFullYear()} Arnil Etrade. All rights reserved.</Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail
