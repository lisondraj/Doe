import { doeDtcAppUrl, doeDtcCareUrl, doeDtcListenUrl } from "@/lib/doedtc/doedtc-copy";
import {
  formatDoeDtcAppointmentWhen,
  normalizeDoeDtcAppointmentTiming,
  type DoeDtcAppointmentTimingPrecision,
} from "@/lib/doedtc/doedtc-appointment-timing";
import {
  addDoeDtcAppointment,
  addDoeDtcFamilyMember,
  createDoeDtcListenSession,
  getDoeDtcProfileLists,
  insertDoeDtcMemory,
  insertDoeDtcSymptom,
  linkDoeDtcSymptomToAssessment,
  listDoeDtcAppointments,
  listDoeDtcAssessments,
  listDoeDtcFamilyMembers,
  listDoeDtcMemories,
  listDoeDtcMessages,
  listDoeDtcSymptoms,
  saveDoeDtcAssessment,
} from "@/lib/doedtc/doedtc-db";
import type {
  DoeDtcAppointmentRow,
  DoeDtcAssessmentResult,
  DoeDtcFamilyMemberRow,
  DoeDtcFamilyRelationship,
  DoeDtcMemoryRow,
  DoeDtcMessageRow,
  DoeDtcSymptomRow,
  DoeDtcUserRow,
} from "@/lib/doedtc/doedtc-types";

const DOEDTC_AGENT_MODEL = "gpt-4o-mini";
const MAX_TOOL_ROUNDS = 5;

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
        "Add or update the user's family chart when they name a person and relationship (e.g. son Bob, mother Jane). Use child for son/daughter. Name is required.",
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
      name: "remember_fact",
      description:
        "Store a durable fact about the user for future conversations (doctor name, preference, travel, family context). Not for symptoms.",
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
        "Start a Listen session so the user can record and transcribe a medical appointment on the web. Call when they ask to listen, record, or transcribe a visit.",
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
        "Send the user their Doe profile link. Call whenever they ask for their profile, dashboard, appointments page, or a profile link.",
      parameters: {
        type: "object",
        properties: {},
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
  assessmentRan: boolean;
};

