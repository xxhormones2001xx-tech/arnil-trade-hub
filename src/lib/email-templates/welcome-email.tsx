import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  name?: string;
  planName?: string;
}

const Email = ({ name, planName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to Arnil Etrade</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Welcome to Arnil Etrade</Heading>
        <Text style={text}>Hi {name ?? "there"},</Text>
        <Text style={text}>
          Your <strong>{planName ?? "Instant Access"}</strong> application has been received and is being reviewed. Our onboarding team will contact you within one business day.
        </Text>
        <Text style={text}>If you have any questions, reply to this email or WhatsApp us at +1 662 607-1912.</Text>
        <Text style={footer}>Arnil Etrade · 403 Cummins Street, Franklin, Tennessee 37064</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: "Welcome to Arnil Etrade",
  displayName: "Welcome Email",
  previewData: { name: "Jane", planName: "Instant Access" },
} satisfies TemplateEntry<Props>;

const main = { backgroundColor: "#ffffff", fontFamily: "Inter, Arial, sans-serif" };
const container = { padding: "32px 24px", maxWidth: "520px" };
const heading = { color: "#0f172a", fontSize: "22px", fontWeight: 700, marginBottom: "20px" };
const text = { color: "#334155", fontSize: "15px", lineHeight: "1.6", marginBottom: "16px" };
const footer = { color: "#94a3b8", fontSize: "12px", marginTop: "24px" };
