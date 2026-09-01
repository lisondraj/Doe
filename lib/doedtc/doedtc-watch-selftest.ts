import { assertToolPromptCoverage, buildDoeDtcToolCapabilityPrompt } from "@/lib/doedtc/agent/tool-prompt-registry";
import { resolveDoeDtcAgentModel, resolveDoeDtcAgentRuntime } from "@/lib/doedtc/agent/types";
import {
  buildDoeDtcAgentSystemPrompt,
  DOEDTC_AGENT_TOOLS,
} from "@/lib/doedtc/doedtc-agent";
import {
  KERNEL_SESSION_TIMEOUT_SECONDS,
  listOpenDoeDtcBrowserJobs,
} from "@/lib/doedtc/doedtc-browser-db";
import {
  getDoeDtcProfileSnapshot,
  getDoeDtcWatchUser,
  listDoeDtcMessages,
} from "@/lib/doedtc/doedtc-db";
import { listGuidesForUser } from "@/lib/doedtc/doedtc-guides-db";
import {
  formatMem0Block,
  searchDoeDtcMem0Memories,
  searchDoeDtcMem0Playbook,
} from "@/lib/doedtc/doedtc-memory";
import { formatAccountabilityForAgent } from "@/lib/doedtc/doedtc-accountability";
import { formatHouseholdForAgent } from "@/lib/doedtc/doedtc-household";
import { formatGuideForAgent } from "@/lib/doedtc/doedtc-guides";
import {
  agentNowLabel,
  buildScheduledTextFile,
  formatScheduledTextFileForAgent,
  normalizeScheduledTimezone,
} from "@/lib/doedtc/doedtc-scheduled";
import { formatWorkflowsForAgent, listActiveWorkflowsForUser } from "@/lib/doedtc/doedtc-workflows";
import { formatDoeDtcProfileOverview } from "@/lib/doedtc/doedtc-profile-read";
import { getAgentPending, formatAgentPendingForPrompt } from "@/lib/doedtc/doedtc-pending";

export async function runDoeDtcAgentSelftest(): Promise<Record<string, unknown>> {
  const user = await getDoeDtcWatchUser();
  if (!user) {
    return { ok: false, error: "No DTC user found." };
  }

  const checks: Record<string, unknown> = {
    ok: true,
    runtime: resolveDoeDtcAgentRuntime(),
    model: resolveDoeDtcAgentModel(),
    user: { id: user.id, phone: user.phone, status: user.status },
  };

  try {
    const [snapshot, messageHistory, relevantMemoryRows, recentGuides, pendingRow, playbookNotes] =
      await Promise.all([
        getDoeDtcProfileSnapshot(user.id),
        listDoeDtcMessages(user.id, 10),
        searchDoeDtcMem0Memories({ userId: user.id, query: "health check", topK: 1 }),
        listGuidesForUser(user.id),
        getAgentPending(user.id),
        searchDoeDtcMem0Playbook({ userId: user.id, query: "health check", topK: 1 }),
      ]);
    const timezone = normalizeScheduledTimezone(null);
    const activeWorkflows = await listActiveWorkflowsForUser(user.id);
    const pendingBlock = pendingRow ? formatAgentPendingForPrompt(pendingRow) : "";
    const playbookBlock =
      playbookNotes.length > 0 ? playbookNotes.map((note) => `- ${note}`).join("\n") : "None yet.";

    const prompt = buildDoeDtcAgentSystemPrompt({
      user,
      medications: snapshot.medications,
      conditions: snapshot.conditions,
      transcript: messageHistory
        .slice(-5)
        .map((row) => `${row.direction === "inbound" ? "User" : "Doe"}: ${row.body}`)
        .join("\n"),
      symptomLog: "None yet.",
      assessmentHistory: "None yet.",
      appointmentLog: "None yet.",
      relevantMemories: formatMem0Block(relevantMemoryRows),
      playbookNotes: playbookBlock,
      pendingBlock,
      familyLog: "None yet.",
      householdLog: formatHouseholdForAgent({
        household: snapshot.household.household,
        members: snapshot.household.members,
        consents: snapshot.household.consents,
        viewerUserId: user.id,
      }),
      accountabilityLog: formatAccountabilityForAgent(snapshot.accountabilityPacts),
      scheduledLog: formatScheduledTextFileForAgent(
        buildScheduledTextFile({ rows: snapshot.scheduledTexts, pending: pendingRow }),
      ),
      workflowsLog: formatWorkflowsForAgent(activeWorkflows),
      guidesLog:
        recentGuides.length === 0
          ? "None yet."
          : recentGuides.map((row) => `- ${formatGuideForAgent(row)} | id: ${row.id}`).join("\n"),
      recentAttachmentsLog: "None yet.",
      profileOverview: formatDoeDtcProfileOverview(snapshot),
      nowLabel: agentNowLabel(timezone),
    });

    assertToolPromptCoverage(prompt);
    checks.prompt = {
      ok: true,
      length: prompt.length,
      capabilityBlock: buildDoeDtcToolCapabilityPrompt().slice(0, 200),
    };
  } catch (error) {
    checks.prompt = {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
    checks.ok = false;
  }

  const openJobs = await listOpenDoeDtcBrowserJobs(user.id);
  checks.browserJobs = openJobs.map((job) => ({
    id: job.id,
    status: job.status,
    host: job.allowed_host,
    intent: job.intent,
    ageSeconds: Math.round((Date.now() - Date.parse(job.updated_at)) / 1000),
    stale: Date.now() - Date.parse(job.updated_at) > KERNEL_SESSION_TIMEOUT_SECONDS * 1000,
  }));

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    checks.modelPing = { ok: false, error: "OPENAI_API_KEY missing." };
    checks.ok = false;
    return checks;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: resolveDoeDtcAgentModel(),
        temperature: 0,
        tools: DOEDTC_AGENT_TOOLS.slice(0, 3),
        messages: [
          { role: "system", content: "Reply with one word: ok" },
          { role: "user", content: "ping" },
        ],
      }),
    });
    if (!response.ok) {
      const body = await response.text();
      checks.modelPing = { ok: false, error: body.slice(0, 300) };
      checks.ok = false;
    } else {
      const json = (await response.json()) as {
        choices?: Array<{ message?: { content?: string | null } }>;
      };
      checks.modelPing = {
        ok: true,
        reply: json.choices?.[0]?.message?.content?.trim() ?? "",
      };
    }
  } catch (error) {
    checks.modelPing = {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
    checks.ok = false;
  }

  return checks;
}
