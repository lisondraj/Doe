export type DoeDtcUserStatus =
  | "invited"
  | "pending_confirm"
  | "onboarding"
  | "active"
  | "opted_out";

export type DoeDtcUserRow = {
  id: string;
  created_at: string;
  updated_at: string;
  phone: string;
  full_name: string | null;
  email: string | null;
  why_doe: string | null;
  status: DoeDtcUserStatus;
  onboarding_token: string | null;
  onboarding_token_expires_at: string | null;
  care_token: string;
  linq_chat_id: string | null;
  linq_from_number: string | null;
  medical_deferred?: boolean;
};

export type DoeDtcFamilyRelationship =
  | "grandmother"
  | "grandfather"
  | "mother"
  | "father"
  | "child"
  | "sibling"
  | "partner"
  | "other";

export type DoeDtcFamilyMemberRow = {
  id: string;
  user_id: string;
  full_name: string;
  relationship: DoeDtcFamilyRelationship;
  phone: string | null;
  created_at: string;
};

export type DoeDtcAppointmentRow = {
  id: string;
  user_id: string;
  title: string;
  starts_at: string | null;
  timing_note: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
};

export type DoeDtcResultRow = {
  id: string;
  user_id: string;
  title: string;
  resulted_at: string;
  source: string | null;
  summary: string | null;
  created_at: string;
};

export type DoeDtcLockerItemRow = {
  id: string;
  user_id: string;
  label: string;
  username: string;
  created_at: string;
};

export type DoeDtcHealthProvider = "whoop" | "apple_health";

export type DoeDtcHealthConnectionStatus = "disconnected" | "pending" | "connected";

export type DoeDtcHealthConnectionRow = {
  id: string;
  user_id: string;
  provider: DoeDtcHealthProvider;
  status: DoeDtcHealthConnectionStatus;
  created_at: string;
  updated_at: string;
};

export type DoeDtcShareCodeRow = {
  id: string;
  user_id: string;
  code: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
};

export type DoeDtcFamilyMemberInput = {
  fullName: string;
  relationship: DoeDtcFamilyRelationship;
  phone?: string | null;
  dateOfBirth?: string | null;
  sendInvite?: boolean;
};

export type DoeDtcHouseholdRole = "admin" | "member";

export type DoeDtcHouseholdMemberStatus = "pending" | "active";

export type DoeDtcHouseholdConsentLevel = "all" | "none" | "certain";

export type DoeDtcHouseholdRow = {
  id: string;
  admin_user_id: string;
  created_at: string;
  updated_at: string;
};

export type DoeDtcHouseholdMemberRow = {
  id: string;
  household_id: string;
  user_id: string | null;
  full_name: string;
  relationship: DoeDtcFamilyRelationship;
  phone: string | null;
  date_of_birth: string | null;
  role: DoeDtcHouseholdRole;
  status: DoeDtcHouseholdMemberStatus;
  created_at: string;
  updated_at: string;
};

export type DoeDtcHouseholdInviteRow = {
  id: string;
  household_id: string;
  member_id: string;
  token: string;
  expires_at: string;
  sent_at: string;
  created_at: string;
};

