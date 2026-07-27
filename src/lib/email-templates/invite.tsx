import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text,
} from '@react-email/components'
import { brand, BRAND_NAME, BRAND_TAG } from './_brand'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteName, siteUrl, confirmationUrl }: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to join {siteName}</Preview>
    <Body style={brand.main}>
      <Container style={brand.container}>
        <Section style={brand.header}>
          <Text style={brand.brandName}>{BRAND_NAME}</Text>
          <Text style={brand.brandTag}>{BRAND_TAG}</Text>
        </Section>
        <Heading style={brand.h1}>You've been invited</Heading>
        <Text style={brand.text}>
          You've been invited to join{' '}
          <Link href={siteUrl} style={brand.link}><strong>{siteName}</strong></Link>. Click below to accept and create your account.
        </Text>
        <Button style={brand.button} href={confirmationUrl}>Accept Invitation</Button>
        <Section style={brand.divider} />
        <Text style={brand.footer}>If you weren't expecting this invitation, you can safely ignore this email.</Text>
        <Text style={brand.footerBrand}>© {new Date().getFullYear()} Arnil Etrade. All rights reserved.</Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail
