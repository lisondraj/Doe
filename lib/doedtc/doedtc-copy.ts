import { DOEDTC_PATH, primarySiteOrigin } from "@/lib/site-domains";

export const DOEDTC_PAGE_TITLE = "Doe";
export const DOEDTC_PAGE_DESCRIPTION =
  "Your health AI companion over iMessage. Text Doe to get started.";

export const DOEDTC_LANDING = {
  eyebrow: "Health AI companion",
  headline: "Meet Doe.",
  subhead:
    "A personal health companion you can text on iMessage. Share symptoms, get clinical evidence, and understand what might be going on — in plain language.",
  phoneLabel: "Your phone number",
  phonePlaceholder: "(555) 555-0100",
  submitLabel: "Text me to start",
  submittingLabel: "Sending…",
  successTitle: "Check iMessage",
  successBody:
    "Doe just texted you in iMessage. Reply Hi Doe, then type CONFIRM to continue.",
  errorGeneric: "Something went wrong. Please try again.",
} as const;

export const DOEDTC_GET_STARTED = {
  title: "Get Started with Doe",
  subtitle: "Tell us a bit about yourself so Doe can personalize your care.",
  fullNameLabel: "Full name",
  emailLabel: "Email",
  medicationsLabel: "Medications",
  medicationsPlaceholder: "Add a medication",
  conditionsLabel: "Medical conditions",
  conditionsPlaceholder: "Add a condition",
  whyLabel: "Why do you want to use Doe?",
  whyPlaceholder: "Tell us what you're hoping Doe can help with…",
  submitLabel: "Complete setup",
  submittingLabel: "Saving…",
  invalidTokenTitle: "Link expired",
  invalidTokenBody: "Text Hi Doe to your Doe number to get a fresh Get Started link.",
  allSetTitle: "All set!",
  allSetBody: "Let's get started. Open Messages to continue with Doe.",
  openMessagesLabel: "Open Messages",
} as const;

export const DOEDTC_CARE = {
  title: "Your symptom review",
  presentingLabel: "What you shared",
  findingsLabel: "What it might be",
  cantMissLabel: "Can't miss",
  urgencyLabel: "Urgency",
  evidenceLabel: "Clinical evidence",
  disclaimer:
    "Doe is not a doctor and this is not a diagnosis. If you think you're having an emergency, call 911 or go to the nearest emergency room.",
  invalidTokenTitle: "Link unavailable",
  invalidTokenBody: "Text your symptoms to Doe in iMessage to get a fresh care link.",
  noAssessmentTitle: "No assessment yet",
  noAssessmentBody: "Text your symptoms to Doe in iMessage to receive a personalized review.",
} as const;

export const DOEDTC_LINQ = {
  helloMessage: "Hey — I'm Doe, your health companion. Reply Hi Doe when you're ready to get started.",
  consentMessage:
    "Before we get started: Doe is an AI health companion that supports your entire health journey. However, by using Doe, you confirm that you are voluntarily sharing information regarding your health. Doe has very strict data-retention policies in place that do not save or sell your data. Type CONFIRM before moving forward.",
  confirmReminder: "When you're ready, type CONFIRM to continue.",
  getStartedIntro: "Get Started with Doe — tap to set up your profile:",
  allSetMessage: "All set! Let's get started.",
  assessmentIntro: "Here's what I found based on what you shared:",
} as const;

export function doeDtcPublicOrigin(): string {
  return process.env.DOEDTC_PUBLIC_ORIGIN?.replace(/\/$/, "") ?? primarySiteOrigin();
}

export function doeDtcContactCardImageUrl(): string {
  return (
    process.env.DOEDTC_CONTACT_CARD_IMAGE_URL?.trim() ||
    `${doeDtcPublicOrigin()}/images/doe-contact-card.png`
  );
}

/** E.164 sending line for Linq contact card setup. Falls back to the chat from-number. */
export function doeDtcLinqPhoneNumber(fromNumber?: string | null): string | null {
  const configured = process.env.DOEDTC_LINQ_PHONE_NUMBER?.trim();
  if (configured) return configured;
  if (fromNumber?.trim()) return fromNumber.trim();
  return null;
}

export function doeDtcGetStartedUrl(token: string): string {
  return `${doeDtcPublicOrigin()}${DOEDTC_PATH}/get-started?t=${encodeURIComponent(token)}`;
}

export function doeDtcCareUrl(token: string): string {
  return `${doeDtcPublicOrigin()}${DOEDTC_PATH}/care?t=${encodeURIComponent(token)}`;
}

export function doeDtcMessagesDeepLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `sms:${digits}&body=${encodeURIComponent("Hi Doe")}`;
}
