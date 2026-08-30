"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { DoeDtcNav } from "@/components/doedtc/DoeDtcNav";
import { DoeDtcArtifactView } from "@/components/doedtc/DoeDtcArtifactView";
import { DoeDtcFeedbackView } from "@/components/doedtc/DoeDtcFeedbackView";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import {
  DOEDTC_GET_STARTED,
  DOEDTC_PROFILE,
  doeDtcAppUrl,
} from "@/lib/doedtc/doedtc-copy";
import { formatArtifactEntryValues } from "@/lib/doedtc/doedtc-artifacts";
import type {
  DoeDtcFamilyRelationship,
  DoeDtcHealthProvider,
  DoeDtcProfileSnapshot,
  DoeDtcProfileTab,
} from "@/lib/doedtc/doedtc-types";
import { dmSans } from "@/lib/home/fonts";

const RELATIONSHIP_OPTIONS: Array<{ value: DoeDtcFamilyRelationship; label: string }> = [
  { value: "grandmother", label: "Grandmother" },
  { value: "grandfather", label: "Grandfather" },
  { value: "mother", label: "Mother" },
  { value: "father", label: "Father" },
  { value: "child", label: "Child" },
  { value: "sibling", label: "Sibling" },
  { value: "partner", label: "Partner" },
  { value: "other", label: "Other" },
];

