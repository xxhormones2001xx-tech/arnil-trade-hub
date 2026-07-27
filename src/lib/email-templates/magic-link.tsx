import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from '@react-email/components'
import { brand, BRAND_NAME, BRAND_TAG } from './_brand'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({ siteName, confirmationUrl }: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your login link for {siteName}</Preview>
    <Body style={brand.main}>
      <Container style={brand.container}>
        <Section style={brand.header}>
          <Text style={brand.brandName}>{BRAND_NAME}</Text>
          <Text style={brand.brandTag}>{BRAND_TAG}</Text>
        </Section>
        <Heading style={brand.h1}>Your login link</Heading>
        <Text style={brand.text}>
          Click below to log in to {siteName}. This link expires shortly for your security.
        </Text>
        <Button style={brand.button} href={confirmationUrl}>Log In</Button>
        <Section style={brand.divider} />
        <Text style={brand.footer}>If you didn't request this link, you can safely ignore this email.</Text>
        <Text style={brand.footerBrand}>© {new Date().getFullYear()} Arnil Etrade. All rights reserved.</Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail
