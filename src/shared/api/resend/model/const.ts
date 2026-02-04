export const RESEND_API_KEY = process.env.RESEND_API_KEY!;

// Use environment variable for EMAIL_FROM, fallback to Resend's test domain for development
// For production, set EMAIL_FROM in .env to your verified domain
export const EMAIL_FROM =
  process.env.EMAIL_FROM || "Minimum <onboarding@resend.dev>";
