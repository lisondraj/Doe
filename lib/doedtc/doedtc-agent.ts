import {
  actDoeDtcBrowser,
  getActiveDoeDtcBrowserJobId,
  navigateDoeDtcBrowser,
  requestDoeDtcBrowserCommit,
  requestDoeDtcLiveLogin,
  requestDoeDtcVaultLink,
  snapshotDoeDtcBrowser,
  startDoeDtcBrowserTask,
  toUserSafeBrowserError,
} from "@/lib/doedtc/doedtc-browser";
import {
  addDoeDtcMem0Fact,
  formatMem0Block,
  searchDoeDtcMem0Memories,
} from "@/lib/doedtc/doedtc-memory";
import { doeDtcAppUrl, doeDtcCareUrl, doeDtcListenUrl, doeDtcSessionUrl } from "@/lib/doedtc/doedtc-copy";
import {
  formatDoeDtcAppointmentWhen,
  normalizeDoeDtcAppointmentTiming,
  type DoeDtcAppointmentTimingPrecision,
} from "@/lib/doedtc/doedtc-appointment-timing";
import {
  addDoeDtcAppointment,
  addDoeDtcFamilyMember,
  appendDoeDtcCondition,
  appendDoeDtcMedication,
  createDoeDtcListenSession,
  getDoeDtcProfileSnapshot,
  insertDoeDtcMemory,
  insertDoeDtcSymptom,
  linkDoeDtcSymptomToAssessment,
  listDoeDtcMessages,
  saveDoeDtcAssessment,
} from "@/lib/doedtc/doedtc-db";
import {
  DOEDTC_PROFILE_READ_TABS,
  formatDoeDtcProfileOverview,
  readDoeDtcProfileTab,
} from "@/lib/doedtc/doedtc-profile-read";
import {
  normalizeDoeDtcFamilyRelationship,
  resolveDoeDtcFamilyMemberName,
} from "@/lib/doedtc/doedtc-family-relationship";
import type {
  DoeDtcAppointmentRow,
  DoeDtcAssessmentResult,
  DoeDtcAssessmentRow,
  DoeDtcFamilyMemberRow,
  DoeDtcFamilyRelationship,
  DoeDtcMessageRow,
  DoeDtcProfileTab,
  DoeDtcSymptomRow,
  DoeDtcUserRow,
} from "@/lib/doedtc/doedtc-types";

const DOEDTC_AGENT_MODEL = "gpt-4o";
const DOEDTC_ASSESSMENT_MODEL = "gpt-4o-mini";
const MAX_TOOL_ROUNDS = 8;

