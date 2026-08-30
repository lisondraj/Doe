import { formatDoeDtcAppointmentWhen } from "@/lib/doedtc/doedtc-appointment-timing";
import { formatArtifactEntryValues } from "@/lib/doedtc/doedtc-artifacts";
import { getDoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-db";
import type {
  DoeDtcHealthConnectionStatus,
  DoeDtcHealthProvider,
  DoeDtcProfileSnapshot,
  DoeDtcProfileTab,
} from "@/lib/doedtc/doedtc-types";

export const DOEDTC_PROFILE_READ_TABS = [
  "dashboard",
  "appointments",
  "results",
  "conditions",
  "family",
  "locker",
  "share",
  "trackers",
] as const satisfies readonly DoeDtcProfileTab[];

const HEALTH_PROVIDERS: Array<{ id: DoeDtcHealthProvider; label: string }> = [
  { id: "whoop", label: "Whoop" },
  { id: "apple_health", label: "Apple Health" },
];

function healthStatus(
  snapshot: DoeDtcProfileSnapshot,
  provider: DoeDtcHealthProvider,
): DoeDtcHealthConnectionStatus {
  return snapshot.healthConnections.find((row) => row.provider === provider)?.status ?? "disconnected";
}

function formatHealthStatus(status: DoeDtcHealthConnectionStatus): string {
  switch (status) {
    case "connected":
      return "connected";
    case "pending":
      return "pending (not finished connecting)";
    default:
      return "not connected";
  }
}

export function formatDoeDtcIntegrations(snapshot: DoeDtcProfileSnapshot): string {
  return HEALTH_PROVIDERS.map(
    (provider) => `- ${provider.label}: ${formatHealthStatus(healthStatus(snapshot, provider.id))}`,
  ).join("\n");
}

function formatDashboardTab(snapshot: DoeDtcProfileSnapshot): string {
  const user = snapshot.user;
  const lines = [
    `Name: ${user.full_name ?? "Unknown"}`,
    `Email: ${user.email ?? "Not listed"}`,
    `Why Doe: ${user.why_doe ?? "Not specified"}`,
    `Medical info: ${user.medical_deferred ? "Deferred — they chose to add later." : "On file"}`,
    `Medications: ${snapshot.medications.join(", ") || "None listed"}`,
    `Conditions: ${snapshot.conditions.join(", ") || "None listed"}`,
    "Integrations:",
    formatDoeDtcIntegrations(snapshot),
  ];
  return lines.join("\n");
}

function formatAppointmentsTab(snapshot: DoeDtcProfileSnapshot): string {
  if (snapshot.appointments.length === 0) return "No appointments logged.";
  return snapshot.appointments
    .slice(0, 12)
    .map((row) => {
      const when = formatDoeDtcAppointmentWhen(row);
      const parts = [`${row.title} | when: ${when}`];
      if (row.timing_note) parts.push("(approximate)");
      if (row.location) parts.push(`at ${row.location}`);
      if (row.notes) parts.push(`notes: ${row.notes}`);
      parts.push(`id: ${row.id}`);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

function formatResultsTab(snapshot: DoeDtcProfileSnapshot): string {
  if (snapshot.results.length === 0) return "No lab or imaging results logged.";
  return snapshot.results
    .slice(0, 12)
    .map((row) => {
      const parts = [row.title, `date: ${row.resulted_at.slice(0, 10)}`];
      if (row.source) parts.push(`source: ${row.source}`);
      if (row.summary) parts.push(row.summary);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

function formatConditionsTab(snapshot: DoeDtcProfileSnapshot): string {
  const symptoms =
    snapshot.symptoms.length === 0
      ? "None logged."
      : snapshot.symptoms
          .slice(0, 8)
          .map((row) => `- ${row.summary?.trim() || row.raw_text.trim()}`)
          .join("\n");
  return [
    `Medications: ${snapshot.medications.join(", ") || "None listed"}`,
    `Conditions: ${snapshot.conditions.join(", ") || "None listed"}`,
    "Recent symptoms:",
    symptoms,
  ].join("\n");
}

function formatFamilyTab(snapshot: DoeDtcProfileSnapshot): string {
  if (snapshot.familyMembers.length === 0) return "No family members logged.";
  return snapshot.familyMembers
    .map((row) => {
      const parts = [`${row.full_name} (${row.relationship})`];
      if (row.phone) parts.push(`phone: ${row.phone}`);
      parts.push(`id: ${row.id}`);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

function formatLockerTab(snapshot: DoeDtcProfileSnapshot): string {
  if (snapshot.lockerItems.length === 0) return "No locker credentials saved.";
  return snapshot.lockerItems
    .map((row) => `- ${row.label}${row.username ? ` | username: ${row.username}` : ""}`)
    .join("\n");
}

function formatShareTab(snapshot: DoeDtcProfileSnapshot): string {
  if (snapshot.shareCodes.length === 0) return "No active share codes.";
  return snapshot.shareCodes
    .map((row) => `- ${row.code} | expires: ${row.expires_at}`)
    .join("\n");
}

function formatTrackersTab(snapshot: DoeDtcProfileSnapshot): string {
  if (snapshot.artifacts.length === 0) return "No trackers yet.";
  return snapshot.artifacts
    .map((artifact) => {
      const entries = snapshot.artifactEntries
        .filter((entry) => entry.artifact_id === artifact.id)
        .slice(0, 5);
      const entryLines =
        entries.length === 0
          ? "  (no entries yet)"
          : entries
              .map((entry) => {
                const when = entry.occurred_at.slice(0, 16).replace("T", " ");
                const summary = formatArtifactEntryValues(artifact, entry.values);
                return `  - ${when} | ${summary} | id: ${entry.id}`;
              })
              .join("\n");
      return `- ${artifact.title} (${artifact.kind}) | id: ${artifact.id}\n${entryLines}`;
    })
    .join("\n");
}

export function formatDoeDtcProfileTab(
  snapshot: DoeDtcProfileSnapshot,
  tab: DoeDtcProfileTab,
): string {
  switch (tab) {
    case "dashboard":
      return formatDashboardTab(snapshot);
    case "appointments":
      return formatAppointmentsTab(snapshot);
    case "results":
      return formatResultsTab(snapshot);
    case "conditions":
      return formatConditionsTab(snapshot);
    case "family":
      return formatFamilyTab(snapshot);
    case "locker":
      return formatLockerTab(snapshot);
    case "share":
      return formatShareTab(snapshot);
    case "trackers":
      return formatTrackersTab(snapshot);
    default:
      return "Unknown profile tab.";
  }
}

export function formatDoeDtcProfileOverview(snapshot: DoeDtcProfileSnapshot): string {
  const listenPending = snapshot.listenSessions.filter((row) => row.status === "pending").length;
  const listenDone = snapshot.listenSessions.filter((row) => row.status === "completed").length;
  return [
    "Integrations:",
    formatDoeDtcIntegrations(snapshot),
    `Email: ${snapshot.user.email ?? "Not listed"}`,
    `Results: ${snapshot.results.length === 0 ? "None logged" : `${snapshot.results.length} logged`}`,
    `Locker: ${
      snapshot.lockerItems.length === 0
        ? "No saved credentials"
        : snapshot.lockerItems.map((row) => row.label).join(", ")
    }`,
    `Share codes: ${snapshot.shareCodes.length === 0 ? "None active" : `${snapshot.shareCodes.length} active`}`,
    `Listen: ${listenPending} pending, ${listenDone} completed`,
    `Trackers: ${
      snapshot.artifacts.length === 0
        ? "None yet"
        : snapshot.artifacts.map((row) => row.title).join(", ")
    }`,
  ].join("\n");
}

export async function readDoeDtcProfileTab(params: {
  userId: string;
  tab: DoeDtcProfileTab;
}): Promise<{ tab: DoeDtcProfileTab; content: string }> {
  const snapshot = await getDoeDtcProfileSnapshot(params.userId);
  return {
    tab: params.tab,
    content: formatDoeDtcProfileTab(snapshot, params.tab),
  };
}
