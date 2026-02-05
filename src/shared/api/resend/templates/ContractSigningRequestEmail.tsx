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
import type { ContractSigningRequestEmailProps } from "../model/interface";

export function ContractSigningRequestEmail({
  recipientName,
  orderNumber,
  renterName,
  productName,
  signUrl,
  siteUrl,
}: ContractSigningRequestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Contract Signature Required - Order #{orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Minimum</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hello {recipientName},</Text>

            <Text style={paragraph}>
              A new rental order has been placed and requires your signature to
              confirm the rental agreement.
            </Text>

            <Section style={detailsBox}>
              <Text style={detailsTitle}>Order Details</Text>
              <Text style={detailRow}>
                <strong>Order Number:</strong> #{orderNumber}
              </Text>
              <Text style={detailRow}>
                <strong>Renter:</strong> {renterName}
              </Text>
              <Text style={detailRow}>
                <strong>Product:</strong> {productName}
              </Text>
            </Section>

            <Section style={actionBox}>
              <Text style={actionTitle}>Action Required</Text>
              <Text style={actionText}>
                Please review and sign the rental contract to confirm this
                rental agreement. The renter has already signed the contract.
              </Text>
            </Section>

            <Button style={button} href={signUrl}>
              Sign Contract Now
            </Button>

            <Hr style={hr} />

            <Text style={footer}>
              If you did not list this product for rent or believe this is an
              error, please contact our support team immediately.
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

const actionBox = {
  backgroundColor: "#fef3c7",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "24px",
  borderLeft: "4px solid #f59e0b",
};

const actionTitle = {
  fontSize: "14px",
  fontWeight: "600" as const,
  color: "#92400e",
  margin: "0 0 8px 0",
};

const actionText = {
  fontSize: "14px",
  color: "#92400e",
  margin: "0",
  lineHeight: "22px",
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
