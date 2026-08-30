import { DOEDTC_PATH, primarySiteOrigin } from "@/lib/site-domains";

export const DOEDTC_PAGE_TITLE = "Doe";
export const DOEDTC_PAGE_DESCRIPTION =
  "Your health AI companion over iMessage. Text Doe to get started.";

export const DOEDTC_LANDING = {
  eyebrow: "Health AI companion",
  headline: "Meet Doe.",
  subhead:
    "A personal health companion you can text on iMessage. Share symptoms, get clinical evidence, and understand what might be going on in plain language.",
  phoneLabel: "Your phone number",
  phonePlaceholder: "(555) 555-0100",
  submitLabel: "Text me to start",
  submittingLabel: "Sending…",
  successTitle: "Check iMessage",
  successBody: "Doe just texted you. Reply Hi Doe to get your Get Started link.",
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
  allSetTitle: "Almost there",
  allSetBody:
    "Open Messages. Doe sent a confirmation. Type CONFIRM to finish and start using Doe.",
  openMessagesLabel: "Open Messages",
  openProfileLabel: "Open your profile",
  familySectionTitle: "Family (optional)",
  familySectionHint: "Add people you care for. You can skip and add them later.",
  familyNameLabel: "Name",
  familyRelationshipLabel: "Relationship",
  familyPhoneLabel: "Phone (optional)",
  familyNoPhoneLabel: "No number",
  familyAddLabel: "Add person",
  medicalSectionTitle: "Medical info",
  medicalNowLabel: "Add now",
  medicalLaterLabel: "Add later",
  medicalLaterHint: "You can add medications and conditions from your profile dashboard.",
} as const;

export const DOEDTC_PROFILE = {
  pageTitle: "Your profile",
  navDashboard: "Dashboard",
  navAppointments: "Appointments",
  navResults: "Results",
  navConditions: "Conditions",
  navFamily: "Family",
  navLocker: "Locker",
  navShare: "Share",
  invalidTokenTitle: "Profile unavailable",
  invalidTokenBody: "Complete Get Started in iMessage to access your profile.",
  dashboardWhyLabel: "Why Doe",
  dashboardMedicalLabel: "Medical info",
  dashboardMedicalDeferred: "You chose to add medical info later.",
  dashboardAddMedical: "Add medical info",
  conditionsTitle: "Conditions",
  symptomsBoxTitle: "Symptoms",
  dashboardSymptomsEmpty: "No symptoms logged yet. Text Doe in iMessage.",
  dashboardIntegrationsLabel: "Integrations",
  whoopTitle: "Whoop",
  whoopBody: "Connect your Whoop band to share recovery and strain with Doe.",
  appleHealthTitle: "Apple Health",
  appleHealthBody: "Apple Health requires the Doe app. Save your interest here for now.",
  connectLabel: "Connect",
  pendingLabel: "Pending",
  connectedLabel: "Connected",
  appointmentsTitle: "Appointment log",
  appointmentsEmpty: "No appointments yet. Add your next visit.",
  appointmentTitleLabel: "Title",
  appointmentWhenLabel: "Date & time",
  appointmentLocationLabel: "Location (optional)",
  appointmentNotesLabel: "Notes (optional)",
  addAppointmentLabel: "Add appointment",
  listenSectionTitle: "Listen recordings",
  listenSectionEmpty: "No Listen recordings yet. Text Doe to start a Listen session.",
  listenDurationLabel: "Duration",
  listenViewTranscript: "View transcript",
  listenHideTranscript: "Hide transcript",
  listenLinkedTo: "Linked to appointment",
  resultsTitle: "Results log",
  resultsEmpty: "No results yet. Add labs or imaging when you have them.",
  resultTitleLabel: "Title",
  resultDateLabel: "Date",
  resultSourceLabel: "Source (optional)",
  resultSummaryLabel: "Summary (optional)",
  addResultLabel: "Add result",
  familyTitle: "Family",
  familyEmpty: "No family members yet.",
  lockerTitle: "Locker",
  lockerHint: "Doe will never ask for these in iMessage.",
  lockerEmpty: "No saved credentials yet.",
  lockerLabelField: "Site or app",
  lockerUsernameField: "Username",
  lockerPasswordField: "Password",
  lockerSavedPassword: "••••••••",
  addLockerLabel: "Save credential",
  shareTitle: "Share with your physician",
  shareBody: "Generate a short code to show your physician. They can enter it in Doe when redeem is available.",
  shareGenerateLabel: "Generate code",
  shareRevokeLabel: "Revoke",
  shareExpiresLabel: "Expires",
  shareEmpty: "No active share codes.",
  removeLabel: "Remove",
  saveLabel: "Save",
  savingLabel: "Saving…",
} as const;

export const DOEDTC_LISTEN = {
  pageTitle: "Listen",
  subtitle: "Record your medical appointment. Doe will transcribe it when you end the call.",
  invalidTokenTitle: "Session unavailable",
  invalidTokenBody: "Text Doe in iMessage to start a new Listen session.",
  recordLabel: "Record",
  listeningLabel: "Listening",
  endCallLabel: "End call",
  buildingLabel: "Building transcription…",
  savedTitle: "Transcript saved",
  savedBody: "Find this recording under Appointments in your profile.",
  openProfileLabel: "Open Appointments",
  errorGeneric: "Something went wrong. Try again or text Doe for a new link.",
  micDenied: "Microphone access is required to record.",
  maxDurationHint: "Recordings are limited to 60 minutes.",
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
  symptomLogLabel: "Recent symptoms",
  symptomLogEmpty: "No symptoms logged yet. Text Doe in iMessage to start tracking.",
  severityLabel: "Severity",
} as const;

export const DOEDTC_LINQ = {
  helloMessage:
    "Hey, I'm Doe, your health companion. Reply Hi Doe when you're ready to get started.",
  consentMessage:
    "Before we get started: Doe is an AI health companion that supports your entire health journey. However, by using Doe, you confirm that you are voluntarily sharing information regarding your health. Doe has very strict data-retention policies in place that do not save or sell your data. Type CONFIRM before moving forward.",
  getStartedIntro: "Get Started with Doe. Tap the link below to set up your profile.",
  profileIntro: "Your Doe profile is ready. Tap the link below to manage appointments, family, and more.",
  profileLinkIntro: "Here's your profile.",
  listenIntro: "Open Listen to record your appointment. Press End call when you're done.",
  careLinkIntro: "Here's your symptom review.",
  allSetMessage: "All set! Let's get started. Text your symptoms anytime.",
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

export function doeDtcAppUrl(token: string): string {
  return `${doeDtcPublicOrigin()}${DOEDTC_PATH}/app?t=${encodeURIComponent(token)}`;
}

export function doeDtcListenUrl(careToken: string, sessionId: string): string {
  return `${doeDtcPublicOrigin()}${DOEDTC_PATH}/listen?t=${encodeURIComponent(careToken)}&s=${encodeURIComponent(sessionId)}`;
}

export function doeDtcAppointmentsUrl(token: string): string {
  return `${doeDtcPublicOrigin()}${DOEDTC_PATH}/app?t=${encodeURIComponent(token)}&tab=appointments`;
}

export function doeDtcMessagesDeepLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `sms:${digits}&body=${encodeURIComponent("Hi Doe")}`;
}
