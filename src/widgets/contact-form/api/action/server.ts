"use server";

import { getSupabaseServerClient } from "@shared/api/supabase";
import { sendContactFormNotification } from "@shared/api/resend/sendNotification";
import { ADMIN_EMAIL } from "@shared/api/resend/model/const";
import { verifyRecaptcha } from "@shared/lib/recaptcha";
import type { SubmitContactFormInput } from "../../model/interface";

async function getAdminEmails(): Promise<string[]> {
  const supabase = await getSupabaseServerClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const { data, error } = await db
    .from("admin_email_config")
    .select("email")
    .eq("is_active", true);

  if (error || !data || data.length === 0) {
    return [ADMIN_EMAIL];
  }

  return data.map((row: { email: string }) => row.email);
}

export async function submitContactForm(
  input: SubmitContactFormInput,
  recaptchaToken: string,
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const recaptchaResult = await verifyRecaptcha(recaptchaToken, "contact_form");
    if (!recaptchaResult.success) {
      return { success: false, error: recaptchaResult.error };
    }

    const adminEmails = await getAdminEmails();

    if (adminEmails.length === 0) {
      console.error("No admin emails configured");
      return { success: false, error: "Unable to send message. Please try again later." };
    }

    await Promise.all(
      adminEmails.map((email) =>
        sendContactFormNotification({
          to: email,
          senderName: input.name,
          senderEmail: input.email,
          message: input.message,
        })
      )
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to submit contact form:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