export type DoeDtcHouseholdConsentRow = {
  id: string;
  user_id: string;
  household_id: string;
  share_health: DoeDtcHouseholdConsentLevel;
  allow_edits: DoeDtcHouseholdConsentLevel;
  share_member_ids: string[];
  edit_member_ids: string[];
  access_revoked_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DoeDtcHouseholdMemberAccess = {
  memberId: string;
  userId: string | null;
  canView: boolean;
  canEdit: boolean;
};

export type DoeDtcHouseholdSnapshot = {
  household: DoeDtcHouseholdRow | null;
  members: DoeDtcHouseholdMemberRow[];
  consents: DoeDtcHouseholdConsentRow[];
  memberAccess: DoeDtcHouseholdMemberAccess[];
  isAdmin: boolean;
  viewerMemberId: string | null;
  viewerConsent: DoeDtcHouseholdConsentRow | null;
  viewerMember: DoeDtcHouseholdMemberRow | null;
};

export type DoeDtcListenSessionStatus = "pending" | "completed" | "failed";

export type DoeDtcListenSessionRow = {
  id: string;
  user_id: string;
  appointment_id: string | null;
  status: DoeDtcListenSessionStatus;
  transcript: string | null;
  summary: string | null;
  duration_seconds: number | null;
  completed_at: string | null;
  created_at: string;
};

export type DoeDtcMemoryRow = {
  id: string;
  user_id: string;
  fact: string;
  category: string;
  created_at: string;
};

export type DoeDtcArtifactKind = "log" | "counter" | "checklist" | "score";

export type DoeDtcArtifactLayout = "log" | "series" | "counter" | "checklist" | "score";

export type DoeDtcArtifactBlockKind =
  | "hero"
  | "stats"
  | "chart"
  | "counter"
  | "gauge"
  | "week_grid"
  | "checklist_today"
  | "form"
  | "log"
  | "goal"
  | "callout"
  | "illustration";

export type DoeDtcArtifactBlock = {
  id: string;
  kind: DoeDtcArtifactBlockKind;
  title?: string;
  body?: string;
  tone?: "tip" | "warning" | "info";
  fieldKey?: string;
  fieldLabel?: string;
  preset?: "plate" | "glass" | "scale" | "shot";
  max?: number;
};

export type DoeDtcArtifactFieldType =
  | "text"
  | "number"
  | "select"
  | "date"
  | "datetime"
  | "boolean";

export type DoeDtcArtifactField = {
  key: string;
  label: string;
  type: DoeDtcArtifactFieldType;
  optional?: boolean;
  options?: string[];
};

export type DoeDtcArtifactConfig = {
  fields: DoeDtcArtifactField[];
};

export type DoeDtcArtifactRow = {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  kind: DoeDtcArtifactKind;
  layout: DoeDtcArtifactLayout;
  blocks: DoeDtcArtifactBlock[];
  goal: number | null;
  share_token: string | null;
  shared_at: string | null;
  config: DoeDtcArtifactConfig;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DoeDtcArtifactEntryRow = {
  id: string;
  artifact_id: string;
  user_id: string;
  occurred_at: string;
  values: Record<string, string | number | boolean>;
  created_at: string;
  updated_at: string;
};

export type DoeDtcTicketKind = "feedback" | "bug";

export type DoeDtcTicketStatus = "open" | "in_progress" | "resolved";

export type DoeDtcTicketRow = {
  id: string;
  user_id: string;
  kind: DoeDtcTicketKind;
  title: string;
  body: string;
  status: DoeDtcTicketStatus;
  created_at: string;
  updated_at: string;
};

export type DoeDtcPreparationWidgetKind =
  | "header"
  | "medications"
  | "conditions"
  | "symptoms"
  | "appointments"
  | "results"
  | "family"
  | "notes"
  | "tracker_series"
  | "tracker_log";

export type DoeDtcPreparationWidget = {
  kind: DoeDtcPreparationWidgetKind;
  title: string;
  body?: string;
  items?: string[];
  artifactTitle?: string;
  fieldLabel?: string;
  points?: Array<{ at: string; value: number }>;
};

export type DoeDtcPreparationPayload = {
  title: string;
  reason: string | null;
  generatedAt: string;
  patientName: string | null;
  widgets: DoeDtcPreparationWidget[];
};

export type DoeDtcPreparationRow = {
  id: string;
  user_id: string;
  code: string;
  title: string;
  reason: string | null;
  payload: DoeDtcPreparationPayload;
  expires_at: string;
  created_at: string;
};

export type DoeDtcGuideLayout = "howto" | "schedule" | "checklist" | "explainer" | "comparison";

export type DoeDtcGuideBlockKind =
  | "hero"
  | "steps"
  | "callout"
  | "checklist"
  | "timeline"
  | "dose_card"
  | "site_map"
  | "do_dont"
  | "faq"
  | "facts"
  | "illustration"
  | "disclaimer";

export type DoeDtcGuideBlock = {
  id: string;
  kind: DoeDtcGuideBlockKind;
  title?: string;
  body?: string;
  tone?: "tip" | "warning" | "info";
  steps?: Array<{ title: string; body?: string; duration?: string }>;
  items?: string[] | Array<{ question: string; answer: string }> | Array<{ label: string; value: string }>;
  entries?: Array<{ label: string; detail?: string }>;
  medication?: string;
  dose?: string;
  cadence?: string;
  site?: string;
  sites?: Array<"abdomen" | "thigh" | "arm">;
  dos?: string[];
  donts?: string[];
  preset?: "pen" | "fridge" | "clock" | "rotate";
};

export type DoeDtcGuideRow = {
  id: string;
  user_id: string;
  title: string;
  topic: string;
  layout: DoeDtcGuideLayout;
  blocks: DoeDtcGuideBlock[];
  saved_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DoeDtcAccountabilityPactStatus =
  | "draft"
  | "pending_partner"
  | "active"
  | "paused"
  | "withdrawn"
  | "completed";

export type DoeDtcAccountabilityCadence = "daily" | "weekdays" | "weekly" | "on_demand";

export type DoeDtcAccountabilityMechanics = {
  cadence: DoeDtcAccountabilityCadence;
  timezone: string;
  check_in_hour: number;
  quiet_hours?: { start: number; end: number };
  who_gets_check_in: "subject" | "partner" | "both" | "owner";
  confirmation: "self" | "partner" | "either";
  miss_notify_partner: boolean;
  privacy: "high" | "normal";
};

export type DoeDtcAccountabilityMessagePack = {
  partner_invite: string;
  check_in: string;
  check_in_variants: string[];
  miss: string;
  celebrate: string;
  withdraw: string;
};

export type DoeDtcAccountabilityPactRow = {
  id: string;
  owner_user_id: string;
  subject_user_id: string | null;
  subject_member_id: string | null;
  title: string;
  goal: string;
  status: DoeDtcAccountabilityPactStatus;
  mechanics: DoeDtcAccountabilityMechanics;
  message_pack: DoeDtcAccountabilityMessagePack;
  next_check_in_at: string | null;
  last_check_in_prompt_at: string | null;
  withdrawn_at: string | null;
  withdrawn_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type DoeDtcAccountabilityParticipantRole = "owner" | "subject" | "partner";

export type DoeDtcAccountabilityParticipantStatus = "pending" | "active" | "declined" | "removed";

export type DoeDtcAccountabilityParticipantRow = {
  id: string;
  pact_id: string;
  user_id: string | null;
  household_member_id: string | null;
  phone: string | null;
  full_name: string;
  role: DoeDtcAccountabilityParticipantRole;
  status: DoeDtcAccountabilityParticipantStatus;
  created_at: string;
  updated_at: string;
};

export type DoeDtcAccountabilityEventKind =
  | "check_in"
  | "check_in_prompt"
  | "miss"
  | "invite_sent"
  | "partner_joined"
  | "withdrawn"
  | "paused"
  | "resumed"
  | "note";

export type DoeDtcAccountabilityCheckInOutcome = "yes" | "no" | "skip";

export type DoeDtcAccountabilityEventRow = {
  id: string;
  pact_id: string;
  actor_user_id: string | null;
  kind: DoeDtcAccountabilityEventKind;
  outcome: DoeDtcAccountabilityCheckInOutcome | null;
  body: string | null;
  occurred_at: string;
  created_at: string;
};

export type DoeDtcAccountabilityPactView = {
  pact: DoeDtcAccountabilityPactRow;
  participants: DoeDtcAccountabilityParticipantRow[];
  events: DoeDtcAccountabilityEventRow[];
  streak: number;
  lastEvent: DoeDtcAccountabilityEventRow | null;
  subjectName: string | null;
  viewerRole: DoeDtcAccountabilityParticipantRole | null;
  isOwner: boolean;
};

export type DoeDtcScheduledTextStatus = "pending" | "sent" | "cancelled" | "failed";

export type DoeDtcScheduledTextRow = {
  id: string;
  created_by_user_id: string;
  recipient_user_id: string | null;
  recipient_member_id: string | null;
  recipient_phone: string;
  send_at: string;
  timezone: string;
  intent: string;
  body: string;
  status: DoeDtcScheduledTextStatus;
  sent_at: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
};

export type DoeDtcWorkflowStatus = "active" | "paused" | "cancelled";

export type DoeDtcWorkflowPhase = "scheduled" | "awaiting_reply";

export type DoeDtcWorkflowConfig = {
  cadence: "daily";
  timezone: string;
  check_in_hour: number;
  check_in_body: string;
  subject_phone: string;
  subject_user_id: string | null;
  subject_name: string;
  notify_phone: string;
  notify_user_id: string | null;
  notify_name: string;
  await_timeout_minutes: number;
};

export type DoeDtcWorkflowRow = {
  id: string;
  owner_user_id: string;
  subject_member_id: string | null;
  goal: string;
  config: DoeDtcWorkflowConfig;
  status: DoeDtcWorkflowStatus;
  phase: DoeDtcWorkflowPhase;
  next_run_at: string | null;
  awaiting_from_phone: string | null;
  awaiting_until: string | null;
  correlation_id: string | null;
  created_at: string;
  updated_at: string;
};

export type DoeDtcProfileSnapshot = {
  user: Pick<
    DoeDtcUserRow,
    "id" | "full_name" | "email" | "why_doe" | "medical_deferred" | "care_token"
  >;
  medications: string[];
  conditions: string[];
  familyMembers: DoeDtcFamilyMemberRow[];
  appointments: DoeDtcAppointmentRow[];
  listenSessions: DoeDtcListenSessionRow[];
  results: DoeDtcResultRow[];
  lockerItems: DoeDtcLockerItemRow[];
  healthConnections: DoeDtcHealthConnectionRow[];
  shareCodes: DoeDtcShareCodeRow[];
  symptoms: DoeDtcSymptomRow[];
  assessments: DoeDtcAssessmentRow[];
  artifacts: DoeDtcArtifactRow[];
  artifactEntries: DoeDtcArtifactEntryRow[];
  tickets: DoeDtcTicketRow[];
  household: DoeDtcHouseholdSnapshot;
  accountabilityPacts: DoeDtcAccountabilityPactView[];
  scheduledTexts: DoeDtcScheduledTextRow[];
  workflows: DoeDtcWorkflowRow[];
  guides: DoeDtcGuideRow[];
};

export type DoeDtcMedicationRow = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type DoeDtcConditionRow = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type DoeDtcMessageDirection = "inbound" | "outbound";

export type DoeDtcMessageRow = {
  id: string;
  user_id: string | null;
  direction: DoeDtcMessageDirection;
  body: string;
  linq_message_id: string | null;
  webhook_event_id: string | null;
  created_at: string;
};

export type DoeDtcAssessmentFinding = {
  name: string;
  why: string;
  evidence: string[];
  likelihood: "high" | "moderate" | "low";
};

export type DoeDtcAssessmentResult = {
  presentingSymptoms: string;
  summary: string;
  findings: DoeDtcAssessmentFinding[];
  cantMiss: string[];
  urgency: string;
  disclaimer: string;
};

export type DoeDtcAssessmentRow = {
  id: string;
  user_id: string;
  symptoms_text: string;
  result: DoeDtcAssessmentResult;
  created_at: string;
};

export type DoeDtcSymptomSeverity = "mild" | "moderate" | "severe" | "unknown";

export type DoeDtcSymptomRow = {
  id: string;
  user_id: string;
  reported_at: string;
  raw_text: string;
  summary: string | null;
  severity: DoeDtcSymptomSeverity;
  onset: string | null;
  tags: string[];
  assessment_id: string | null;
  created_at: string;
};

export type DoeDtcOnboardPayload = {
  token: string;
  fullName: string;
  email: string;
  medications: string[];
  conditions: string[];
  whyDoe: string;
  familyMembers?: DoeDtcFamilyMemberInput[];
  medicalDeferred?: boolean;
};

export type DoeDtcProfileTab =
  | "dashboard"
  | "appointments"
  | "results"
  | "conditions"
  | "family"
  | "locker"
  | "share"
  | "trackers"
  | "guides"
  | "accountability"
  | "feedback";

export type DoeDtcBrowserJobStatus =
  | "open"
  | "needs_login"
  | "pending_confirm"
  | "committed"
  | "failed"
  | "cancelled";

export type DoeDtcBrowserMode = "research" | "login" | "write";

export type DoeDtcBrowserShotKind = "progress" | "review" | "result" | "error";

export type DoeDtcBrowserPendingAction = {
  selector: string;
  label: string;
  url?: string;
};

export type DoeDtcBrowserJobRow = {
  id: string;
  user_id: string;
  status: DoeDtcBrowserJobStatus;
  intent: string;
  allowed_host: string | null;
  mode: DoeDtcBrowserMode;
  kernel_session_id: string | null;
  kernel_profile_id: string | null;
  browser_live_view_url: string | null;
  pending_action: DoeDtcBrowserPendingAction | null;
  last_work_token: string | null;
  login_attempts: number;
  confirmed_at: string | null;
  outcome: string | null;
  created_at: string;
  updated_at: string;
};

export type DoeDtcVaultItemRow = {
  id: string;
  user_id: string;
  host: string;
  username: string;
  password_ciphertext: string | null;
  iv: string | null;
  key_version: string | null;
  created_at: string;
  updated_at: string;
};

export type DoeDtcBrowserShotRow = {
  id: string;
  user_id: string;
  job_id: string;
  blob_url: string;
  pathname: string;
  expires_at: string;
  kind: DoeDtcBrowserShotKind;
  caption: string | null;
  created_at: string;
};

export type DoeDtcWorkTokenRow = {
  token: string;
  user_id: string;
  job_id: string;
  shot_id: string | null;
  purpose: "work" | "vault";
  expires_at: string;
  created_at: string;
};

export type DoeDtcWorkPreview = {
  caption: string;
  imageUrl: string;
  jobIntent: string;
  expiresAt: string;
};

export type DoeDtcSessionTaskStatus = "active" | "pending" | "waiting";

export type DoeDtcSessionTask = {
  id: string;
  label: string;
  detail?: string;
  status: DoeDtcSessionTaskStatus;
};

export type DoeDtcSessionPageData = {
  liveViewUrl: string | null;
  browserIntent: string | null;
  browserStatus: DoeDtcBrowserJobStatus | null;
  tasks: DoeDtcSessionTask[];
};

export type DoeDtcStartPayload = {
  phone: string;
};
