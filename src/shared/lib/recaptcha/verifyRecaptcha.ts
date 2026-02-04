"use server";

import { env } from "@shared/config/env";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MIN_SCORE = 0.5;

interface RecaptchaVerifyResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  "error-codes"?: string[];
}

export async function verifyRecaptcha(
  token: string,
  expectedAction?: string,
): Promise<{ success: boolean; score?: number; error?: string }> {
  try {
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data: RecaptchaVerifyResponse = await response.json();

    if (!data.success) {
      return { success: false, error: "reCAPTCHA verification failed" };
    }

    if (data.score < MIN_SCORE) {
      return {
        success: false,
        score: data.score,
        error: "reCAPTCHA score too low",
      };
    }

    if (expectedAction && data.action !== expectedAction) {
      return { success: false, error: "reCAPTCHA action mismatch" };
    }

    return { success: true, score: data.score };
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return { success: false, error: "reCAPTCHA verification request failed" };
  }
}
