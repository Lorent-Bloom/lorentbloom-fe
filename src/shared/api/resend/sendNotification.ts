"use server";

import { resend } from "./client";
import {
  FlowStepEmail,
  ChatReportEmail,
  ContractSigningRequestEmail,
  ContractSignedEmail,
  ContactFormEmail,
} from "./templates";
import { EMAIL_FROM } from "./model/const";
import type {
  SendNotificationInput,
  SendChatReportInput,
  SendContractSigningRequestInput,
  SendContractSignedInput,
  SendContactFormInput,
} from "./model/interface";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://minimum.md";

export async function sendFlowStepNotification(input: SendNotificationInput) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.to,
      subject: `Order #${input.orderNumber}: ${input.stepName}`,
      react: FlowStepEmail({
        recipientName: input.recipientName,
        orderNumber: input.orderNumber,
        stepName: input.stepName,
        stepDescription: input.stepDescription || "",
        actionRequired: input.actionRequired,
        siteUrl: SITE_URL,
        locale: input.locale,
      }),
    });

    if (error) {
      console.error("Failed to send email notification:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendChatReportNotification(input: SendChatReportInput) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.to,
      subject: `[REPORT] Chat Report - Order #${input.data.orderId}`,
      react: ChatReportEmail({ data: input.data }),
    });

    if (error) {
      console.error("Failed to send chat report email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send chat report email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendContractSigningRequest(
  input: SendContractSigningRequestInput,
) {
  try {
    const signUrl = `${SITE_URL}/${input.locale}/sign-contract/${input.orderNumber}`;

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.to,
      subject: `Contract Signature Required - Order #${input.orderNumber}`,
      react: ContractSigningRequestEmail({
        recipientName: input.recipientName,
        orderNumber: input.orderNumber,
        renterName: input.renterName,
        productName: input.productName,
        signUrl,
        siteUrl: SITE_URL,
      }),
    });

    if (error) {
      console.error("Failed to send contract signing request:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send contract signing request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendContractSignedNotification(
  input: SendContractSignedInput,
) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.to,
      subject: `Contract Signed - Order #${input.orderNumber}`,
      react: ContractSignedEmail({
        recipientName: input.recipientName,
        orderNumber: input.orderNumber,
        ownerName: input.ownerName,
        renterName: input.renterName,
        productName: input.productName,
        downloadUrl: input.downloadUrl,
        siteUrl: SITE_URL,
      }),
    });

    if (error) {
      console.error("Failed to send contract signed notification:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send contract signed notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendContactFormNotification(input: SendContactFormInput) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.to,
      replyTo: input.senderEmail,
      subject: `Contact Form: Message from ${input.senderName}`,
      react: ContactFormEmail({
        senderName: input.senderName,
        senderEmail: input.senderEmail,
        message: input.message,
        siteUrl: SITE_URL,
      }),
    });

    if (error) {
      console.error("Failed to send contact form notification:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send contact form notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
