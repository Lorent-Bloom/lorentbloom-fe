import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components";
import type { ContractSignedEmailProps } from "../model/interface";

export function ContractSignedEmail({
  recipientName,
  orderNumber,
  ownerName,
  renterName,
  productName,
  downloadUrl,
  siteUrl,
}: ContractSignedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Contract Signed - Order #{orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Minimum</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hello {recipientName},</Text>

            <Section style={successBox}>
              <Text style={successIcon}>✓</Text>
              <Text style={successTitle}>Contract Signed Successfully</Text>
              <Text style={successText}>
                The rental contract for order #{orderNumber} has been signed by
                both parties.
              </Text>
            </Section>

            <Section style={detailsBox}>
              <Text style={detailsTitle}>Contract Details</Text>
              <Text style={detailRow}>
                <strong>Order Number:</strong> #{orderNumber}
              </Text>
              <Text style={detailRow}>
                <strong>Owner:</strong> {ownerName}
              </Text>
              <Text style={detailRow}>
                <strong>Renter:</strong> {renterName}
              </Text>
              <Text style={detailRow}>
                <strong>Product:</strong> {productName}
              </Text>
            </Section>

            <Text style={paragraph}>
              A copy of the signed contract is attached to this email and can
              also be downloaded from your account.
            </Text>

            {downloadUrl && (
              <Button style={button} href={downloadUrl}>
                Download Signed Contract
              </Button>
            )}

            <Hr style={hr} />

            <Text style={paragraph}>
              <strong>What&apos;s next?</strong>
            </Text>
            <Text style={listItem}>• Keep this contract for your records</Text>
            <Text style={listItem}>
              • Coordinate the product handover with the other party
            </Text>
            <Text style={listItem}>
              • Use the chat feature if you need to communicate
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              If you have any questions about this rental, please contact our
              support team.
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

const greeting = {
  fontSize: "18px",
  lineHeight: "28px",
  marginBottom: "16px",
};

const successBox = {
  backgroundColor: "#dcfce7",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "24px",
  textAlign: "center" as const,
  borderLeft: "4px solid #22c55e",
};

const successIcon = {
  fontSize: "32px",
  color: "#22c55e",
  margin: "0 0 8px 0",
};

const successTitle = {
  fontSize: "18px",
  fontWeight: "600" as const,
  color: "#166534",
  margin: "0 0 8px 0",
};

const successText = {
  fontSize: "14px",
  color: "#166534",
  margin: "0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  marginBottom: "16px",
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

const listItem = {
  fontSize: "14px",
  margin: "8px 0",
  color: "#3f3f46",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "14px 24px",
  marginTop: "16px",
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
