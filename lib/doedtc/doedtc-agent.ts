import { doeDtcCareUrl } from "@/lib/doedtc/doedtc-copy";
import {
  getDoeDtcProfileLists,
  insertDoeDtcSymptom,
  linkDoeDtcSymptomToAssessment,
  listDoeDtcAssessments,
  listDoeDtcMessages,
  listDoeDtcSymptoms,
  saveDoeDtcAssessment,
} from "@/lib/doedtc/doedtc-db";
import type {
  DoeDtcAssessmentResult,
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
  assessmentRan: boolean;
};

function compactTranscript(messages: DoeDtcMessageRow[]): string {
  const lines = messages
    .filter((entry) => entry.body.trim())
    .map((entry) => {
      const speaker = entry.direction === "inbound" ? "User" : "Doe";
      return `${speaker}: ${entry.body.trim()}`;
    });
  const joined = lines.join("\n");
  if (joined.length <= 6000) return joined;
  return joined.slice(joined.length - 6000);
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

function buildSystemPrompt(params: {
  user: DoeDtcUserRow;
  medications: string[];
  conditions: string[];
  transcript: string;
  symptomLog: string;
  assessmentHistory: string;
}): string {
  return `You are Doe, a consumer health companion over iMessage.

Profile:
- Name: ${params.user.full_name ?? "Unknown"}
- Medications: ${params.medications.join(", ") || "None listed"}
- Conditions: ${params.conditions.join(", ") || "None listed"}
- Why using Doe: ${params.user.why_doe ?? "Not specified"}

Recent conversation:
${params.transcript || "No prior messages."}

Symptom log:
${params.symptomLog}

Prior assessments:
${params.assessmentHistory}

Rules:
- Keep iMessage replies short (1-4 sentences). Warm, plain language.
- When the user reports symptoms, call log_symptoms.
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
  const [profile, messageHistory, symptoms, assessments] = await Promise.all([
    getDoeDtcProfileLists(params.user.id),
    listDoeDtcMessages(params.user.id, 20),
    listDoeDtcSymptoms(params.user.id, 10),
    listDoeDtcAssessments(params.user.id, 3),
  ]);

  const systemPrompt = buildSystemPrompt({
    user: params.user,
    medications: profile.medications,
    conditions: profile.conditions,
    transcript: compactTranscript(messageHistory),
    symptomLog: formatSymptomLog(symptoms),
    assessmentHistory: formatAssessmentHistory(assessments),
  });

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: params.inboundText },
  ];

  let latestSymptomId: string | null = null;
  let assessmentRan = false;
  let careUrl: string | undefined;
  let assessmentSummary: string | undefined;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    const { message } = await callDoeDtcAgent(messages);

    if (!message.tool_calls?.length) {
      const replyText =
        message.content?.trim() ||
        (assessmentRan
          ? assessmentSummary ?? "I put together a review for you."
          : "Thanks for sharing. Tell me more about what you are feeling.");

      return {
        replyText,
        careUrl: assessmentRan ? careUrl : undefined,
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
            care_url: careUrl,
          };
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
    replyText: assessmentSummary ?? "I am still reviewing what you shared. One moment.",
    careUrl: assessmentRan ? careUrl : undefined,
    assessmentRan,
  };
}
