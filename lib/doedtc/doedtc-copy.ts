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
  familyInviteLabel: "Text invite",
  familyInviteQueuedLabel: "Will send after setup",
  familyDobLabel: "Date of birth (optional)",
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
  navTrackers: "Trackers",
  navGuides: "Guides",
  navAccountability: "Accountability",
  navFeedback: "Feedback",
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
  familyAdminBadge: "Admin",
  familyInviteLabel: "Text invite",
  familyInvitingLabel: "Sending…",
  familyInviteSent: "Invite sent.",
  familyPendingLabel: "Invite pending",
  familyActiveLabel: "On Doe",
  familyViewProfileLabel: "View profile",
  familyBackLabel: "Back to your family",
  familyReadOnlyHint: "You can view this profile but not edit it.",
  familyDobLabel: "Date of birth (optional)",
  familyDobHint: "Needed for children 18+ to set sharing preferences.",
  familyRevokeAccessLabel: "Stop sharing my profile",
  familyRevokeAccessHint: "Your household admin will be notified.",
  familyRevokeConfirmLabel: "Yes, stop sharing",
  familyRevokeCancelLabel: "Cancel",
  scheduledTextsTitle: "Scheduled texts",
  scheduledTextsEmpty: "No scheduled texts yet. Ask Doe to text you at a specific time.",
  scheduledTextsCancelLabel: "Cancel",
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
  trackersTitle: "Trackers",
  trackersEmpty: "No trackers yet. Ask Doe in iMessage to track something — like Ozempic shots or daily symptoms.",
  trackersDashboardTitle: "Trackers",
  trackersAddEntryLabel: "Add entry",
  trackersArchiveLabel: "Archive tracker",
  trackersLastEntryLabel: "Last entry",
  trackersNoEntries: "No entries yet.",
  trackersSelectTracker: "Select a tracker",
  guidesTitle: "Guides",
  guidesEmpty: "No guides saved yet. Ask Doe in iMessage for a how-to guide.",
  guidesViewLabel: "Open guide",
  guidesUnsaveLabel: "Remove from profile",
  guidesArchiveLabel: "Archive guide",
  guidesSavedLabel: "Saved to profile",
  accountabilityTitle: "Accountability",
  accountabilityEmpty: "No accountability pacts yet. Text Doe to set up check-ins with a partner or for a family member.",
  accountabilityGoalLabel: "Goal",
  accountabilityCadenceLabel: "Cadence",
  accountabilityStreakLabel: "Streak",
  accountabilityLastCheckInLabel: "Last check-in",
  accountabilitySubjectLabel: "Subject",
  accountabilityPartnerLabel: "Partner",
  accountabilityStatusLabel: "Status",
  accountabilityWithdrawLabel: "Withdraw",
  accountabilityPauseLabel: "Pause",
  accountabilityResumeLabel: "Resume",
  accountabilityOwnerHint: "You set this up — you can pause or withdraw anytime.",
  accountabilityPartnerHint: "You are supporting this goal.",
  feedbackTitle: "Feedback and bugs",
  feedbackEmpty: "No reports yet. Text Doe to send feedback or report a bug.",
  feedbackDashboardTitle: "Open reports",
  feedbackKindFeedback: "Feedback",
  feedbackKindBug: "Bug",
  feedbackStatusOpen: "Open",
  feedbackStatusInProgress: "In progress",
  feedbackStatusResolved: "Resolved",
  feedbackSubmitLabel: "Submit report",
  feedbackTitleLabel: "Title",
  feedbackBodyLabel: "What happened?",
  feedbackKindLabel: "Type",
  feedbackSubmittedTitle: "Report submitted",
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
    "Before we get started:\n\nDoe is an AI health companion that supports your entire health journey.\n\nBy using Doe, you confirm that you are voluntarily sharing information regarding your health. Doe has very strict data-retention policies in place that do not save or sell your data.\n\nIf you are in a mental health crisis or any emergency, call 911 or go to the nearest emergency room. Doe is not a crisis line and is not a substitute for emergency care.\n\nType CONFIRM before moving forward.",
  getStartedIntro: "Get Started with Doe. Tap the link below to set up your profile.",
  profileIntro: "Your Doe profile is ready. Tap the link below to manage appointments, family, and more.",
  profileLinkIntro: "Here's your profile.",
  feedbackLinkIntro: "Track your feedback or bug report here.",
  prepareLinkIntro: "Here's your visit prep summary.",
  guideLinkIntro: "Here's your guide.",
  listenIntro: "Open Listen to record your appointment. Press End call when you're done.",
  careLinkIntro: "Here's your symptom review.",
  allSetMessage:
    "All set! Let's get started. Text your symptoms anytime. Let me know if you want to learn more about what I can do.",
  assessmentIntro: "Here's what I found based on what you shared:",
  workIntro: "Here's what I found in the browser.",
  screenshotIntro: "Here's a screenshot of the page.",
  vaultIntro: "Use this secure page to sign in. Doe never stores your password in iMessage.",
  liveViewIntro: "Open Live View to sign in yourself. Doe will keep the session ready afterward.",
  sessionIntro: "Watch Doe work live — browser and tasks in one place.",
  browserConfirmPrompt: "Reply CONFIRM to proceed, or STOP to cancel.",
  familyInviteIntro: "You're invited to join a family on Doe. Tap the link to set up your profile.",
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

