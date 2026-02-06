import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Preview,
  Img,
} from "@react-email/components";
import type { ChatReportEmailProps } from "../model/interface";

export function ChatReportEmail({ data }: ChatReportEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Chat Report - Order #{data.orderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Lorent Bloom</Text>
            <Text style={headerSubtitle}>Chat Report</Text>
          </Section>

          <Section style={content}>
            <Section style={alertBox}>
              <Text style={alertTitle}>New Chat Report Submitted</Text>
              <Text style={alertText}>Report ID: {data.reportId}</Text>
            </Section>

            <Section style={infoBox}>
              <Text style={sectionTitle}>Order Information</Text>
              <Text style={infoText}>
                <strong>Order ID:</strong> {data.orderId}
              </Text>
              <Text style={infoText}>
                <strong>Owner:</strong> {data.ownerName} ({data.ownerEmail})
              </Text>
              <Text style={infoText}>
                <strong>Customer:</strong> {data.receiverName} (
                {data.receiverEmail})
              </Text>
              <Text style={infoText}>
                <strong>Current Step:</strong> {data.currentStepName || "None"}
              </Text>
            </Section>

            <Section style={infoBox}>
              <Text style={sectionTitle}>Reported By</Text>
              <Text style={infoText}>
                <strong>Email:</strong> {data.reporterEmail}
              </Text>
              <Text style={infoText}>
                <strong>Role:</strong>{" "}
                {data.reporterRole === "owner" ? "Owner" : "Customer"}
              </Text>
            </Section>

            <Section style={descriptionBox}>
              <Text style={sectionTitle}>Problem Description</Text>
              <Text style={descriptionText}>{data.problemDescription}</Text>
            </Section>

            <Hr style={hr} />

            <Section>
              <Text style={sectionTitle}>Order Progress</Text>
              {data.flowProgress.length > 0 ? (
                data.flowProgress.map((progress, index) => (
                  <Section key={index} style={stepBox}>
                    <Text style={stepTitle}>
                      {index + 1}. {progress.stepName}
                    </Text>
                    <Text style={stepMeta}>
                      Completed:{" "}
                      {new Date(progress.completedAt).toLocaleString()}
                    </Text>
                    {progress.imageUrls.length > 0 && (
                      <Section style={imageGrid}>
                        {progress.imageUrls.map((url, imgIndex) => (
                          <Img
                            key={imgIndex}
                            src={url}
                            alt={`Step ${index + 1} image ${imgIndex + 1}`}
                            style={thumbnail}
                          />
                        ))}
                      </Section>
                    )}
                  </Section>
                ))
              ) : (
                <Text style={noContent}>No steps completed yet</Text>
              )}
            </Section>

            <Hr style={hr} />

            <Section>
              <Text style={sectionTitle}>
                Conversation History ({data.messages.length} messages)
              </Text>
              {data.messages.map((msg, index) => (
                <Section
                  key={index}
                  style={msg.isSystemMessage ? systemMessageBox : messageBox}
                >
                  <Text style={messageMeta}>
                    <strong>
                      {msg.isSystemMessage
                        ? "System"
                        : msg.senderRole === "owner"
                          ? "Owner"
                          : "Customer"}
                    </strong>
                    {" - "}
                    {new Date(msg.timestamp).toLocaleString()}
                    {msg.stepName && ` (Step: ${msg.stepName})`}
                  </Text>
                  {msg.content && (
                    <Text style={messageContent}>{msg.content}</Text>
                  )}
                  {msg.imageUrls.length > 0 && (
                    <Section style={imageGrid}>
                      {msg.imageUrls.map((url, imgIndex) => (
                        <Img
                          key={imgIndex}
                          src={url}
                          alt={`Message image ${imgIndex + 1}`}
                          style={thumbnail}
                        />
                      ))}
                    </Section>
                  )}
                </Section>
              ))}
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              This is an automated report from Lorent Bloom chat system.
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
  maxWidth: "700px",
};

const header = {
  padding: "24px",
  backgroundColor: "#dc2626",
};

const logo = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
  margin: "0",
};

const headerSubtitle = {
  color: "#fecaca",
  fontSize: "14px",
  textAlign: "center" as const,
  margin: "4px 0 0 0",
};

const content = {
  padding: "24px",
};

const alertBox = {
  backgroundColor: "#fef2f2",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "24px",
  borderLeft: "4px solid #dc2626",
};

const alertTitle = {
  fontSize: "16px",
  fontWeight: "600" as const,
  color: "#991b1b",
  margin: "0 0 4px 0",
};

const alertText = {
  fontSize: "14px",
  color: "#991b1b",
  margin: "0",
};

const infoBox = {
  backgroundColor: "#f4f4f5",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
};

const sectionTitle = {
  fontSize: "16px",
  fontWeight: "600" as const,
  margin: "0 0 12px 0",
};

const infoText = {
  fontSize: "14px",
  margin: "4px 0",
};

const descriptionBox = {
  backgroundColor: "#fefce8",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "24px",
  borderLeft: "4px solid #eab308",
};

const descriptionText = {
  fontSize: "14px",
  whiteSpace: "pre-wrap" as const,
  margin: "0",
};

const stepBox = {
  backgroundColor: "#f0fdf4",
  borderRadius: "8px",
  padding: "12px",
  marginBottom: "8px",
};

const stepTitle = {
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 4px 0",
};

const stepMeta = {
  fontSize: "12px",
  color: "#71717a",
  margin: "0",
};

const messageBox = {
  backgroundColor: "#f4f4f5",
  borderRadius: "8px",
  padding: "12px",
  marginBottom: "8px",
};

const systemMessageBox = {
  backgroundColor: "#eff6ff",
  borderRadius: "8px",
  padding: "12px",
  marginBottom: "8px",
  borderLeft: "3px solid #3b82f6",
};

const messageMeta = {
  fontSize: "12px",
  color: "#71717a",
  margin: "0 0 4px 0",
};

const messageContent = {
  fontSize: "14px",
  margin: "0",
};

const imageGrid = {
  marginTop: "8px",
};

const thumbnail = {
  width: "80px",
  height: "80px",
  objectFit: "cover" as const,
  borderRadius: "4px",
  marginRight: "8px",
  marginBottom: "8px",
};

const noContent = {
  fontSize: "14px",
  color: "#71717a",
  fontStyle: "italic" as const,
};

const hr = {
  borderColor: "#e4e4e7",
  margin: "24px 0",
};

const footer = {
  color: "#71717a",
  fontSize: "12px",
  textAlign: "center" as const,
};
