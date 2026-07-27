import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text,
} from '@react-email/components'
import { brand, BRAND_NAME, BRAND_TAG } from './_brand'

interface EmailChangeEmailProps {
  siteName: string
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({ siteName, oldEmail, newEmail, confirmationUrl }: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email change for {siteName}</Preview>
    <Body style={brand.main}>
      <Container style={brand.container}>
        <Section style={brand.header}>
          <Text style={brand.brandName}>{BRAND_NAME}</Text>
          <Text style={brand.brandTag}>{BRAND_TAG}</Text>
        </Section>
        <Heading style={brand.h1}>Confirm your email change</Heading>
        <Text style={brand.text}>
          You requested to change your email address for {siteName} from{' '}
          <Link href={`mailto:${oldEmail}`} style={brand.link}>{oldEmail}</Link> to{' '}
          <Link href={`mailto:${newEmail}`} style={brand.link}>{newEmail}</Link>.
        </Text>
        <Text style={brand.text}>Click the button below to confirm this change:</Text>
        <Button style={brand.button} href={confirmationUrl}>Confirm Email Change</Button>
        <Section style={brand.divider} />
        <Text style={brand.footer}>If you didn't request this change, please secure your account immediately.</Text>
        <Text style={brand.footerBrand}>© {new Date().getFullYear()} Arnil Etrade. All rights reserved.</Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail
