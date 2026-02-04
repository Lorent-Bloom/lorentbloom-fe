export interface FlowStepEmailProps {
  recipientName: string;
  orderNumber: string;
  stepName: string;
  stepDescription: string;
  actionRequired?: string;
  siteUrl: string;
  locale: string;
}

export interface SendNotificationInput {
  to: string;
  recipientName: string;
  orderNumber: string;
  stepKey: string;
  stepName: string;
  stepDescription?: string;
  actionRequired?: string;
  locale: string;
}

export interface ChatReportEmailData {
  reportId: string;
  orderId: string;
  reporterEmail: string;
  reporterRole: "owner" | "receiver";
  ownerEmail: string;
  ownerName: string;
  receiverEmail: string;
  receiverName: string;
  problemDescription: string;
  messages: Array<{
    senderRole: "owner" | "receiver" | "system";
    content: string | null;
    imageUrls: string[];
    timestamp: string;
    isSystemMessage: boolean;
    stepName?: string;
  }>;
  flowProgress: Array<{
    stepName: string;
    completedAt: string;
    imageUrls: string[];
  }>;
  currentStepName: string | null;
  siteUrl: string;
}

export interface ChatReportEmailProps {
  data: ChatReportEmailData;
}

export interface SendChatReportInput {
  to: string;
  data: ChatReportEmailData;
}

// Contract Signing Email Types
export interface ContractSigningRequestEmailProps {
  recipientName: string;
  orderNumber: string;
  renterName: string;
  productName: string;
  signUrl: string;
  siteUrl: string;
}

export interface ContractSignedEmailProps {
  recipientName: string;
  orderNumber: string;
  ownerName: string;
  renterName: string;
  productName: string;
  downloadUrl?: string;
  siteUrl: string;
}

export interface SendContractSigningRequestInput {
  to: string;
  recipientName: string;
  orderNumber: string;
  renterName: string;
  productName: string;
  locale: string;
}

export interface SendContractSignedInput {
  to: string;
  recipientName: string;
  orderNumber: string;
  ownerName: string;
  renterName: string;
  productName: string;
  downloadUrl?: string;
}

// Contact Form Email Types
export interface ContactFormEmailProps {
  senderName: string;
  senderEmail: string;
  message: string;
  siteUrl: string;
}

export interface SendContactFormInput {
  to: string;
  senderName: string;
  senderEmail: string;
  message: string;
}
