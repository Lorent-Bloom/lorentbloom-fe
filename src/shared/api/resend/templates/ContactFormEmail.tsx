import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Preview,
} from "@react-email/components";
import type { ContactFormEmailProps } from "../model/interface";

export function ContactFormEmail({
  senderName,
  senderEmail,
  message,
  siteUrl,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Contact Form Message from {senderName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Minimum</Text>
          </Section>

          <Section style={content}>
            <Text style={title}>New Contact Form Submission</Text>

            <Text style={paragraph}>
              You have received a new message through the contact form.
            </Text>

            <Section style={detailsBox}>
              <Text style={detailsTitle}>Sender Information</Text>
              <Text style={detailRow}>
                <strong>Name:</strong> {senderName}
              </Text>
              <Text style={detailRow}>
                <strong>Email:</strong> {senderEmail}
              </Text>
            </Section>

            <Section style={messageBox}>
              <Text style={messageTitle}>Message</Text>
              <Text style={messageText}>{message}</Text>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              You can reply directly to this email to respond to {senderName}.
            </Text>

            <Text style={footerLink}>
              <a href={siteUrl} style={link}>
                Visit Minimum
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "24px",
  backgroundColor: "#000000",
};

const logo = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
  margin: "0",
};

const content = {
  padding: "24px",
};

const title = {
  fontSize: "20px",
  fontWeight: "600" as const,
  marginBottom: "16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  marginBottom: "24px",
};

const detailsBox = {
  backgroundColor: "#f4f4f5",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "24px",
};

const detailsTitle = {
  fontSize: "16px",
  fontWeight: "600" as const,
  margin: "0 0 12px 0",
};

const detailRow = {
  fontSize: "14px",
  margin: "4px 0",
  color: "#3f3f46",
};

const messageBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "24px",
  borderLeft: "4px solid #3b82f6",
};

const messageTitle = {
  fontSize: "14px",
  fontWeight: "600" as const,
  color: "#1e40af",
  margin: "0 0 8px 0",
};

const messageText = {
  fontSize: "14px",
  color: "#334155",
  margin: "0",
  lineHeight: "22px",
  whiteSpace: "pre-wrap" as const,
};

const hr = {
  borderColor: "#e4e4e7",
  margin: "32px 0",
};

const footer = {
  color: "#71717a",
  fontSize: "14px",
  lineHeight: "24px",
};

const footerLink = {
  marginTop: "16px",
};

const link = {
  color: "#71717a",
  fontSize: "14px",
};