const URL_IN_TEXT = /https?:\/\/\S+/gi;
const CLOSER_TAIL =
  /(?:\s*[.!]+\s*)?(?:feel free to ask(?: me)?(?:(?: if you have)?(?: any)? questions?)?|let me know if (?:you have )?(?:any )?(?:questions|you need anything)|don'?t hesitate to (?:ask|reach out))[!.,]?\s*$/i;

export function sanitizeDoeDtcReplyText(text: string): string {
  return text
    .replace(URL_IN_TEXT, "")
    .replace(CLOSER_TAIL, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
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

function formatAssessmentHistory(
  assessments: Awaited<ReturnType<typeof listDoeDtcAssessments>>,
): string {
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

function formatMemoryLog(memories: DoeDtcMemoryRow[]): string {
  if (memories.length === 0) return "No stored memories yet.";
  return memories.map((row) => `- [${row.category}] ${row.fact}`).join("\n");
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

const FAMILY_RELATIONSHIPS = new Set<DoeDtcFamilyRelationship>([
  "grandmother",
  "grandfather",
  "mother",
  "father",
  "child",
  "sibling",
  "partner",
  "other",
]);

function todayLabel(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildSystemPrompt(params: {
  user: DoeDtcUserRow;
  medications: string[];
  conditions: string[];
  transcript: string;
  symptomLog: string;
  assessmentHistory: string;
  appointmentLog: string;
  memoryLog: string;
  familyLog: string;
}): string {
  return `You are Doe, a consumer health companion over iMessage.

Today is ${todayLabel()}.

Profile:
- Name: ${params.user.full_name ?? "Unknown"}
- Medications: ${params.medications.join(", ") || "None listed"}
- Conditions: ${params.conditions.join(", ") || "None listed"}
- Why using Doe: ${params.user.why_doe ?? "Not specified"}

Recent conversation:
${params.transcript || "No prior messages."}

Appointments:
${params.appointmentLog}

Family chart:
${params.familyLog}

Remembered facts:
${params.memoryLog}

Symptom log:
${params.symptomLog}

Prior assessments:
${params.assessmentHistory}

Rules:
- Keep iMessage replies short (1-4 sentences). Warm, plain language.
- When the user reports symptoms, call log_symptoms.
- When the user mentions an appointment or visit, ask what it is for if missing.
- Never invent a calendar date or time. If they only say vague timing (next week, soon), use log_appointment with timing_precision approximate and timing_note in their words — no starts_at.
- If they name a specific day without a time (next Tuesday), use timing_precision day with starts_at for that day only.
- Use timing_precision exact only when they give a specific time.
- Before stating any appointment date or time in a reply, read the Appointments chart. For approximate entries, repeat their vague wording — never convert it to a specific datetime.
- If the user says they never gave a date, apologize briefly and ask which day the appointment is.
- Refer back to upcoming appointments, family members, and remembered facts naturally in later turns.
- When the user names a family member with a relationship (e.g. "my son Bob", "mother Jane"), call log_family_member. Use child for son or daughter. Do not use remember_fact for family members that belong on the Family tab.
- Store other durable non-symptom facts with remember_fact (doctor names, preferences, general context).
- When the user wants to record or transcribe a visit, call start_listen. Tell them you are sending a Listen link.
- When the user asks for their profile, dashboard, appointments page, or a profile link, call send_profile_link. Say you are sending the link. Never say you cannot send it.
- When the user asks whether you logged a family member, answer from the Family chart above.
- Never put URLs in your reply. Links are always sent as a separate iMessage.
- Do not end with "feel free to ask", "let me know if you have questions", or similar closers. Just stop.
- Ask 1-2 clarifying questions when details are thin (timing, severity, location, triggers).
- Call run_assessment when you have enough signal or the user asks what it might be / wants a review.
- Never claim a definitive diagnosis. Flag emergencies clearly.
- You may log symptoms and assess in the same turn when appropriate.
- Do not mention tools or internal systems to the user.`;
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
      model: DOEDTC_AGENT_MODEL,
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
}): Promise<DoeDtcAgentTurnResult> {
  const [profile, messageHistory, symptoms, assessments, appointments, memories, familyMembers] =
    await Promise.all([
    getDoeDtcProfileLists(params.user.id),
    listDoeDtcMessages(params.user.id, 40),
    listDoeDtcSymptoms(params.user.id, 10),
    listDoeDtcAssessments(params.user.id, 3),
    listDoeDtcAppointments(params.user.id, 8),
    listDoeDtcMemories(params.user.id, 20),
    listDoeDtcFamilyMembers(params.user.id, 12),
  ]);

  const systemPrompt = buildSystemPrompt({
    user: params.user,
    medications: profile.medications,
    conditions: profile.conditions,
    transcript: compactTranscript(messageHistory),
    symptomLog: formatSymptomLog(symptoms),
    assessmentHistory: formatAssessmentHistory(assessments),
    appointmentLog: formatAppointmentLog(appointments),
    memoryLog: formatMemoryLog(memories),
    familyLog: formatFamilyLog(familyMembers),
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
  let assessmentSummary: string | undefined;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    const { message } = await callDoeDtcAgent(messages);

    if (!message.tool_calls?.length) {
      const fallback = assessmentRan
        ? assessmentSummary ?? "I put together a review for you."
        : listenUrl
          ? "I am sending a Listen link."
          : profileUrl
            ? "I am sending your profile link."
            : "Thanks for sharing. Tell me more about what you are feeling.";
      const replyText = sanitizeDoeDtcReplyText(message.content?.trim() || fallback) || fallback;

      return {
        replyText,
        careUrl: assessmentRan ? careUrl : undefined,
        listenUrl,
        profileUrl,
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
            medications: profile.medications,
            conditions: profile.conditions,
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
        } else if (toolCall.function.name === "log_family_member") {
          const fullName = String(args.full_name ?? "").trim();
          const relationship = String(args.relationship ?? "").trim();
          if (!fullName) throw new Error("full_name is required.");
          if (!FAMILY_RELATIONSHIPS.has(relationship as DoeDtcFamilyRelationship)) {
            throw new Error("Invalid relationship.");
          }
          const row = await addDoeDtcFamilyMember({
            userId: params.user.id,
            fullName,
            relationship: relationship as DoeDtcFamilyRelationship,
            phone: typeof args.phone === "string" ? args.phone : null,
          });
          output = {
            ok: true,
            id: row.id,
            full_name: row.full_name,
            relationship: row.relationship,
          };
        } else if (toolCall.function.name === "remember_fact") {
          const fact = String(args.fact ?? "").trim();
          if (!fact) throw new Error("Fact is required.");
          const row = await insertDoeDtcMemory({
            userId: params.user.id,
            fact,
            category: typeof args.category === "string" ? args.category : "general",
          });
          output = { ok: true, id: row.id, fact: row.fact };
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

  return {
    replyText: sanitizeDoeDtcReplyText(
      assessmentSummary ?? "I am still reviewing what you shared. One moment.",
    ),
    careUrl: assessmentRan ? careUrl : undefined,
    listenUrl,
    profileUrl,
    assessmentRan,
  };
}
