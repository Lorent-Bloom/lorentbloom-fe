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
import type { FlowStepEmailProps } from "../model/interface";

export function FlowStepEmail({
  recipientName,
  orderNumber,
  stepName,
  stepDescription,
  actionRequired,
  siteUrl,
  locale,
}: FlowStepEmailProps) {
  const orderUrl = `${siteUrl}/${locale}/account/order/view/${orderNumber}`;

  return (
    <Html>
      <Head />
      <Preview>
        Order #{orderNumber}: {stepName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Minimum</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hello {recipientName},</Text>

            <Text style={paragraph}>
              There&apos;s an update on your order <strong>#{orderNumber}</strong>:
            </Text>

            <Section style={stepBox}>
              <Text style={stepTitle}>{stepName}</Text>
              {stepDescription && (
                <Text style={stepDesc}>{stepDescription}</Text>
              )}
            </Section>

            {actionRequired && (
              <Section style={actionBox}>
                <Text style={actionTitle}>Action Required:</Text>
                <Text style={actionText}>{actionRequired}</Text>
              </Section>
            )}

            <Button style={button} href={orderUrl}>
              View Order Details
            </Button>

            <Hr style={hr} />

            <Text style={footer}>
              If you have any questions, please contact our support team.
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

const stepBox = {
  backgroundColor: "#f4f4f5",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "24px",
};

const stepTitle = {
  fontSize: "18px",
  fontWeight: "600" as const,
  margin: "0 0 8px 0",
};

const stepDesc = {
  fontSize: "14px",
  color: "#71717a",
  margin: "0",
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
  margin: "0 0 4px 0",
};

const actionText = {
  fontSize: "14px",
  color: "#92400e",
  margin: "0",
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
  padding: "12px 24px",
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