export const DOEDTC_LINK_PREVIEW_IMAGE = {
  width: 2400,
  height: 1260,
} as const;

export function doeDtcLinkPreviewImageUrl(): string {
  return (
    process.env.DOEDTC_LINK_PREVIEW_IMAGE_URL?.trim() ||
    `${doeDtcPublicOrigin()}/images/doe-link-banner.jpg`
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

export function doeDtcAppUrl(
  token: string,
  options?: { tab?: string; artifact?: string; member?: string },
): string {
  const url = new URL(`${doeDtcPublicOrigin()}${DOEDTC_PATH}/app`);
  url.searchParams.set("t", token);
  if (options?.tab) url.searchParams.set("tab", options.tab);
  if (options?.artifact) url.searchParams.set("artifact", options.artifact);
  if (options?.member) url.searchParams.set("member", options.member);
  return url.toString();
}

export function doeDtcJoinFamilyUrl(inviteToken: string): string {
  return `${doeDtcPublicOrigin()}${DOEDTC_PATH}/join-family?i=${encodeURIComponent(inviteToken)}`;
}

export const DOEDTC_JOIN_FAMILY = {
  title: "Join your family on Doe",
  subtitle: "Set up your profile to share health info with your household.",
  invalidInviteTitle: "Invite unavailable",
  invalidInviteBody: "This invite link is invalid or expired. Ask your family admin to send a new one.",
  consentTitle: "Sharing preferences",
  consentSubtitle: "You're 18 or older. Choose what your household can see and edit.",
  shareHealthLabel: "Share health info",
  allowEditsLabel: "Allow family to edit your profile",
  consentAllLabel: "Yes — everyone",
  consentNoneLabel: "No",
  consentCertainLabel: "Certain members",
  consentMembersLabel: "Choose members",
  submitLabel: "Join family",
  submittingLabel: "Saving…",
  allSetTitle: "Almost there",
  allSetBody: "Open Messages. Doe sent a confirmation. Type CONFIRM to finish.",
  openMessagesLabel: "Open Messages",
} as const;

export function doeDtcPrepareUrl(
  token: string,
  options?: { preparation?: string },
): string {
  const url = new URL(`${doeDtcPublicOrigin()}${DOEDTC_PATH}/prepare`);
  url.searchParams.set("t", token);
  if (options?.preparation) url.searchParams.set("p", options.preparation);
  return url.toString();
}

export function doeDtcGuideUrl(token: string, options?: { guide?: string }): string {
  const url = new URL(`${doeDtcPublicOrigin()}${DOEDTC_PATH}/guide`);
  url.searchParams.set("t", token);
  if (options?.guide) url.searchParams.set("g", options.guide);
  return url.toString();
}

export function doeDtcViewUrl(): string {
  return `${doeDtcPublicOrigin()}${DOEDTC_PATH}/view`;
}

export function doeDtcFeedbackUrl(
  token: string,
  options?: { ticket?: string },
): string {
  const url = new URL(`${doeDtcPublicOrigin()}${DOEDTC_PATH}/feedback`);
  url.searchParams.set("t", token);
  if (options?.ticket) url.searchParams.set("ticket", options.ticket);
  return url.toString();
}

export function doeDtcListenUrl(careToken: string, sessionId: string): string {
  return `${doeDtcPublicOrigin()}${DOEDTC_PATH}/listen?t=${encodeURIComponent(careToken)}&s=${encodeURIComponent(sessionId)}`;
}

export function doeDtcWorkUrl(workToken: string): string {
  return `${doeDtcPublicOrigin()}${DOEDTC_PATH}/work?t=${encodeURIComponent(workToken)}`;
}

export function doeDtcVaultUrl(vaultToken: string): string {
  return `${doeDtcPublicOrigin()}${DOEDTC_PATH}/vault?t=${encodeURIComponent(vaultToken)}`;
}

export function doeDtcSessionUrl(careToken: string): string {
  return `${doeDtcPublicOrigin()}${DOEDTC_PATH}/session?t=${encodeURIComponent(careToken)}`;
}

export const DOEDTC_PREPARE = {
  pageTitle: "Visit prep",
  subtitle: "Share this summary with your provider.",
  codeBannerTitle: "Provider code",
  codeBannerBody: "Give this 5-digit code to your provider. They can enter it at doe.care/doedtc/view on their phone.",
  invalidTokenTitle: "Prep unavailable",
  invalidTokenBody: "Complete Get Started in iMessage to access visit prep.",
  emptyTitle: "Nothing to show yet",
  emptyBody: "Ask Doe to prepare again once you've added meds, symptoms, or trackers.",
} as const;

export const DOEDTC_GUIDE = {
  pageTitle: "Guide",
  subtitle: "A visual how-to from Doe.",
  invalidTokenTitle: "Guide unavailable",
  invalidTokenBody: "Complete Get Started in iMessage to access your guides.",
  saveLabel: "Save to profile",
  savingLabel: "Saving…",
  savedLabel: "Saved to profile",
  openInAppLabel: "Open in profile",
  archiveLabel: "Archive guide",
} as const;

export const DOEDTC_VIEW = {
  pageTitle: "View patient summary",
  subtitle: "Enter the 5-digit code the patient shared with you.",
  codeLabel: "Provider code",
  codePlaceholder: "12345",
  submitLabel: "View summary",
  invalidCodeTitle: "Code not found",
  invalidCodeBody: "That code is invalid or expired. Ask the patient for a fresh code from Doe.",
  expiredTitle: "Summary expired",
  expiredBody: "This summary expired. Ask the patient to prepare a new one in iMessage.",
} as const;

export const DOEDTC_FEEDBACK = {
  pageTitle: "Feedback and bugs",
  subtitle: "Track feedback and bug reports you send to Doe.",
  invalidTokenTitle: "Reports unavailable",
  invalidTokenBody: "Complete Get Started in iMessage to view your reports.",
} as const;

export const DOEDTC_WORK = {
  pageTitle: "Browser preview",
  invalidTitle: "Preview unavailable",
  invalidBody: "This preview link expired. Ask Doe to browse again.",
  captionFallback: "Browser snapshot",
} as const;

export const DOEDTC_VAULT = {
  pageTitle: "Secure sign-in",
  invalidTitle: "Sign-in unavailable",
  invalidBody: "This sign-in link expired. Ask Doe to try again.",
  hostLabel: "Site",
  usernameLabel: "Username",
  passwordLabel: "Password",
  submitLabel: "Save and sign in",
  submittingLabel: "Signing in…",
  successTitle: "Saved",
  successBody: "Doe will try signing in once. Check iMessage for next steps.",
  errorGeneric: "Something went wrong. Please try again.",
} as const;

export const DOEDTC_SESSION = {
  pageTitle: "Live session",
  invalidTitle: "Session unavailable",
  invalidBody: "This session link isn't valid. Text Doe to get a new one.",
  emptyTitle: "Nothing running right now",
  emptyBody: "When Doe is browsing or working on something, you'll see it here live.",
  liveLabel: "Live browser",
  tasksLabel: "What Doe is doing",
  statusActive: "Active",
  statusPending: "Queued",
  statusWaiting: "Waiting",
} as const;

export function doeDtcAppointmentsUrl(token: string): string {
  return `${doeDtcPublicOrigin()}${DOEDTC_PATH}/app?t=${encodeURIComponent(token)}&tab=appointments`;
}

export function doeDtcMessagesDeepLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `sms:${digits}&body=${encodeURIComponent("Hi Doe")}`;
}
