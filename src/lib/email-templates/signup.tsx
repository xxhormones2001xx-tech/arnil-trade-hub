import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text,
} from '@react-email/components'
import { brand, BRAND_NAME, BRAND_TAG } from './_brand'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({ siteName, siteUrl, recipient, confirmationUrl }: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email for {siteName}</Preview>
    <Body style={brand.main}>
      <Container style={brand.container}>
        <Section style={brand.header}>
          <Text style={brand.brandName}>{BRAND_NAME}</Text>
          <Text style={brand.brandTag}>{BRAND_TAG}</Text>
        </Section>
        <Heading style={brand.h1}>Confirm your email</Heading>
        <Text style={brand.text}>
          Thanks for signing up for{' '}
          <Link href={siteUrl} style={brand.link}><strong>{siteName}</strong></Link>!
        </Text>
        <Text style={brand.text}>
          Please confirm your email address (
          <Link href={`mailto:${recipient}`} style={brand.link}>{recipient}</Link>) by clicking below:
        </Text>
        <Button style={brand.button} href={confirmationUrl}>Verify Email</Button>
        <Section style={brand.divider} />
        <Text style={brand.footer}>If you didn't create an account, you can safely ignore this email.</Text>
        <Text style={brand.footerBrand}>© {new Date().getFullYear()} Arnil Etrade. All rights reserved.</Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail
