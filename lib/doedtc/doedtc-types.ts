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
};

export type DoeDtcStartPayload = {
  phone: string;
};
