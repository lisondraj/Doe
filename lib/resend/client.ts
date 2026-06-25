import { Resend } from "resend";

let resendClient: Resend | null = null;

/** Server-only Resend client. Set RESEND_API_KEY in Vercel (or .env.local locally). */
export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}