function formatDateTime(value: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatDate(value: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function relationshipLabel(value: string): string {
  return RELATIONSHIP_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

function healthStatus(
  snapshot: DoeDtcProfileSnapshot,
  provider: DoeDtcHealthProvider,
): "disconnected" | "pending" | "connected" {
  return snapshot.healthConnections.find((row) => row.provider === provider)?.status ?? "disconnected";
}

type DoeDtcProfileAppProps = {
  token: string;
  valid: boolean;
  initialSnapshot: DoeDtcProfileSnapshot | null;
  initialTab: DoeDtcProfileTab;
  initialArtifactId?: string | null;
  initialTicketId?: string | null;
  viewingMemberUserId?: string | null;
};

export function DoeDtcProfileApp({
  token,
  valid,
  initialSnapshot,
  initialTab,
  initialArtifactId = null,
  initialTicketId = null,
  viewingMemberUserId = null,
}: DoeDtcProfileAppProps) {
  const [tab, setTab] = useState<DoeDtcProfileTab>(initialTab);
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [focusedArtifactId, setFocusedArtifactId] = useState<string | null>(initialArtifactId);
  const [focusedTicketId, setFocusedTicketId] = useState<string | null>(initialTicketId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const runAction = useCallback(
    async (action: string, payload: Record<string, unknown> = {}) => {
      setBusy(true);
      setError("");
      try {
        const response = await fetch("/api/doedtc/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            action,
            payload: viewingMemberUserId
              ? { ...payload, subjectUserId: viewingMemberUserId }
              : payload,
          }),
        });
        const json = (await response.json()) as {
          ok?: boolean;
          error?: string;
          snapshot?: DoeDtcProfileSnapshot;
        };
        if (!response.ok || !json.ok || !json.snapshot) {
          throw new Error(json.error ?? "Unable to update profile.");
        }
        setSnapshot(json.snapshot);
      } catch (actionError) {
        setError(actionError instanceof Error ? actionError.message : "Unable to update profile.");
      } finally {
        setBusy(false);
      }
    },
    [token, viewingMemberUserId],
  );

  const refetchSnapshot = useCallback(async () => {
    if (!valid) return;
    try {
      const params = new URLSearchParams({ t: token });
      if (viewingMemberUserId) params.set("member", viewingMemberUserId);
      const response = await fetch(`/api/doedtc/profile?${params.toString()}`, {
        cache: "no-store",
      });
      const json = (await response.json()) as {
        ok?: boolean;
        snapshot?: DoeDtcProfileSnapshot;
      };
      if (response.ok && json.ok && json.snapshot) {
        setSnapshot(json.snapshot);
      }
    } catch {
      // Ignore background refresh failures.
    }
  }, [token, valid, viewingMemberUserId]);

  useEffect(() => {
    void refetchSnapshot();

    function onVisibility() {
      if (document.visibilityState === "visible") void refetchSnapshot();
    }

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [refetchSnapshot]);

  useEffect(() => {
    if (initialArtifactId) {
      setFocusedArtifactId(initialArtifactId);
    }
  }, [initialArtifactId]);

  useEffect(() => {
    if (initialTicketId) {
      setFocusedTicketId(initialTicketId);
    }
  }, [initialTicketId]);

  useEffect(() => {
    void refetchSnapshot();
  }, [tab, refetchSnapshot]);

  const greeting = useMemo(() => {
    const name = snapshot?.user.full_name?.trim();
    if (viewingMemberUserId && name) return `${name}'s profile`;
    return name || "Your profile";
  }, [snapshot, viewingMemberUserId]);

  const canEditSubject = useMemo(() => {
    if (!viewingMemberUserId || !snapshot) return true;
    return snapshot.household.memberAccess.some(
      (row) => row.userId === viewingMemberUserId && row.canEdit,
    );
  }, [snapshot, viewingMemberUserId]);

  if (!valid || !snapshot) {
    return (
      <DoeDtcPageShell>
        <div className="doedtc-card">
          <strong>{DOEDTC_PROFILE.invalidTokenTitle}</strong>
          <p>{DOEDTC_PROFILE.invalidTokenBody}</p>
        </div>
      </DoeDtcPageShell>
    );
  }

  return (
    <DoeDtcPageShell>
      <DoeDtcNav token={token} activeTab={tab} onTabChange={setTab} />
      <header className="doedtc-header">
        <h1 className={`doedtc-headline ${dmSans.className}`}>{greeting}</h1>
        {viewingMemberUserId ? (
          <p className="doedtc-muted" style={{ marginTop: "0.35rem" }}>
            {canEditSubject ? null : `${DOEDTC_PROFILE.familyReadOnlyHint} `}
            <a href={doeDtcAppUrl(token, { tab: "family" })}>{DOEDTC_PROFILE.familyBackLabel}</a>
          </p>
        ) : null}
      </header>

      {error ? <p className="doedtc-error">{error}</p> : null}

      {tab === "dashboard" ? (
        <DashboardTab
          snapshot={snapshot}
          busy={busy}
          readOnly={!canEditSubject}
          onAction={runAction}
          onOpenTrackers={(artifactId) => {
            setFocusedArtifactId(artifactId ?? null);
            setTab("trackers");
          }}
          onOpenFeedback={(ticketId) => {
            setFocusedTicketId(ticketId ?? null);
            setTab("feedback");
          }}
        />
      ) : null}
      {tab === "appointments" ? (
        <AppointmentsTab snapshot={snapshot} busy={busy} readOnly={!canEditSubject} onAction={runAction} />
      ) : null}
      {tab === "results" ? (
        <ResultsTab snapshot={snapshot} busy={busy} readOnly={!canEditSubject} onAction={runAction} />
      ) : null}
      {tab === "conditions" ? (
        <ConditionsTab snapshot={snapshot} busy={busy} readOnly={!canEditSubject} onAction={runAction} />
      ) : null}
      {tab === "family" ? (
        <FamilyTab token={token} snapshot={snapshot} busy={busy} onAction={runAction} />
      ) : null}
      {tab === "locker" ? (
        <LockerTab snapshot={snapshot} busy={busy} readOnly={!canEditSubject} onAction={runAction} />
      ) : null}
      {tab === "share" ? (
        <ShareTab snapshot={snapshot} busy={busy} readOnly={!canEditSubject} onAction={runAction} />
      ) : null}
      {tab === "trackers" ? (
        <TrackersTab
          snapshot={snapshot}
          busy={busy}
          readOnly={!canEditSubject}
          onAction={runAction}
          focusedArtifactId={focusedArtifactId}
          onFocusArtifact={setFocusedArtifactId}
        />
      ) : null}
      {tab === "feedback" ? (
        <FeedbackTab
          snapshot={snapshot}
          busy={busy}
          readOnly={!canEditSubject}
          onAction={runAction}
          focusedTicketId={focusedTicketId}
          onFocusTicket={setFocusedTicketId}
        />
      ) : null}
    </DoeDtcPageShell>
  );
}

type TabProps = {
  snapshot: DoeDtcProfileSnapshot;
  busy: boolean;
  readOnly?: boolean;
  onAction: (action: string, payload?: Record<string, unknown>) => Promise<void>;
};

function MedicalListEditor({
  label,
  placeholder,
  values,
  addAction,
  removeAction,
  busy,
  readOnly = false,
  onAction,
}: {
  label: string;
  placeholder: string;
  values: string[];
  addAction: string;
  removeAction: string;
  busy: boolean;
  readOnly?: boolean;
  onAction: (action: string, payload?: Record<string, unknown>) => Promise<void>;
}) {
  const [draft, setDraft] = useState("");

  async function addValue() {
    const next = draft.trim();
    if (!next || values.some((value) => value.toLowerCase() === next.toLowerCase())) {
      setDraft("");
      return;
    }
    await onAction(addAction, { name: next });
    setDraft("");
  }

  return (
    <div>
      <p className="doedtc-label">{label}</p>
      {values.length === 0 ? (
        <p className="doedtc-muted">{DOEDTC_PROFILE.dashboardMedicalDeferred}</p>
      ) : (
        <div className="doedtc-tag-list">
          {values.map((value) => (
            <span className="doedtc-tag" key={value.toLowerCase()}>
              {value}
              {readOnly ? null : (
                <button
                  type="button"
                  aria-label={`Remove ${value}`}
                  disabled={busy}
                  onClick={() => onAction(removeAction, { name: value })}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      {readOnly ? null : (
      <div className="doedtc-add-row" style={{ marginTop: "0.75rem" }}>
        <input
          className="doedtc-input"
          value={draft}
          placeholder={placeholder}
          disabled={busy}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void addValue();
            }
          }}
        />
        <button
          className="doedtc-button doedtc-button--secondary doedtc-button--inline"
          type="button"
          disabled={busy}
          onClick={() => void addValue()}
        >
          Add
        </button>
      </div>
      )}
    </div>
  );
}

function DashboardTab({
  snapshot,
  busy,
  readOnly = false,
  onAction,
  onOpenTrackers,
  onOpenFeedback,
}: TabProps & {
  onOpenTrackers: (artifactId?: string | null) => void;
  onOpenFeedback: (ticketId?: string | null) => void;
}) {
  const trackerCards = snapshot.artifacts.map((artifact) => {
    const lastEntry = snapshot.artifactEntries
      .filter((entry) => entry.artifact_id === artifact.id)
      .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at))[0];
    return { artifact, lastEntry };
  });
  const openTickets = snapshot.tickets.filter((ticket) => ticket.status !== "resolved");

  return (
    <div>
      <div className="doedtc-card doedtc-card--flat">
        <p className="doedtc-eyebrow">{DOEDTC_PROFILE.dashboardWhyLabel}</p>
        <p className="doedtc-body">{snapshot.user.why_doe}</p>
      </div>

      <div className="doedtc-section">
        <h2 className="doedtc-section-title">{DOEDTC_PROFILE.dashboardMedicalLabel}</h2>
        <div className="doedtc-card">
          <MedicalListEditor
            label={DOEDTC_GET_STARTED.medicationsLabel}
            placeholder={DOEDTC_GET_STARTED.medicationsPlaceholder}
            values={snapshot.medications}
            addAction="add_medication"
            removeAction="remove_medication"
            busy={busy}
            readOnly={readOnly}
            onAction={onAction}
          />
          <div style={{ marginTop: "1.25rem" }}>
            <MedicalListEditor
              label={DOEDTC_GET_STARTED.conditionsLabel}
              placeholder={DOEDTC_GET_STARTED.conditionsPlaceholder}
              values={snapshot.conditions}
              addAction="add_condition"
              removeAction="remove_condition"
              busy={busy}
              readOnly={readOnly}
              onAction={onAction}
            />
          </div>
        </div>
      </div>

      {trackerCards.length > 0 ? (
        <div className="doedtc-section">
          <h2 className="doedtc-section-title">{DOEDTC_PROFILE.trackersDashboardTitle}</h2>
          <div className="doedtc-tracker-strip">
            {trackerCards.map(({ artifact, lastEntry }) => (
              <button
                key={artifact.id}
                type="button"
                className="doedtc-card doedtc-card--flat doedtc-tracker-card"
                onClick={() => onOpenTrackers(artifact.id)}
              >
                <strong>{artifact.title}</strong>
                <p className="doedtc-muted">
                  {lastEntry
                    ? formatArtifactEntryValues(artifact, lastEntry.values)
                    : DOEDTC_PROFILE.trackersNoEntries}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {openTickets.length > 0 ? (
        <div className="doedtc-section">
          <h2 className="doedtc-section-title">{DOEDTC_PROFILE.feedbackDashboardTitle}</h2>
          <div className="doedtc-tracker-strip">
            {openTickets.slice(0, 4).map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                className="doedtc-card doedtc-card--flat doedtc-tracker-card"
                onClick={() => onOpenFeedback(ticket.id)}
              >
                <strong>{ticket.title}</strong>
                <p className="doedtc-muted">
                  {ticket.kind === "bug"
                    ? DOEDTC_PROFILE.feedbackKindBug
                    : DOEDTC_PROFILE.feedbackKindFeedback}{" "}
                  ·{" "}
                  {ticket.status === "in_progress"
                    ? DOEDTC_PROFILE.feedbackStatusInProgress
                    : DOEDTC_PROFILE.feedbackStatusOpen}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="doedtc-section">
        <h2 className="doedtc-section-title">{DOEDTC_PROFILE.dashboardIntegrationsLabel}</h2>
        <div className="doedtc-integration-grid">
          <IntegrationCard
            title={DOEDTC_PROFILE.whoopTitle}
            body={DOEDTC_PROFILE.whoopBody}
            status={healthStatus(snapshot, "whoop")}
            busy={busy || readOnly}
            onConnect={() => onAction("connect_health", { provider: "whoop" })}
          />
          <IntegrationCard
            title={DOEDTC_PROFILE.appleHealthTitle}
            body={DOEDTC_PROFILE.appleHealthBody}
            status={healthStatus(snapshot, "apple_health")}
            busy={busy || readOnly}
            onConnect={() => onAction("connect_health", { provider: "apple_health" })}
          />
        </div>
      </div>
    </div>
  );
}

function ConditionsTab({ snapshot, busy, readOnly = false, onAction }: TabProps) {
  return (
    <div>
      <div className="doedtc-section">
        <h2 className="doedtc-section-title">{DOEDTC_GET_STARTED.conditionsLabel}</h2>
        <div className="doedtc-card">
          <MedicalListEditor
            label={DOEDTC_GET_STARTED.conditionsLabel}
            placeholder={DOEDTC_GET_STARTED.conditionsPlaceholder}
            values={snapshot.conditions}
            addAction="add_condition"
            removeAction="remove_condition"
            busy={busy}
            readOnly={readOnly}
            onAction={onAction}
          />
        </div>
      </div>

      <div className="doedtc-section">
        <h2 className="doedtc-section-title">{DOEDTC_GET_STARTED.medicationsLabel}</h2>
        <div className="doedtc-card">
          <MedicalListEditor
            label={DOEDTC_GET_STARTED.medicationsLabel}
            placeholder={DOEDTC_GET_STARTED.medicationsPlaceholder}
            values={snapshot.medications}
            addAction="add_medication"
            removeAction="remove_medication"
            busy={busy}
            readOnly={readOnly}
            onAction={onAction}
          />
        </div>
      </div>

      <div className="doedtc-section">
        <h2 className="doedtc-section-title">{DOEDTC_PROFILE.symptomsBoxTitle}</h2>
        <div className="doedtc-card doedtc-card--flat">
          {snapshot.symptoms.length === 0 ? (
            <p className="doedtc-empty">{DOEDTC_PROFILE.dashboardSymptomsEmpty}</p>
          ) : (
            <ul className="doedtc-symptom-log">
              {snapshot.symptoms.map((symptom) => (
                <li className="doedtc-symptom-item" key={symptom.id}>
                  <time className="doedtc-symptom-date" dateTime={symptom.reported_at}>
                    {formatDateTime(symptom.reported_at)}
                  </time>
                  <p className="doedtc-body">{symptom.summary?.trim() || symptom.raw_text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({
  title,
  body,
  status,
  busy,
  onConnect,
}: {
  title: string;
  body: string;
  status: "disconnected" | "pending" | "connected";
  busy: boolean;
  onConnect: () => void;
}) {
  const statusLabel =
    status === "connected"
      ? DOEDTC_PROFILE.connectedLabel
      : status === "pending"
        ? DOEDTC_PROFILE.pendingLabel
        : DOEDTC_PROFILE.connectLabel;

  return (
    <div className="doedtc-integration-card">
      <strong>{title}</strong>
      <p className="doedtc-muted" style={{ marginTop: "0.35rem" }}>
        {body}
      </p>
      {status === "disconnected" ? (
        <button className="doedtc-button doedtc-button--secondary" type="button" disabled={busy} onClick={onConnect}>
          {statusLabel}
        </button>
      ) : (
        <p className="doedtc-eyebrow" style={{ marginTop: "0.75rem" }}>
          {statusLabel}
        </p>
      )}
    </div>
  );
}

function AppointmentsTab({ snapshot, busy, readOnly = false, onAction }: TabProps) {
  const [title, setTitle] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [expandedListenId, setExpandedListenId] = useState<string | null>(null);

  const completedSessions = snapshot.listenSessions.filter((row) => row.status === "completed");
  const sessionsByAppointment = new Map<string, typeof completedSessions>();
  const standaloneSessions: typeof completedSessions = [];

  for (const session of completedSessions) {
    if (session.appointment_id) {
      const list = sessionsByAppointment.get(session.appointment_id) ?? [];
      list.push(session);
      sessionsByAppointment.set(session.appointment_id, list);
    } else {
      standaloneSessions.push(session);
    }
  }

  function renderListenSession(session: (typeof completedSessions)[number]) {
    const expanded = expandedListenId === session.id;
    return (
      <div className="doedtc-listen-nested" key={session.id}>
        <strong>Listen</strong>
        <p className="doedtc-row-item__meta">
          {formatDateTime(session.completed_at ?? session.created_at)}
          {session.duration_seconds
            ? ` · ${DOEDTC_PROFILE.listenDurationLabel}: ${formatDuration(session.duration_seconds)}`
            : null}
        </p>
        {session.summary ? <p className="doedtc-body">{session.summary}</p> : null}
        {session.transcript ? (
          <>
            <button
              className="doedtc-icon-button"
              type="button"
              style={{ marginTop: "0.5rem" }}
              onClick={() => setExpandedListenId(expanded ? null : session.id)}
            >
              {expanded ? DOEDTC_PROFILE.listenHideTranscript : DOEDTC_PROFILE.listenViewTranscript}
            </button>
            {expanded ? <p className="doedtc-body">{session.transcript}</p> : null}
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <h2 className="doedtc-section-title">{DOEDTC_PROFILE.appointmentsTitle}</h2>
      {snapshot.appointments.length === 0 ? (
        <p className="doedtc-empty">{DOEDTC_PROFILE.appointmentsEmpty}</p>
      ) : (
        <ul className="doedtc-row-list">
          {snapshot.appointments.map((appointment) => {
            const linkedSessions = sessionsByAppointment.get(appointment.id) ?? [];
            return (
              <li className="doedtc-row-item" key={appointment.id}>
                <div className="doedtc-row-item__body">
                  <strong>{appointment.title}</strong>
                  <p className="doedtc-row-item__meta">
                    {appointment.timing_note?.trim() ||
                      (appointment.starts_at ? formatDateTime(appointment.starts_at) : "Date not set")}
                  </p>
                  {appointment.location ? (
                    <p className="doedtc-row-item__meta">{appointment.location}</p>
                  ) : null}
                  {appointment.notes ? <p className="doedtc-body">{appointment.notes}</p> : null}
                  {linkedSessions.map((session) => renderListenSession(session))}
                </div>
                <div className="doedtc-row-item__actions">
                  {readOnly ? null : (
                    <button
                      className="doedtc-icon-button"
                      type="button"
                      disabled={busy}
                      onClick={() => onAction("remove_appointment", { appointmentId: appointment.id })}
                    >
                      {DOEDTC_PROFILE.removeLabel}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="doedtc-section">
        <h2 className="doedtc-section-title">{DOEDTC_PROFILE.listenSectionTitle}</h2>
        {completedSessions.length === 0 ? (
          <p className="doedtc-empty">{DOEDTC_PROFILE.listenSectionEmpty}</p>
        ) : standaloneSessions.length === 0 ? (
          <p className="doedtc-muted">{DOEDTC_PROFILE.listenLinkedTo}</p>
        ) : (
          <ul className="doedtc-row-list">
            {standaloneSessions.map((session) => (
              <li className="doedtc-row-item" key={session.id}>
                <div className="doedtc-row-item__body">{renderListenSession(session)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {readOnly ? null : (
      <form
        className="doedtc-card doedtc-card--spaced doedtc-form"
        onSubmit={async (event) => {
          event.preventDefault();
          const startsAt =
            appointmentDate && appointmentTime ? `${appointmentDate}T${appointmentTime}` : "";
          await onAction("add_appointment", { title, startsAt, location, notes });
          setTitle("");
          setAppointmentDate("");
          setAppointmentTime("");
          setLocation("");
          setNotes("");
        }}
      >
        <label className="doedtc-label">{DOEDTC_PROFILE.appointmentTitleLabel}</label>
        <input className="doedtc-input" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <div>
          <label className="doedtc-label">{DOEDTC_PROFILE.appointmentWhenLabel}</label>
          <div className="doedtc-datetime-row">
            <input
              className="doedtc-input"
              type="date"
              value={appointmentDate}
              onChange={(event) => setAppointmentDate(event.target.value)}
              required
            />
            <input
              className="doedtc-input"
              type="time"
              value={appointmentTime}
              onChange={(event) => setAppointmentTime(event.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="doedtc-label">{DOEDTC_PROFILE.appointmentLocationLabel}</label>
          <input className="doedtc-input" value={location} onChange={(event) => setLocation(event.target.value)} />
        </div>
        <div>
          <label className="doedtc-label">{DOEDTC_PROFILE.appointmentNotesLabel}</label>
          <textarea className="doedtc-textarea" value={notes} onChange={(event) => setNotes(event.target.value)} />
        </div>
        <button className="doedtc-button" type="submit" disabled={busy}>
          {DOEDTC_PROFILE.addAppointmentLabel}
        </button>
      </form>
      )}
    </div>
  );
}

function ResultsTab({ snapshot, busy, readOnly = false, onAction }: TabProps) {
  const [title, setTitle] = useState("");
  const [resultedAt, setResultedAt] = useState("");
  const [source, setSource] = useState("");
  const [summary, setSummary] = useState("");

  return (
    <div>
      <h2 className="doedtc-section-title">{DOEDTC_PROFILE.resultsTitle}</h2>
      {snapshot.results.length === 0 ? (
        <p className="doedtc-empty">{DOEDTC_PROFILE.resultsEmpty}</p>
      ) : (
        <ul className="doedtc-row-list">
          {snapshot.results.map((result) => (
            <li className="doedtc-row-item" key={result.id}>
              <div>
                <strong>{result.title}</strong>
                <p className="doedtc-row-item__meta">{formatDate(result.resulted_at)}</p>
                {result.source ? <p className="doedtc-row-item__meta">{result.source}</p> : null}
                {result.summary ? <p className="doedtc-body">{result.summary}</p> : null}
              </div>
              <div className="doedtc-row-item__actions">
                {readOnly ? null : (
                  <button
                    className="doedtc-icon-button"
                    type="button"
                    disabled={busy}
                    onClick={() => onAction("remove_result", { resultId: result.id })}
                  >
                    {DOEDTC_PROFILE.removeLabel}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {readOnly ? null : (
      <form
        className="doedtc-card doedtc-card--spaced"
        onSubmit={async (event) => {
          event.preventDefault();
          await onAction("add_result", { title, resultedAt, source, summary });
          setTitle("");
          setResultedAt("");
          setSource("");
          setSummary("");
        }}
      >
        <label className="doedtc-label">{DOEDTC_PROFILE.resultTitleLabel}</label>
        <input className="doedtc-input" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <div style={{ marginTop: "0.75rem" }}>
          <label className="doedtc-label">{DOEDTC_PROFILE.resultDateLabel}</label>
          <input
            className="doedtc-input"
            type="date"
            value={resultedAt}
            onChange={(event) => setResultedAt(event.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <label className="doedtc-label">{DOEDTC_PROFILE.resultSourceLabel}</label>
          <input className="doedtc-input" value={source} onChange={(event) => setSource(event.target.value)} />
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <label className="doedtc-label">{DOEDTC_PROFILE.resultSummaryLabel}</label>
          <textarea className="doedtc-textarea" value={summary} onChange={(event) => setSummary(event.target.value)} />
        </div>
        <button className="doedtc-button" type="submit" disabled={busy}>
          {DOEDTC_PROFILE.addResultLabel}
        </button>
      </form>
      )}
    </div>
  );
}

function FamilyTab({
  token,
  snapshot,
  busy,
  onAction,
}: TabProps & { token: string }) {
  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] = useState<DoeDtcFamilyRelationship>("other");
  const [phone, setPhone] = useState("");
  const [noPhone, setNoPhone] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [inviteBusyId, setInviteBusyId] = useState<string | null>(null);

  const members = snapshot.household.members;
  const isAdmin = snapshot.household.isAdmin;
  const accessByMemberId = useMemo(
    () => new Map(snapshot.household.memberAccess.map((row) => [row.memberId, row])),
    [snapshot.household.memberAccess],
  );

  async function sendInvite(memberId: string) {
    setInviteBusyId(memberId);
    try {
      await onAction("send_family_invite", { householdMemberId: memberId });
    } finally {
      setInviteBusyId(null);
    }
  }

  return (
    <div>
      <h2 className="doedtc-section-title">{DOEDTC_PROFILE.familyTitle}</h2>
      {members.length === 0 ? (
        <p className="doedtc-empty">{DOEDTC_PROFILE.familyEmpty}</p>
      ) : (
        <ul className="doedtc-row-list">
          {members.map((member) => {
            const access = accessByMemberId.get(member.id);
            const canView = Boolean(access?.canView && access.userId);
            return (
              <li className="doedtc-row-item" key={member.id}>
                <div>
                  <strong>
                    {member.full_name}
                    {member.role === "admin" ? (
                      <span className="doedtc-tag" style={{ marginLeft: "0.5rem" }}>
                        {DOEDTC_PROFILE.familyAdminBadge}
                      </span>
                    ) : null}
                  </strong>
                  <p className="doedtc-row-item__meta">{relationshipLabel(member.relationship)}</p>
                  {member.phone ? <p className="doedtc-row-item__meta">{member.phone}</p> : null}
                  <p className="doedtc-row-item__meta">
                    {member.status === "active"
                      ? DOEDTC_PROFILE.familyActiveLabel
                      : DOEDTC_PROFILE.familyPendingLabel}
                  </p>
                </div>
                <div className="doedtc-row-item__actions">
                  {canView && access?.userId ? (
                    <a
                      className="doedtc-button doedtc-button--secondary"
                      href={doeDtcAppUrl(token, { tab: "dashboard", member: access.userId })}
                    >
                      {DOEDTC_PROFILE.familyViewProfileLabel}
                    </a>
                  ) : null}
                  {isAdmin && member.role !== "admin" && member.phone && member.status !== "active" ? (
                    <button
                      className="doedtc-button doedtc-button--secondary"
                      type="button"
                      disabled={busy || inviteBusyId === member.id}
                      onClick={() => void sendInvite(member.id)}
                    >
                      {inviteBusyId === member.id
                        ? DOEDTC_PROFILE.familyInvitingLabel
                        : DOEDTC_PROFILE.familyInviteLabel}
                    </button>
                  ) : null}
                  {isAdmin && member.role !== "admin" ? (
                    <button
                      className="doedtc-icon-button"
                      type="button"
                      disabled={busy}
                      onClick={() => onAction("remove_family", { householdMemberId: member.id })}
                    >
                      {DOEDTC_PROFILE.removeLabel}
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {isAdmin ? (
        <form
          className="doedtc-card doedtc-card--spaced"
          onSubmit={async (event) => {
            event.preventDefault();
            await onAction("add_family", {
              fullName,
              relationship,
              phone: noPhone ? null : phone,
              dateOfBirth: relationship === "child" && dateOfBirth ? dateOfBirth : null,
            });
            setFullName("");
            setPhone("");
            setNoPhone(false);
            setDateOfBirth("");
          }}
        >
          <label className="doedtc-label">{DOEDTC_GET_STARTED.familyNameLabel}</label>
          <input className="doedtc-input" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          <div style={{ marginTop: "0.75rem" }}>
            <label className="doedtc-label">{DOEDTC_GET_STARTED.familyRelationshipLabel}</label>
            <select
              className="doedtc-select"
              value={relationship}
              onChange={(event) => setRelationship(event.target.value as DoeDtcFamilyRelationship)}
            >
              {RELATIONSHIP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {relationship === "child" ? (
            <div style={{ marginTop: "0.75rem" }}>
              <label className="doedtc-label">{DOEDTC_PROFILE.familyDobLabel}</label>
              <input
                className="doedtc-input"
                type="date"
                value={dateOfBirth}
                onChange={(event) => setDateOfBirth(event.target.value)}
              />
              <p className="doedtc-muted">{DOEDTC_PROFILE.familyDobHint}</p>
            </div>
          ) : null}
          {!noPhone ? (
            <div style={{ marginTop: "0.75rem" }}>
              <label className="doedtc-label">{DOEDTC_GET_STARTED.familyPhoneLabel}</label>
              <input className="doedtc-input" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
          ) : null}
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.75rem" }}>
            <input type="checkbox" checked={noPhone} onChange={(event) => setNoPhone(event.target.checked)} />
            <span>{DOEDTC_GET_STARTED.familyNoPhoneLabel}</span>
          </label>
          <button className="doedtc-button" type="submit" disabled={busy || !fullName.trim()}>
            {DOEDTC_GET_STARTED.familyAddLabel}
          </button>
        </form>
      ) : null}
    </div>
  );
}

function LockerTab({ snapshot, busy, readOnly = false, onAction }: TabProps) {
  const [label, setLabel] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h2 className="doedtc-section-title">{DOEDTC_PROFILE.lockerTitle}</h2>
      <p className="doedtc-muted">{DOEDTC_PROFILE.lockerHint}</p>
      {snapshot.lockerItems.length === 0 ? (
        <p className="doedtc-empty">{DOEDTC_PROFILE.lockerEmpty}</p>
      ) : (
        <ul className="doedtc-row-list">
          {snapshot.lockerItems.map((item) => (
            <li className="doedtc-row-item" key={item.id}>
              <div>
                <strong>{item.label}</strong>
                <p className="doedtc-row-item__meta">{item.username || "—"}</p>
                <p className="doedtc-row-item__meta">{DOEDTC_PROFILE.lockerSavedPassword}</p>
              </div>
              <div className="doedtc-row-item__actions">
                {readOnly ? null : (
                  <button
                    className="doedtc-icon-button"
                    type="button"
                    disabled={busy}
                    onClick={() => onAction("remove_locker", { itemId: item.id })}
                  >
                    {DOEDTC_PROFILE.removeLabel}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {readOnly ? null : (
      <form
        className="doedtc-card doedtc-card--spaced"
        onSubmit={async (event) => {
          event.preventDefault();
          await onAction("add_locker", { label, username, password });
          setLabel("");
          setUsername("");
          setPassword("");
        }}
      >
        <label className="doedtc-label">{DOEDTC_PROFILE.lockerLabelField}</label>
        <input className="doedtc-input" value={label} onChange={(event) => setLabel(event.target.value)} required />
        <div style={{ marginTop: "0.75rem" }}>
          <label className="doedtc-label">{DOEDTC_PROFILE.lockerUsernameField}</label>
          <input className="doedtc-input" value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <label className="doedtc-label">{DOEDTC_PROFILE.lockerPasswordField}</label>
          <input
            className="doedtc-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button className="doedtc-button" type="submit" disabled={busy}>
          {DOEDTC_PROFILE.addLockerLabel}
        </button>
      </form>
      )}
    </div>
  );
}

function ShareTab({ snapshot, busy, readOnly = false, onAction }: TabProps) {
  return (
    <div>
      <h2 className="doedtc-section-title">{DOEDTC_PROFILE.shareTitle}</h2>
      <p className="doedtc-muted">{DOEDTC_PROFILE.shareBody}</p>
      {snapshot.shareCodes.length === 0 ? (
        <p className="doedtc-empty">{DOEDTC_PROFILE.shareEmpty}</p>
      ) : (
        <ul className="doedtc-row-list">
          {snapshot.shareCodes.map((code) => (
            <li className="doedtc-row-item" key={code.id}>
              <div>
                <p className="doedtc-share-code">{code.code}</p>
                <p className="doedtc-row-item__meta">
                  {DOEDTC_PROFILE.shareExpiresLabel}: {formatDateTime(code.expires_at)}
                </p>
              </div>
              <div className="doedtc-row-item__actions">
                {readOnly ? null : (
                  <button
                    className="doedtc-icon-button"
                    type="button"
                    disabled={busy}
                    onClick={() => onAction("revoke_share", { shareCodeId: code.id })}
                  >
                    {DOEDTC_PROFILE.shareRevokeLabel}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {readOnly ? null : (
        <button
          className="doedtc-button"
          type="button"
          disabled={busy}
          onClick={() => onAction("generate_share")}
        >
          {DOEDTC_PROFILE.shareGenerateLabel}
        </button>
      )}
    </div>
  );
}

function TrackersTab({
  snapshot,
  busy,
  readOnly = false,
  onAction,
  focusedArtifactId,
  onFocusArtifact,
}: TabProps & {
  focusedArtifactId: string | null;
  onFocusArtifact: (artifactId: string | null) => void;
}) {
  const activeArtifact =
    snapshot.artifacts.find((artifact) => artifact.id === focusedArtifactId) ??
    snapshot.artifacts[0] ??
    null;

  return (
    <div>
      <h2 className="doedtc-section-title">{DOEDTC_PROFILE.trackersTitle}</h2>
      {snapshot.artifacts.length === 0 ? (
        <p className="doedtc-empty">{DOEDTC_PROFILE.trackersEmpty}</p>
      ) : (
        <>
          {snapshot.artifacts.length > 1 ? (
            <div className="doedtc-artifact-picker" role="tablist" aria-label="Trackers">
              {snapshot.artifacts.map((artifact) => (
                <button
                  key={artifact.id}
                  type="button"
                  aria-current={activeArtifact?.id === artifact.id ? "true" : undefined}
                  onClick={() => onFocusArtifact(artifact.id)}
                >
                  {artifact.title}
                </button>
              ))}
            </div>
          ) : null}
          {activeArtifact ? (
            <DoeDtcArtifactView
              artifact={activeArtifact}
              entries={snapshot.artifactEntries.filter(
                (entry) => entry.artifact_id === activeArtifact.id,
              )}
              busy={busy || readOnly}
              onAction={async (action, payload) => {
                await onAction(action, payload);
                if (action === "archive_artifact") {
                  onFocusArtifact(null);
                }
              }}
            />
          ) : (
            <p className="doedtc-muted">{DOEDTC_PROFILE.trackersSelectTracker}</p>
          )}
        </>
      )}
    </div>
  );
}

function FeedbackTab({
  snapshot,
  busy,
  readOnly = false,
  onAction,
  focusedTicketId,
  onFocusTicket,
}: TabProps & {
  focusedTicketId: string | null;
  onFocusTicket: (ticketId: string | null) => void;
}) {
  return (
    <div>
      <h2 className="doedtc-section-title">{DOEDTC_PROFILE.feedbackTitle}</h2>
      <DoeDtcFeedbackView
        tickets={snapshot.tickets}
        focusedTicketId={focusedTicketId}
        busy={busy || readOnly}
        onSubmit={async (payload) => {
          await onAction("submit_ticket", payload);
          onFocusTicket(null);
        }}
      />
    </div>
  );
}