export const DOEDTC_AGENT_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "log_symptoms",
      description:
        "Log reported symptoms to the user's symptom history. Call whenever the user describes symptoms, even if also assessing.",
      parameters: {
        type: "object",
        properties: {
          raw_text: { type: "string", description: "What the user reported in their own words." },
          summary: { type: "string", description: "Short clinical summary of the symptom report." },
          severity: {
            type: "string",
            enum: ["mild", "moderate", "severe", "unknown"],
          },
          onset: { type: "string", description: "When symptoms started, if known." },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Short tags like headache, fever, chest pain.",
          },
        },
        required: ["raw_text"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "run_assessment",
      description:
        "Generate a structured clinical review when there is enough information or the user asks what it might be.",
      parameters: {
        type: "object",
        properties: {
          symptoms_text: {
            type: "string",
            description: "Combined symptom narrative to assess.",
          },
          focus: {
            type: "string",
            description: "Optional focus area for the assessment.",
          },
        },
        required: ["symptoms_text"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "log_appointment",
      description:
        "Save a medical appointment. Never invent a date or time. Use approximate when timing is vague (next week, soon). Use day when the user names a specific day without a time. Use exact only when they give date and time.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "What the appointment is for, e.g. Asthma follow-up." },
          timing_precision: {
            type: "string",
            enum: ["exact", "day", "approximate"],
            description:
              "exact = user gave date and time. day = user named a specific day only. approximate = vague window like next week or soon.",
          },
          starts_at: {
            type: "string",
            description:
              "ISO 8601 datetime. Required for exact or day. Omit for approximate — never guess.",
          },
          timing_note: {
            type: "string",
            description:
              "User's exact vague wording, e.g. next week. Required when timing_precision is approximate.",
          },
          location: { type: "string", description: "Clinic or location if known." },
          notes: { type: "string", description: "Any extra context the user shared." },
        },
        required: ["title", "timing_precision"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "log_family_member",
      description:
        "Add a person to the user's Family chart. Call for each named family member. Use relationship child for sons/daughters. If they mention kids without names, still call with full_name Child.",
      parameters: {
        type: "object",
        properties: {
          full_name: { type: "string", description: "The family member's name." },
          relationship: {
            type: "string",
            enum: [
              "grandmother",
              "grandfather",
              "mother",
              "father",
              "child",
              "sibling",
              "partner",
              "other",
            ],
            description: "Use child for son or daughter.",
          },
          phone: { type: "string", description: "Phone number if the user shared one." },
        },
        required: ["full_name", "relationship"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "add_medication",
      description:
        "Add a medication to the user's profile. Call when they mention a medicine they take. Never use remember_fact for medications.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Medication name, e.g. Metformin." },
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "add_condition",
      description:
        "Add a medical condition or diagnosis to the user's profile. Call when they mention a condition they have. Never use remember_fact for conditions.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Condition name, e.g. Asthma." },
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "remember_fact",
      description:
        "Store a durable preference or context (doctor name, travel plans). Not for symptoms, family chart entries, medications, or conditions.",
      parameters: {
        type: "object",
        properties: {
          fact: { type: "string", description: "The fact to remember in plain language." },
          category: {
            type: "string",
            description: "Short category like provider, preference, family, general.",
          },
        },
        required: ["fact"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "start_listen",
      description:
        "Create a Listen session for recording and transcribing a medical visit. You MUST call this before telling the user a Listen link is coming.",
      parameters: {
        type: "object",
        properties: {
          appointment_id: {
            type: "string",
            description: "Optional existing appointment id to link this recording to.",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "send_profile_link",
      description:
        "Send the user's Doe profile link. You MUST call this before telling the user a profile or dashboard link is coming.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "read_profile",
      description:
        "Read a Doe profile tab (dashboard/integrations, appointments, results, conditions, family, locker, share). Use this to answer questions about what is already saved — Whoop, Apple Health, meds, locker sites, results, share codes. Never invent status. This is a read, not an add.",
      parameters: {
        type: "object",
        properties: {
          tab: {
            type: "string",
            enum: [...DOEDTC_PROFILE_READ_TABS],
            description: "Profile tab to read. Use dashboard for Whoop, Apple Health, name, and email.",
          },
        },
        required: ["tab"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "start_browser_task",
      description:
        "Browse the web and screenshot the page. For 'go to Google and type mayo', call once with url google and intent type mayo — do not type into the box yourself. Selector is optional for later typing.",
      parameters: {
        type: "object",
        properties: {
          intent: {
            type: "string",
            description: "What to find or do, e.g. type mayo, search asthma.",
          },
          url: {
            type: "string",
            description: "Site nickname (mayo, google), hostname, or full URL. Optional if intent has the site.",
          },
          mode: { type: "string", enum: ["research", "login", "write"] },
        },
        required: ["intent"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "browser_navigate",
      description: "Navigate the active browser task to a URL or site nickname.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string" },
        },
        required: ["url"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "browser_act",
      description:
        "Click, type, or scroll in the active browser task. For type, selector is optional — Doe finds the search box. Prefer start_browser_task with the query instead of typing on Google.",
      parameters: {
        type: "object",
        properties: {
          action: { type: "string", enum: ["click", "type", "scroll"] },
          selector: { type: "string" },
          text: { type: "string" },
        },
        required: ["action"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "browser_snapshot",
      description:
        "Screenshot the current browser page and send the image to the patient in iMessage. Use when they ask for a screenshot, picture, or to see the page.",
      parameters: {
        type: "object",
        properties: {
          caption: { type: "string" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "request_vault",
      description: "Send a secure vault link so the patient can sign in on the web. Never ask for passwords in iMessage.",
      parameters: {
        type: "object",
        properties: {
          host: { type: "string", description: "Site hostname, e.g. mychart.example.org" },
        },
        required: ["host"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "request_live_login",
      description: "Send a Live View link so the patient can log in themselves.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "show_session",
      description:
        "Send the Doe live session page so the patient can watch the browser work. Use when they ask to watch, stream, see a live session, or follow along — if a browser task is active. Never say you cannot stream. Never send the raw Kernel URL.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "react_to_message",
      description:
        "Rarely react to the patient's latest iMessage with a custom emoji. Use sparingly — not every turn, not for CONFIRM/STOP/Hi Doe. Vary emojis.",
      parameters: {
        type: "object",
        properties: {
          emoji: { type: "string", description: "Single emoji, e.g. 👍, 🙏, 💪" },
        },
        required: ["emoji"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "use_thread_reply",
      description:
        "Occasionally reply in-thread to the patient's latest iMessage (iOS reply-to). Use for direct answers or corrections — not every turn, never for link-only replies.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "request_commit",
      description: "Prepare an irreversible browser action and ask the patient to reply CONFIRM.",
      parameters: {
        type: "object",
        properties: {
          selector: { type: "string" },
          label: { type: "string", description: "Plain-language description of the action." },
          url: { type: "string" },
        },
        required: ["selector", "label"],
      },
    },
  },
];

type ChatMessage =
  | { role: "system" | "user" | "assistant"; content: string }
  | {
      role: "assistant";
      content: string | null;
      tool_calls?: Array<{
        id: string;
        type: "function";
        function: { name: string; arguments: string };
      }>;
    }
  | { role: "tool"; tool_call_id: string; content: string };

export type DoeDtcAgentTurnResult = {
  replyText: string;
  careUrl?: string;
  listenUrl?: string;
  profileUrl?: string;
  workUrl?: string;
  screenshotUrl?: string;
  vaultUrl?: string;
  liveViewUrl?: string;
  sessionUrl?: string;
  reactionEmoji?: string;
  replyToInbound?: boolean;
  browserNeedsConfirm?: boolean;
  assessmentRan: boolean;
};

const URL_IN_TEXT = /https?:\/\/\S+/gi;
const CLOSER_TAIL =
  /(?:\s*[,.!]+\s*)?(?:feel free to (?:ask|let me know|reach out|text|message)(?:\b.{0,80})?|let me know if (?:you(?:'d| would)? (?:like|want|need)|you have |there's ).{0,80}|just let me know(?:\b.{0,60})?|don'?t hesitate to (?:ask|reach out|text).{0,40}|happy to (?:help|chat|look).{0,40}|(?:is there )?anything else I can (?:help|do).{0,40}|what else can I (?:help|do).{0,40})[!?.,]?\s*$/i;
const KEEP_CLOSER_RATE = 0.18;

export function sanitizeDoeDtcReplyText(
  text: string,
  options?: { keepCloserRate?: number },
): string {
  const withoutUrls = text.replace(URL_IN_TEXT, "");
  const stripped = withoutUrls.replace(CLOSER_TAIL, "");
  const rate = options?.keepCloserRate ?? KEEP_CLOSER_RATE;
  const keepCloser = stripped !== withoutUrls && Math.random() < rate;
  return (keepCloser ? withoutUrls : stripped)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[,;]+(?:\s*[.!]*)?\s*$/g, "")
    .trim();
}

function compactTranscript(messages: DoeDtcMessageRow[]): string {
  const lines = messages
    .filter((entry) => entry.body.trim())
    .map((entry) => {
      const speaker = entry.direction === "inbound" ? "User" : "Doe";
      return `${speaker}: ${entry.body.trim()}`;
    });
  const joined = lines.join("\n");
  if (joined.length <= 9000) return joined;
  return joined.slice(joined.length - 9000);
}

function formatSymptomLog(symptoms: DoeDtcSymptomRow[]): string {
  if (symptoms.length === 0) return "No prior symptom logs.";
  return symptoms
    .map((row) => {
      const label = row.summary?.trim() || row.raw_text.trim();
      const parts = [label];
      if (row.severity !== "unknown") parts.push(`severity: ${row.severity}`);
      if (row.onset) parts.push(`onset: ${row.onset}`);
      if (row.tags.length > 0) parts.push(`tags: ${row.tags.join(", ")}`);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

function formatAssessmentHistory(assessments: DoeDtcAssessmentRow[]): string {
  if (assessments.length === 0) return "No prior assessments.";
  return assessments
    .map((row) => `- ${row.result.summary} (reported: ${row.symptoms_text.slice(0, 120)})`)
    .join("\n");
}

function formatAppointmentLog(appointments: DoeDtcAppointmentRow[]): string {
  if (appointments.length === 0) return "No appointments logged.";
  return appointments
    .map((row) => {
      const when = formatDoeDtcAppointmentWhen(row);
      const parts = [`${row.title} | when: ${when}`];
      if (row.timing_note) parts.push("(approximate — do not state as an exact calendar datetime)");
      if (row.location) parts.push(`at ${row.location}`);
      if (row.notes) parts.push(`notes: ${row.notes}`);
      parts.push(`id: ${row.id}`);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

function formatFamilyLog(familyMembers: DoeDtcFamilyMemberRow[]): string {
  if (familyMembers.length === 0) return "No family members logged.";
  return familyMembers
    .map((row) => {
      const parts = [`${row.full_name} (${row.relationship})`];
      if (row.phone) parts.push(`phone: ${row.phone}`);
      parts.push(`id: ${row.id}`);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

function todayLabel(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function replyClaimsListenLink(text: string): boolean {
  return (
    /\b(listen|record(?:ing)?|transcrib(?:e|ing)?)\b/i.test(text) &&
    /\b(link|send(?:ing)?|here'?s)\b/i.test(text)
  );
}

function replyClaimsProfileLink(text: string): boolean {
  return (
    /\b(profile|dashboard|appointments?\s*page)\b/i.test(text) &&
    /\b(link|send(?:ing)?|here'?s)\b/i.test(text)
  );
}

function inboundWantsLiveSession(text: string): boolean {
  return /\b(watch|stream|live(?:\s+(?:view|session|browser|sandbox))?|see (?:the )?(?:browser|session|sandbox)|follow along)\b/i.test(
    text,
  );
}

function replyRefusesLiveSession(text: string): boolean {
  return /\b(can'?t|cannot|unable to|don'?t|won'?t|not able to)\b.{0,60}\b(stream|live|watch|session)\b/i.test(
    text,
  );
}

function replyClaimsSessionLink(text: string): boolean {
  return (
    /\b(session|live view|watch|sandbox)\b/i.test(text) &&
    /\b(link|send(?:ing)?|here'?s)\b/i.test(text)
  );
}

async function fulfillClaimedLinks(params: {
  user: DoeDtcUserRow;
  replyText: string;
  inboundText: string;
  listenUrl?: string;
  profileUrl?: string;
  sessionUrl?: string;
  activeBrowserJobId: string | null;
}): Promise<{ listenUrl?: string; profileUrl?: string; sessionUrl?: string; replyText: string }> {
  let listenUrl = params.listenUrl;
  let profileUrl = params.profileUrl;
  let sessionUrl = params.sessionUrl;
  let replyText = params.replyText;

  if (!listenUrl && replyClaimsListenLink(params.replyText)) {
    const session = await createDoeDtcListenSession({ userId: params.user.id });
    listenUrl = doeDtcListenUrl(params.user.care_token, session.id);
  }

  if (!profileUrl && replyClaimsProfileLink(params.replyText)) {
    profileUrl = doeDtcAppUrl(params.user.care_token);
  }

  const shouldSendSession =
    Boolean(params.activeBrowserJobId) &&
    (inboundWantsLiveSession(params.inboundText) ||
      replyClaimsSessionLink(params.replyText) ||
      replyRefusesLiveSession(params.replyText));

  if (!sessionUrl && shouldSendSession) {
    sessionUrl = doeDtcSessionUrl(params.user.care_token);
  }

  if (sessionUrl && replyRefusesLiveSession(replyText)) {
    replyText = "Sending a live session link so you can watch.";
  }

  return { listenUrl, profileUrl, sessionUrl, replyText };
}

function buildReplyFromTurnState(params: {
  modelContent?: string | null;
  assessmentSummary?: string;
  browserNeedsConfirm: boolean;
  browserExcerpt?: string;
  workUrl?: string;
  screenshotUrl?: string;
  vaultUrl?: string;
  liveViewUrl?: string;
  sessionUrl?: string;
  listenUrl?: string;
  profileUrl?: string;
  browserUserMessage?: string;
}): string {
  if (params.browserUserMessage?.trim()) {
    return sanitizeDoeDtcReplyText(params.browserUserMessage);
  }

  const trimmed = params.modelContent?.trim();
  if (trimmed) return sanitizeDoeDtcReplyText(trimmed);

  if (params.assessmentSummary) return params.assessmentSummary;
  if (params.browserNeedsConfirm) return "Reply CONFIRM to proceed, or STOP to cancel.";
  if (params.browserExcerpt) {
    const snippet = params.browserExcerpt.replace(/\s+/g, " ").trim().slice(0, 280);
    return snippet.length > 0 ? snippet : "Here's what I found — sending a preview.";
  }
  if (params.workUrl) return "Here's what I found — sending a preview.";
  if (params.screenshotUrl) return "Here's a screenshot of the page.";
  if (params.vaultUrl) return "Sending a secure sign-in link.";
  if (params.liveViewUrl) return "Sending a Live View link so you can sign in.";
  if (params.sessionUrl) return "Sending a live session link so you can watch.";
  if (params.listenUrl) return "Sending a Listen link to record your visit.";
  if (params.profileUrl) return "Sending your profile link.";

  return "Got it.";
}

function buildSystemPrompt(params: {
  user: DoeDtcUserRow;
  medications: string[];
  conditions: string[];
  transcript: string;
  symptomLog: string;
  assessmentHistory: string;
  appointmentLog: string;
  relevantMemories: string;
  familyLog: string;
  profileOverview: string;
}): string {
  return `You are Doe, a warm consumer health companion over iMessage.

Today is ${todayLabel()}.

Profile:
- Name: ${params.user.full_name ?? "Unknown"}
- Medications: ${params.medications.join(", ") || "None listed"}
- Conditions: ${params.conditions.join(", ") || "None listed"}
- Why using Doe: ${params.user.why_doe ?? "Not specified"}

Profile tabs (read with read_profile if you need more detail):
${params.profileOverview}

Recent conversation:
${params.transcript || "No prior messages."}

Appointments:
${params.appointmentLog}

Family chart:
${params.familyLog}

Relevant memories:
${params.relevantMemories}

Symptom log:
${params.symptomLog}

Prior assessments:
${params.assessmentHistory}

What you can do:
- Log symptoms, run structured reviews, track appointments and family members.
- Add medications (add_medication) and conditions (add_condition) to the profile.
- Add family members to the Family chart (log_family_member) — never remember_fact for family.
- Send a Listen link to record and transcribe visits (start_listen).
- Read any profile tab with read_profile — dashboard includes Whoop and Apple Health. Answer from that data. Never say you cannot add or cannot see Whoop, locker, results, family, or share.
- If they want to connect Whoop or Apple Health, tell them the current status and send_profile_link so they can tap Connect. Do not treat a status question as an add.
- Send the profile / dashboard link (send_profile_link).
- Browse the web via start_browser_task. For "go to Google and type mayo" (or screenshot the result), call once with url google and intent type mayo — that opens the Google results page and screenshots it. Do not try to type into Google with a CSS selector.
- Screenshot the current page with browser_snapshot when they ask for a picture, screenshot, or to see the page.
- Help with patient portals via request_vault or request_live_login — never ask for passwords in iMessage.
- Send the live session page (show_session) when they want to watch, stream, or follow the browser and a task is active. You can send a live session. Never say you cannot stream or watch a live browser.
- Store preferences and general context with remember_fact — not for meds, conditions, or family chart entries.

Parallel work:
- Only one browser task runs at a time, but you may run other tools in the same turn (log symptoms, family, meds, start_listen, etc.) while a browser job is open.
- Do not wait for browsing to finish before saving profile or appointment data.

iMessage texture:
- react_to_message: rarely, with varied emojis — skip routine turns, CONFIRM/STOP/Hi Doe, and most replies.
- use_thread_reply: occasionally when answering a direct question or correction (~1 in 3 eligible turns), never for link-only bubbles.

Core invariant:
- Do the action with tools first, then describe the result in plain language.
- Never claim you sent a link, opened a page, or logged in unless the matching tool succeeded.
- If a browser tool returns user_message, use that exact wording in your reply.
- Never put URLs in your reply — links arrive as separate iMessages.
- Never mention tools, Kernel, or internal systems.

Style:
- Short iMessage replies (1-4 sentences). Warm, plain language.
- Never end a reply with a comma.
- Only ask a clarifying question when you cannot act without it.
- Refer back to appointments, family, and memories naturally.
- Do not invite another message on most turns. A soft closer ("let me know if…") is fine rarely — not most replies.

Safety:
- Never invent appointment dates or times. Use log_appointment with approximate timing when vague.
- For approximate appointments, repeat the user's vague wording — never convert to an exact datetime.
- Use log_family_member for every family chart entry. Use relationship child for sons/daughters. If names are missing, use full_name Child.
- Use add_medication and add_condition for profile medical info — never remember_fact for those.
- Never claim a definitive diagnosis. Flag emergencies clearly.
- Irreversible browser actions need request_commit, then the patient replies CONFIRM.
- After useful browser findings, you may store a one-line outcome via remember_fact.`;
}

export async function generateDoeDtcAssessment(params: {
  symptomsText: string;
  medications: string[];
  conditions: string[];
  whyDoe: string;
  focus?: string;
}): Promise<DoeDtcAssessmentResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Symptom assessment is not configured: OPENAI_API_KEY is missing.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DOEDTC_ASSESSMENT_MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Doe, a consumer health companion. Output JSON only with this shape:
{
  "presentingSymptoms": "short restatement of what the user reported",
  "summary": "2-3 sentence plain-language overview for iMessage",
  "findings": [{"name":"condition","why":"why it fits","evidence":["bullet"],"likelihood":"high|moderate|low"}],
  "cantMiss": ["can't-miss diagnosis or red flag"],
  "urgency": "when to seek urgent or emergency care",
  "disclaimer": "Doe is not a doctor and this is not a diagnosis."
}

Rules:
- Use the user's medications, conditions, and goals as context when relevant.
- Rank 3-6 likely explanations with evidence grounded in common clinical reasoning.
- Always include can't-miss/red-flag guidance and a conservative urgency note.
- Never claim a definitive diagnosis. Encourage professional care when appropriate.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            symptoms: params.symptomsText,
            medications: params.medications,
            conditions: params.conditions,
            whyDoe: params.whyDoe,
            focus: params.focus ?? null,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Assessment generation failed: ${body.slice(0, 300)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Assessment generation returned no content.");
  }

  const parsed = JSON.parse(content) as DoeDtcAssessmentResult;
  return {
    presentingSymptoms: parsed.presentingSymptoms || params.symptomsText,
    summary: parsed.summary || "I reviewed what you shared and put together a few possibilities.",
    findings: Array.isArray(parsed.findings) ? parsed.findings : [],
    cantMiss: Array.isArray(parsed.cantMiss) ? parsed.cantMiss : [],
    urgency: parsed.urgency || "If symptoms worsen or feel unsafe, seek urgent medical care.",
    disclaimer:
      parsed.disclaimer ||
      "Doe is not a doctor and this is not a diagnosis. If you think you're having an emergency, call 911.",
  };
}

async function callDoeDtcAgent(messages: ChatMessage[]): Promise<{
  message: {
    content: string | null;
    tool_calls?: Array<{
      id: string;
      type: "function";
      function: { name: string; arguments: string };
    }>;
  };
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Doe agent is not configured: OPENAI_API_KEY is missing.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DOEDTC_AGENT_MODEL,
      temperature: 0.4,
      tools: DOEDTC_AGENT_TOOLS,
      tool_choice: "auto",
      messages,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Doe agent failed: ${body.slice(0, 300)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{
      message?: {
        content: string | null;
        tool_calls?: Array<{
          id: string;
          type: "function";
          function: { name: string; arguments: string };
        }>;
      };
    }>;
  };

  const message = json.choices?.[0]?.message;
  if (!message) {
    throw new Error("Doe agent returned no message.");
  }

  return { message };
}

export async function runDoeDtcAgentTurn(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  inboundMessageId?: string;
}): Promise<DoeDtcAgentTurnResult> {
  const [snapshot, messageHistory, relevantMemoryRows] = await Promise.all([
    getDoeDtcProfileSnapshot(params.user.id),
    listDoeDtcMessages(params.user.id, 40),
    searchDoeDtcMem0Memories({ userId: params.user.id, query: params.inboundText, topK: 5 }),
  ]);

  const systemPrompt = buildSystemPrompt({
    user: params.user,
    medications: snapshot.medications,
    conditions: snapshot.conditions,
    transcript: compactTranscript(messageHistory),
    symptomLog: formatSymptomLog(snapshot.symptoms),
    assessmentHistory: formatAssessmentHistory(snapshot.assessments),
    appointmentLog: formatAppointmentLog(snapshot.appointments),
    relevantMemories: formatMem0Block(relevantMemoryRows),
    familyLog: formatFamilyLog(snapshot.familyMembers),
    profileOverview: formatDoeDtcProfileOverview(snapshot),
  });

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: params.inboundText },
  ];

  let latestSymptomId: string | null = null;
  let assessmentRan = false;
  let careUrl: string | undefined;
  let listenUrl: string | undefined;
  let profileUrl: string | undefined;
  let workUrl: string | undefined;
  let screenshotUrl: string | undefined;
  let vaultUrl: string | undefined;
  let liveViewUrl: string | undefined;
  let sessionUrl: string | undefined;
  let reactionEmoji: string | undefined;
  let replyToInbound = false;
  let browserNeedsConfirm = false;
  let activeBrowserJobId: string | null = await getActiveDoeDtcBrowserJobId(params.user.id);
  let assessmentSummary: string | undefined;
  let browserExcerpt: string | undefined;
  let browserUserMessage: string | undefined;
  let lastModelContent: string | null = null;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    const { message } = await callDoeDtcAgent(messages);
    lastModelContent = message.content;

    if (!message.tool_calls?.length) {
      let replyText = buildReplyFromTurnState({
        modelContent: message.content,
        assessmentSummary,
        browserNeedsConfirm,
        browserExcerpt,
        browserUserMessage,
        workUrl,
        screenshotUrl,
        vaultUrl,
        liveViewUrl,
        sessionUrl,
        listenUrl,
        profileUrl,
      });

      const fulfilled = await fulfillClaimedLinks({
        user: params.user,
        replyText,
        inboundText: params.inboundText,
        listenUrl,
        profileUrl,
        sessionUrl,
        activeBrowserJobId,
      });
      listenUrl = fulfilled.listenUrl;
      profileUrl = fulfilled.profileUrl;
      sessionUrl = fulfilled.sessionUrl;
      replyText = fulfilled.replyText;

      if (!message.content?.trim()) {
        replyText = buildReplyFromTurnState({
          assessmentSummary,
          browserNeedsConfirm,
          browserExcerpt,
          browserUserMessage,
          workUrl,
          screenshotUrl,
          vaultUrl,
          liveViewUrl,
          sessionUrl,
          listenUrl,
          profileUrl,
        });
      }

      return {
        replyText,
        careUrl: assessmentRan ? careUrl : undefined,
        listenUrl,
        profileUrl,
        workUrl,
        screenshotUrl,
        vaultUrl,
        liveViewUrl,
        sessionUrl,
        reactionEmoji,
        replyToInbound,
        browserNeedsConfirm,
        assessmentRan,
      };
    }

    messages.push({
      role: "assistant",
      content: message.content,
      tool_calls: message.tool_calls,
    });

    for (const toolCall of message.tool_calls) {
      let output: Record<string, unknown>;

      try {
        const args = JSON.parse(toolCall.function.arguments) as Record<string, unknown>;

        if (toolCall.function.name === "log_symptoms") {
          const rawText = String(args.raw_text ?? params.inboundText).trim();
          const row = await insertDoeDtcSymptom({
            userId: params.user.id,
            rawText,
            summary: typeof args.summary === "string" ? args.summary : null,
            severity:
              args.severity === "mild" ||
              args.severity === "moderate" ||
              args.severity === "severe"
                ? args.severity
                : "unknown",
            onset: typeof args.onset === "string" ? args.onset : null,
            tags: Array.isArray(args.tags)
              ? args.tags.filter((tag): tag is string => typeof tag === "string").slice(0, 12)
              : [],
          });
          latestSymptomId = row.id;
          output = { ok: true, id: row.id };
        } else if (toolCall.function.name === "run_assessment") {
          const symptomsText = String(args.symptoms_text ?? params.inboundText).trim();
          const result = await generateDoeDtcAssessment({
            symptomsText,
            medications: snapshot.medications,
            conditions: snapshot.conditions,
            whyDoe: params.user.why_doe ?? "",
            focus: typeof args.focus === "string" ? args.focus : undefined,
          });
          const saved = await saveDoeDtcAssessment({
            userId: params.user.id,
            symptomsText,
            result,
          });
          if (latestSymptomId) {
            await linkDoeDtcSymptomToAssessment({
              symptomId: latestSymptomId,
              assessmentId: saved.id,
            });
          }
          assessmentRan = true;
          assessmentSummary = result.summary;
          careUrl = doeDtcCareUrl(params.user.care_token);
          output = {
            ok: true,
            assessment_id: saved.id,
            summary: result.summary,
            link_sent_separately: true,
          };
        } else if (toolCall.function.name === "log_appointment") {
          const precision = String(args.timing_precision ?? "").trim() as DoeDtcAppointmentTimingPrecision;
          const normalized = normalizeDoeDtcAppointmentTiming({
            title: String(args.title ?? ""),
            timing_precision: precision,
            starts_at: typeof args.starts_at === "string" ? args.starts_at : null,
            timing_note: typeof args.timing_note === "string" ? args.timing_note : null,
            location: typeof args.location === "string" ? args.location : null,
            notes: typeof args.notes === "string" ? args.notes : null,
          });
          const row = await addDoeDtcAppointment({
            userId: params.user.id,
            title: normalized.title,
            startsAt: normalized.startsAt,
            timingNote: normalized.timingNote,
            location: normalized.location,
            notes: normalized.notes,
          });
          output = {
            ok: true,
            id: row.id,
            title: row.title,
            starts_at: row.starts_at,
            timing_note: row.timing_note,
          };
          const when = formatDoeDtcAppointmentWhen(row);
          await addDoeDtcMem0Fact({
            userId: params.user.id,
            fact: `Appointment: ${row.title} — ${when}`,
          });
        } else if (toolCall.function.name === "log_family_member") {
          const relationshipRaw = String(args.relationship ?? "").trim();
          const relationship = normalizeDoeDtcFamilyRelationship(relationshipRaw);
          if (!relationship) throw new Error("Invalid relationship.");
          const fullName = resolveDoeDtcFamilyMemberName({
            fullName: String(args.full_name ?? ""),
            relationship,
          });
          if (!fullName) throw new Error("full_name is required.");
          const row = await addDoeDtcFamilyMember({
            userId: params.user.id,
            fullName,
            relationship,
            phone: typeof args.phone === "string" ? args.phone : null,
          });
          output = {
            ok: true,
            id: row.id,
            full_name: row.full_name,
            relationship: row.relationship,
          };
        } else if (toolCall.function.name === "add_medication") {
          const name = String(args.name ?? "").trim();
          if (!name) throw new Error("Medication name is required.");
          const result = await appendDoeDtcMedication({ userId: params.user.id, name });
          output = { ok: true, name: result.name, added: result.added };
        } else if (toolCall.function.name === "add_condition") {
          const name = String(args.name ?? "").trim();
          if (!name) throw new Error("Condition name is required.");
          const result = await appendDoeDtcCondition({ userId: params.user.id, name });
          output = { ok: true, name: result.name, added: result.added };
        } else if (toolCall.function.name === "remember_fact") {
          const fact = String(args.fact ?? "").trim();
          if (!fact) throw new Error("Fact is required.");
          const row = await insertDoeDtcMemory({
            userId: params.user.id,
            fact,
            category: typeof args.category === "string" ? args.category : "general",
          });
          await addDoeDtcMem0Fact({ userId: params.user.id, fact: row.fact });
          output = { ok: true, id: row.id, fact: row.fact };
        } else if (toolCall.function.name === "start_browser_task") {
          const started = await startDoeDtcBrowserTask({
            user: params.user,
            intent: String(args.intent ?? ""),
            url: String(args.url ?? ""),
            mode:
              args.mode === "login" || args.mode === "write" || args.mode === "research"
                ? args.mode
                : "research",
          });
          if (!started.ok) {
            browserUserMessage = started.user_message;
            output = {
              ok: false,
              error: started.error,
              user_message: started.user_message,
            };
          } else {
            activeBrowserJobId = started.jobId;
            if (started.workUrl) {
              workUrl = started.workUrl;
            }
            if (started.screenshotUrl) {
              screenshotUrl = started.screenshotUrl;
            }
            if (started.excerpt) {
              browserExcerpt = started.excerpt;
            }
            output = {
              ok: true,
              job_id: started.jobId,
              host: started.host,
              url: started.url,
              title: started.title,
              excerpt: started.excerpt,
              screenshot_sent_separately: Boolean(started.screenshotUrl),
              link_sent_separately: Boolean(started.workUrl),
            };
          }
        } else if (toolCall.function.name === "browser_navigate") {
          const jobId = activeBrowserJobId ?? "";
          const result = await navigateDoeDtcBrowser({
            user: params.user,
            jobId,
            url: String(args.url ?? ""),
          });
          output = result;
        } else if (toolCall.function.name === "browser_act") {
          const jobId = activeBrowserJobId ?? "";
          const result = await actDoeDtcBrowser({
            user: params.user,
            jobId,
            action:
              args.action === "click" || args.action === "type" || args.action === "scroll"
                ? args.action
                : "scroll",
            selector: typeof args.selector === "string" ? args.selector : undefined,
            text: typeof args.text === "string" ? args.text : undefined,
          });
          if (
            result.ok &&
            /\b(ss|screenshot|snap(?:shot)?|picture|photo)\b/i.test(params.inboundText)
          ) {
            const shot = await snapshotDoeDtcBrowser({
              user: params.user,
              jobId,
              caption: typeof args.text === "string" ? args.text : params.inboundText,
            });
            if (shot.workUrl) workUrl = shot.workUrl;
            if (shot.screenshotUrl) screenshotUrl = shot.screenshotUrl;
            if (shot.excerpt) browserExcerpt = shot.excerpt;
            output = {
              ...result,
              screenshot_sent_separately: Boolean(shot.screenshotUrl),
            };
          } else if (!result.ok) {
            browserUserMessage = toUserSafeBrowserError(result.error ?? "Browser action failed.");
            output = { ...result, user_message: browserUserMessage };
          } else {
            output = result;
          }
        } else if (toolCall.function.name === "browser_snapshot") {
          const jobId = activeBrowserJobId ?? "";
          const result = await snapshotDoeDtcBrowser({
            user: params.user,
            jobId,
            caption: typeof args.caption === "string" ? args.caption : undefined,
          });
          if (result.workUrl) {
            workUrl = result.workUrl;
          }
          if (result.screenshotUrl) {
            screenshotUrl = result.screenshotUrl;
          }
          if (result.excerpt) {
            browserExcerpt = result.excerpt;
          }
          output = {
            ok: result.ok,
            url: result.url,
            title: result.title,
            excerpt: result.excerpt,
            screenshot_sent_separately: Boolean(result.screenshotUrl),
            link_sent_separately: Boolean(result.workUrl),
          };
        } else if (toolCall.function.name === "request_vault") {
          const jobId = activeBrowserJobId ?? "";
          const vault = await requestDoeDtcVaultLink({
            user: params.user,
            jobId,
            host: String(args.host ?? ""),
          });
          if (!vault.ok) {
            output = vault;
          } else {
            vaultUrl = vault.vaultUrl;
            output = { ok: true, link_sent_separately: true };
          }
        } else if (toolCall.function.name === "request_live_login") {
          const jobId = activeBrowserJobId ?? "";
          const live = await requestDoeDtcLiveLogin({ user: params.user, jobId });
          if (!live.ok) {
            output = live;
          } else {
            liveViewUrl = live.liveViewUrl;
            output = { ok: true, link_sent_separately: true };
          }
        } else if (toolCall.function.name === "show_session") {
          if (!activeBrowserJobId) {
            output = { ok: false, error: "No active browser task to watch." };
          } else {
            sessionUrl = doeDtcSessionUrl(params.user.care_token);
            output = { ok: true, link_sent_separately: true };
          }
        } else if (toolCall.function.name === "react_to_message") {
          if (!params.inboundMessageId) {
            output = { ok: false, error: "No inbound message to react to." };
          } else {
            const emoji = String(args.emoji ?? "").trim();
            if (!emoji) {
              output = { ok: false, error: "Emoji is required." };
            } else {
              reactionEmoji = emoji.slice(0, 8);
              output = { ok: true, queued: true };
            }
          }
        } else if (toolCall.function.name === "use_thread_reply") {
          if (!params.inboundMessageId) {
            output = { ok: false, error: "No inbound message to reply to." };
          } else {
            replyToInbound = true;
            output = { ok: true, queued: true };
          }
        } else if (toolCall.function.name === "request_commit") {
          const jobId = activeBrowserJobId ?? "";
          const result = await requestDoeDtcBrowserCommit({
            user: params.user,
            jobId,
            pendingAction: {
              selector: String(args.selector ?? ""),
              label: String(args.label ?? ""),
              url: typeof args.url === "string" ? args.url : undefined,
            },
          });
          if (result.workUrl) {
            workUrl = result.workUrl;
          }
          if (result.screenshotUrl) {
            screenshotUrl = result.screenshotUrl;
          }
          if (result.excerpt) {
            browserExcerpt = result.excerpt;
          }
          browserNeedsConfirm = true;
          output = {
            ok: result.ok,
            url: result.url,
            title: result.title,
            excerpt: result.excerpt,
            awaiting_confirm: true,
            link_sent_separately: Boolean(result.workUrl),
          };
        } else if (toolCall.function.name === "start_listen") {
          const appointmentId =
            typeof args.appointment_id === "string" && args.appointment_id.trim()
              ? args.appointment_id.trim()
              : null;
          const session = await createDoeDtcListenSession({
            userId: params.user.id,
            appointmentId,
          });
          listenUrl = doeDtcListenUrl(params.user.care_token, session.id);
          output = { ok: true, session_id: session.id, link_sent_separately: true };
        } else if (toolCall.function.name === "send_profile_link") {
          profileUrl = doeDtcAppUrl(params.user.care_token);
          output = { ok: true, link_sent_separately: true };
        } else if (toolCall.function.name === "read_profile") {
          const tab = String(args.tab ?? "") as DoeDtcProfileTab;
          if (!DOEDTC_PROFILE_READ_TABS.includes(tab)) {
            output = { ok: false, error: "Unknown profile tab." };
          } else {
            const read = await readDoeDtcProfileTab({ userId: params.user.id, tab });
            output = { ok: true, tab: read.tab, content: read.content };
          }
        } else {
          output = { ok: false, error: "Unknown tool" };
        }
      } catch (error) {
        output = {
          ok: false,
          error: error instanceof Error ? error.message : "Tool execution failed.",
        };
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(output),
      });
    }
  }

  const fulfilled = await fulfillClaimedLinks({
    user: params.user,
    replyText: lastModelContent ?? "",
    inboundText: params.inboundText,
    listenUrl,
    profileUrl,
    sessionUrl,
    activeBrowserJobId,
  });
  listenUrl = fulfilled.listenUrl;
  profileUrl = fulfilled.profileUrl;
  sessionUrl = fulfilled.sessionUrl;

  return {
    replyText: buildReplyFromTurnState({
      modelContent: fulfilled.replyText,
      assessmentSummary,
      browserNeedsConfirm,
      browserExcerpt,
      browserUserMessage,
      workUrl,
      screenshotUrl,
      vaultUrl,
      liveViewUrl,
      sessionUrl,
      listenUrl,
      profileUrl,
    }),
    careUrl: assessmentRan ? careUrl : undefined,
    listenUrl,
    profileUrl,
    workUrl,
    screenshotUrl,
    vaultUrl,
    liveViewUrl,
    sessionUrl,
    reactionEmoji,
    replyToInbound,
    browserNeedsConfirm,
    assessmentRan,
  };
}
