import { Body, Container, Head, Heading, Html, Preview, Row, Column, Text, Hr } from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  accountType?: string;
  planName?: string;
  amount?: string;
  status?: string;
}

const Email = ({ firstName, lastName, email, phone, country, accountType, planName, amount, status }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New Arnil Etrade account application</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>New account application</Heading>
        <Text style={text}>A user submitted an account application on Arnil Etrade.</Text>
        <Hr style={hr} />
        <Row style={row}>
          <Column style={labelCol}>Name</Column>
          <Column style={valueCol}>{firstName ?? ""} {lastName ?? ""}</Column>
        </Row>
        <Row style={row}>
          <Column style={labelCol}>Email</Column>
          <Column style={valueCol}>{email ?? "N/A"}</Column>
        </Row>
        <Row style={row}>
          <Column style={labelCol}>Phone</Column>
          <Column style={valueCol}>{phone ?? "N/A"}</Column>
        </Row>
        <Row style={row}>
          <Column style={labelCol}>Country</Column>
          <Column style={valueCol}>{country ?? "N/A"}</Column>
        </Row>
        <Row style={row}>
          <Column style={labelCol}>Account type</Column>
          <Column style={valueCol}>{accountType ?? "N/A"}</Column>
        </Row>
        <Row style={row}>
          <Column style={labelCol}>Plan</Column>
          <Column style={valueCol}>{planName ?? "N/A"}</Column>
        </Row>
        <Row style={row}>
          <Column style={labelCol}>Amount paid</Column>
          <Column style={valueCol}>{amount ?? "$0"}</Column>
        </Row>
        <Row style={row}>
          <Column style={labelCol}>Status</Column>
          <Column style={valueCol}>{status ?? "pending"}</Column>
        </Row>
        <Text style={footer}>Arnil Etrade · 403 Cummins Street, Franklin, Tennessee 37064</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: "New Arnil Etrade account application",
  displayName: "Admin Notification",
  previewData: {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    phone: "+1 555 123 4567",
    country: "United States",
    accountType: "Individual brokerage",
    planName: "Instant Access",
    amount: "$50.00",
    status: "paid",
  },
} satisfies TemplateEntry<Props>;

const main = { backgroundColor: "#ffffff", fontFamily: "Inter, Arial, sans-serif" };
const container = { padding: "32px 24px", maxWidth: "520px" };
const heading = { color: "#0f172a", fontSize: "22px", fontWeight: 700, marginBottom: "20px" };
const text = { color: "#334155", fontSize: "15px", lineHeight: "1.6", marginBottom: "16px" };
const row = { marginBottom: "8px" };
const labelCol = { width: "140px", color: "#64748b", fontSize: "14px", verticalAlign: "top" as const };
const valueCol = { color: "#0f172a", fontSize: "14px", fontWeight: 500, verticalAlign: "top" as const };
const hr = { borderColor: "#e2e8f0", margin: "20px 0" };
const footer = { color: "#94a3b8", fontSize: "12px", marginTop: "24px" };
