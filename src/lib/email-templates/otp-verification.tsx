import { Body, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  name?: string;
  code?: string;
  planName?: string;
}

const Email = ({ name, code, planName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Arnil Etrade verification code is {code ?? "000000"}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Verify your Arnil Etrade account</Heading>
        <Text style={text}>Hi {name ?? "there"},</Text>
        <Text style={text}>
          Thank you for choosing the <strong>{planName ?? "Instant Access"}</strong> plan. Use the code below to complete your account verification.
        </Text>
        <Section style={codeBox}>
          <Text style={codeText}>{code ?? "000000"}</Text>
        </Section>
        <Text style={text}>This code expires in 10 minutes. If you did not request this, please ignore this email.</Text>
        <Text style={footer}>Arnil Etrade · 403 Cummins Street, Franklin, Tennessee 37064</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: "Your Arnil Etrade verification code",
  displayName: "OTP Verification",
  previewData: { name: "Jane", code: "123456", planName: "Instant Access" },
} satisfies TemplateEntry<Props>;

const main = { backgroundColor: "#ffffff", fontFamily: "Inter, Arial, sans-serif" };
const container = { padding: "32px 24px", maxWidth: "520px" };
const heading = { color: "#0f172a", fontSize: "22px", fontWeight: 700, marginBottom: "20px" };
const text = { color: "#334155", fontSize: "15px", lineHeight: "1.6", marginBottom: "16px" };
const codeBox = { backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", textAlign: "center" as const };
const codeText = { color: "#0f172a", fontSize: "32px", fontWeight: 700, letterSpacing: "0.15em", margin: 0 };
const footer = { color: "#94a3b8", fontSize: "12px", marginTop: "24px" };
