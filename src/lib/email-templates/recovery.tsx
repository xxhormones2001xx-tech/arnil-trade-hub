import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from '@react-email/components'
import { brand, BRAND_NAME, BRAND_TAG } from './_brand'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your password for {siteName}</Preview>
    <Body style={brand.main}>
      <Container style={brand.container}>
        <Section style={brand.header}>
          <Text style={brand.brandName}>{BRAND_NAME}</Text>
          <Text style={brand.brandTag}>{BRAND_TAG}</Text>
        </Section>
        <Heading style={brand.h1}>Reset your password</Heading>
        <Text style={brand.text}>
          We received a request to reset your password for {siteName}. Click below to choose a new password.
        </Text>
        <Button style={brand.button} href={confirmationUrl}>Reset Password</Button>
        <Section style={brand.divider} />
        <Text style={brand.footer}>
          If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
        </Text>
        <Text style={brand.footerBrand}>© {new Date().getFullYear()} Arnil Etrade. All rights reserved.</Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail
