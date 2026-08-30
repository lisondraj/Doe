import { formatDoeDtcAppointmentWhen } from "@/lib/doedtc/doedtc-appointment-timing";
import { formatArtifactEntryValues } from "@/lib/doedtc/doedtc-artifacts";
import { getDoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-db";
import { formatMem0Block, searchDoeDtcMem0Memories } from "@/lib/doedtc/doedtc-memory";
import type {
  DoeDtcArtifactEntryRow,
  DoeDtcArtifactRow,
  DoeDtcPreparationPayload,
  DoeDtcPreparationWidget,
  DoeDtcProfileSnapshot,
} from "@/lib/doedtc/doedtc-types";

function formatWhen(value: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value.slice(0, 10);
  }
}

function reasonMentions(value: string | null | undefined, terms: string[]): boolean {
  const lower = (value ?? "").toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function defaultTitle(reason?: string | null): string {
  const trimmed = reason?.trim();
  if (trimmed) return trimmed.length > 80 ? `${trimmed.slice(0, 77)}…` : trimmed;
  return "Health summary for your provider";
}

function buildHeaderWidget(snapshot: DoeDtcProfileSnapshot): DoeDtcPreparationWidget | null {
  const name = snapshot.user.full_name?.trim();
  const why = snapshot.user.why_doe?.trim();
  if (!name && !why) return null;
  return {
    kind: "header",
    title: name ?? "Patient summary",
    body: why ?? undefined,
  };
}

function buildListWidget(
  kind: "medications" | "conditions" | "symptoms" | "appointments" | "results" | "family",
  title: string,
  items: string[],
): DoeDtcPreparationWidget | null {
  if (items.length === 0) return null;
  return { kind, title, items };
}

function buildTrackerSeriesWidget(
  artifact: DoeDtcArtifactRow,
  entries: DoeDtcArtifactEntryRow[],
  fieldKey: string,
  fieldLabel: string,
): DoeDtcPreparationWidget | null {
  const points = entries
    .map((entry) => {
      const raw = entry.values[fieldKey];
      const value = typeof raw === "number" ? raw : Number(String(raw ?? ""));
      if (!Number.isFinite(value)) return null;
      return { at: entry.occurred_at, value };
    })
    .filter((point): point is { at: string; value: number } => Boolean(point))
    .sort((a, b) => a.at.localeCompare(b.at))
    .slice(-12);

  if (points.length < 2) return null;

  return {
    kind: "tracker_series",
    title: `${artifact.title} — ${fieldLabel}`,
    artifactTitle: artifact.title,
    fieldLabel,
    points,
  };
}

function pickTrackerWidgets(
  snapshot: DoeDtcProfileSnapshot,
  reason?: string | null,
): DoeDtcPreparationWidget[] {
  const preferWeight =
    reasonMentions(reason, ["weight", "ozempic", "wegovy", "mounjaro", "glp", "refill"]) ||
    reasonMentions(reason, ["diabetes", "injection", "shot"]);
  const widgets: DoeDtcPreparationWidget[] = [];

  for (const artifact of snapshot.artifacts) {
    const entries = snapshot.artifactEntries
      .filter((entry) => entry.artifact_id === artifact.id)
      .sort((a, b) => a.occurred_at.localeCompare(b.occurred_at));

    const numericFields = artifact.config.fields.filter((field) => field.type === "number");
    const weightField = numericFields.find((field) =>
      /weight|lbs|kg|pound/i.test(`${field.key} ${field.label}`),
    );
    const preferredField =
      preferWeight && weightField
        ? weightField
        : numericFields[0] ??
          artifact.config.fields.find((field) => field.type === "select" || field.type === "text");

    if (numericFields.length > 0 && preferredField?.type === "number") {
      const series = buildTrackerSeriesWidget(artifact, entries, preferredField.key, preferredField.label);
      if (series) widgets.push(series);
      continue;
    }

    const recent = entries.slice(-5).reverse();
    if (recent.length === 0) continue;
    widgets.push({
      kind: "tracker_log",
      title: artifact.title,
      items: recent.map(
        (entry) => `${formatWhen(entry.occurred_at)} — ${formatArtifactEntryValues(artifact, entry.values)}`,
      ),
    });
  }

  return widgets.slice(0, 3);
}

export async function buildDoeDtcPreparationPayload(params: {
  userId: string;
  reason?: string | null;
  title?: string | null;
}): Promise<DoeDtcPreparationPayload> {
  const snapshot = await getDoeDtcProfileSnapshot(params.userId);
  const memoryRows = await searchDoeDtcMem0Memories({
    userId: params.userId,
    query: params.reason?.trim() || "health provider visit summary",
    topK: 4,
  });
  const memoryBlock = formatMem0Block(memoryRows);
  const memoryItems =
    memoryBlock && memoryBlock !== "No relevant memories."
      ? memoryBlock
          .split("\n")
          .map((line) => line.replace(/^-\s*/, "").trim())
          .filter(Boolean)
      : [];

  const now = Date.now();
  const appointments = snapshot.appointments
    .map((row) => {
      const when = formatDoeDtcAppointmentWhen(row);
      const parts = [row.title, when];
      if (row.location) parts.push(row.location);
      if (row.notes) parts.push(row.notes);
      return { text: parts.join(" · "), startsAt: row.starts_at };
    })
    .sort((a, b) => {
      const aTime = a.startsAt ? new Date(a.startsAt).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.startsAt ? new Date(b.startsAt).getTime() : Number.MAX_SAFE_INTEGER;
      const aFuture = aTime >= now ? 0 : 1;
      const bFuture = bTime >= now ? 0 : 1;
      if (aFuture !== bFuture) return aFuture - bFuture;
      return aTime - bTime;
    })
    .slice(0, 6)
    .map((row) => row.text);

  const widgets: DoeDtcPreparationWidget[] = [];
  const header = buildHeaderWidget(snapshot);
  if (header) widgets.push(header);

  const meds = buildListWidget("medications", "Medications", snapshot.medications);
  if (meds) widgets.push(meds);

  const conditions = buildListWidget("conditions", "Conditions", snapshot.conditions);
  if (conditions) widgets.push(conditions);

  const symptoms = buildListWidget(
    "symptoms",
    "Recent symptoms",
    snapshot.symptoms
      .slice(0, 6)
      .map((row) => row.summary?.trim() || row.raw_text.trim())
      .filter(Boolean),
  );
  if (symptoms) widgets.push(symptoms);

  const appts = buildListWidget("appointments", "Appointments", appointments);
  if (appts) widgets.push(appts);

  widgets.push(...pickTrackerWidgets(snapshot, params.reason));

  const results = buildListWidget(
    "results",
    "Recent results",
    snapshot.results.slice(0, 5).map((row) => {
      const parts = [row.title, formatWhen(row.resulted_at)];
      if (row.summary) parts.push(row.summary);
      return parts.join(" · ");
    }),
  );
  if (results) widgets.push(results);

  if (
    reasonMentions(params.reason, ["family", "caregiver", "partner", "mother", "father", "child"]) &&
    snapshot.familyMembers.length > 0
  ) {
    const family = buildListWidget(
      "family",
      "Family",
      snapshot.familyMembers.map((row) => `${row.full_name} (${row.relationship})`),
    );
    if (family) widgets.push(family);
  }

  if (memoryItems.length > 0) {
    widgets.push({
      kind: "notes",
      title: "Relevant context",
      items: memoryItems.slice(0, 4),
    });
  }

  return {
    title: params.title?.trim() || defaultTitle(params.reason),
    reason: params.reason?.trim() || null,
    generatedAt: new Date().toISOString(),
    patientName: snapshot.user.full_name?.trim() || null,
    widgets,
  };
}
