"use client";

import { useCallback, useMemo, useState } from "react";

import { DoeDtcNav } from "@/components/doedtc/DoeDtcNav";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import {
  DOEDTC_GET_STARTED,
  DOEDTC_PROFILE,
} from "@/lib/doedtc/doedtc-copy";
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
};

export function DoeDtcProfileApp({
  token,
  valid,
  initialSnapshot,
  initialTab,
}: DoeDtcProfileAppProps) {
  const [tab, setTab] = useState<DoeDtcProfileTab>(initialTab);
  const [snapshot, setSnapshot] = useState(initialSnapshot);
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
          body: JSON.stringify({ token, action, payload }),
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
    [token],
  );

  const greeting = useMemo(() => snapshot?.user.full_name?.trim() || "Your profile", [snapshot]);

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
      </header>

      {error ? <p className="doedtc-error">{error}</p> : null}

      {tab === "dashboard" ? (
        <DashboardTab snapshot={snapshot} busy={busy} onAction={runAction} />
      ) : null}
      {tab === "appointments" ? (
        <AppointmentsTab snapshot={snapshot} busy={busy} onAction={runAction} />
      ) : null}
      {tab === "results" ? <ResultsTab snapshot={snapshot} busy={busy} onAction={runAction} /> : null}
      {tab === "family" ? <FamilyTab snapshot={snapshot} busy={busy} onAction={runAction} /> : null}
      {tab === "locker" ? <LockerTab snapshot={snapshot} busy={busy} onAction={runAction} /> : null}
      {tab === "share" ? <ShareTab snapshot={snapshot} busy={busy} onAction={runAction} /> : null}
    </DoeDtcPageShell>
  );
}

type TabProps = {
  snapshot: DoeDtcProfileSnapshot;
  busy: boolean;
  onAction: (action: string, payload?: Record<string, unknown>) => Promise<void>;
};

function DashboardTab({ snapshot, busy, onAction }: TabProps) {
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [medDraft, setMedDraft] = useState("");
  const [conditionDraft, setConditionDraft] = useState("");
  const [medications, setMedications] = useState(snapshot.medications);
  const [conditions, setConditions] = useState(snapshot.conditions);

  return (
    <div>
      <div className="doedtc-card doedtc-card--flat">
        <p className="doedtc-eyebrow">{DOEDTC_PROFILE.dashboardWhyLabel}</p>
        <p className="doedtc-body">{snapshot.user.why_doe}</p>
      </div>

      <div className="doedtc-section">
        <h2 className="doedtc-section-title">{DOEDTC_PROFILE.dashboardMedicalLabel}</h2>
        {snapshot.user.medical_deferred && medications.length === 0 && conditions.length === 0 ? (
          <div className="doedtc-card">
            <p className="doedtc-muted">{DOEDTC_PROFILE.dashboardMedicalDeferred}</p>
            {!showMedicalForm ? (
              <button
                className="doedtc-button doedtc-button--secondary"
                type="button"
                disabled={busy}
                onClick={() => setShowMedicalForm(true)}
              >
                {DOEDTC_PROFILE.dashboardAddMedical}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="doedtc-card">
            <p className="doedtc-label">{DOEDTC_GET_STARTED.medicationsLabel}</p>
            <div className="doedtc-tag-list">
              {medications.map((value) => (
                <span className="doedtc-tag doedtc-tag--readonly" key={value}>
                  {value}
                </span>
              ))}
            </div>
            <p className="doedtc-label" style={{ marginTop: "1rem" }}>
              {DOEDTC_GET_STARTED.conditionsLabel}
            </p>
            <div className="doedtc-tag-list">
              {conditions.map((value) => (
                <span className="doedtc-tag doedtc-tag--readonly" key={value}>
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}

        {(showMedicalForm || (!snapshot.user.medical_deferred && medications.length === 0)) && (
          <form
            className="doedtc-card doedtc-card--spaced"
            onSubmit={async (event) => {
              event.preventDefault();
              await onAction("update_medical", { medications, conditions });
              setShowMedicalForm(false);
            }}
          >
            <div className="doedtc-add-row">
              <input
                className="doedtc-input"
                value={medDraft}
                placeholder={DOEDTC_GET_STARTED.medicationsPlaceholder}
                onChange={(event) => setMedDraft(event.target.value)}
              />
              <button
                className="doedtc-button doedtc-button--secondary doedtc-button--inline"
                type="button"
                onClick={() => {
                  const next = medDraft.trim();
                  if (!next || medications.includes(next)) return;
                  setMedications([...medications, next]);
                  setMedDraft("");
                }}
              >
                Add
              </button>
            </div>
            <div className="doedtc-add-row" style={{ marginTop: "0.75rem" }}>
              <input
                className="doedtc-input"
                value={conditionDraft}
                placeholder={DOEDTC_GET_STARTED.conditionsPlaceholder}
                onChange={(event) => setConditionDraft(event.target.value)}
              />
              <button
                className="doedtc-button doedtc-button--secondary doedtc-button--inline"
                type="button"
                onClick={() => {
                  const next = conditionDraft.trim();
                  if (!next || conditions.includes(next)) return;
                  setConditions([...conditions, next]);
                  setConditionDraft("");
                }}
              >
                Add
              </button>
            </div>
            <button className="doedtc-button" type="submit" disabled={busy}>
              {busy ? DOEDTC_PROFILE.savingLabel : DOEDTC_PROFILE.saveLabel}
            </button>
          </form>
        )}
      </div>

      <div className="doedtc-section">
        <h2 className="doedtc-section-title">{DOEDTC_PROFILE.dashboardSymptomsLabel}</h2>
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

      <div className="doedtc-section">
        <h2 className="doedtc-section-title">{DOEDTC_PROFILE.dashboardIntegrationsLabel}</h2>
        <div className="doedtc-integration-grid">
          <IntegrationCard
            title={DOEDTC_PROFILE.whoopTitle}
            body={DOEDTC_PROFILE.whoopBody}
            status={healthStatus(snapshot, "whoop")}
            busy={busy}
            onConnect={() => onAction("connect_health", { provider: "whoop" })}
          />
          <IntegrationCard
            title={DOEDTC_PROFILE.appleHealthTitle}
            body={DOEDTC_PROFILE.appleHealthBody}
            status={healthStatus(snapshot, "apple_health")}
            busy={busy}
            onConnect={() => onAction("connect_health", { provider: "apple_health" })}
          />
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

function AppointmentsTab({ snapshot, busy, onAction }: TabProps) {
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
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
                <div style={{ width: "100%" }}>
                  <strong>{appointment.title}</strong>
                  <p className="doedtc-row-item__meta">{formatDateTime(appointment.starts_at)}</p>
                  {appointment.location ? (
                    <p className="doedtc-row-item__meta">{appointment.location}</p>
                  ) : null}
                  {appointment.notes ? <p className="doedtc-body">{appointment.notes}</p> : null}
                  {linkedSessions.map((session) => renderListenSession(session))}
                </div>
                <div className="doedtc-row-item__actions">
                  <button
                    className="doedtc-icon-button"
                    type="button"
                    disabled={busy}
                    onClick={() => onAction("remove_appointment", { appointmentId: appointment.id })}
                  >
                    {DOEDTC_PROFILE.removeLabel}
                  </button>
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
                <div style={{ width: "100%" }}>{renderListenSession(session)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        className="doedtc-card doedtc-card--spaced"
        onSubmit={async (event) => {
          event.preventDefault();
          await onAction("add_appointment", { title, startsAt, location, notes });
          setTitle("");
          setStartsAt("");
          setLocation("");
          setNotes("");
        }}
      >
        <label className="doedtc-label">{DOEDTC_PROFILE.appointmentTitleLabel}</label>
        <input className="doedtc-input" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <div style={{ marginTop: "0.75rem" }}>
          <label className="doedtc-label">{DOEDTC_PROFILE.appointmentWhenLabel}</label>
          <input
            className="doedtc-input"
            type="datetime-local"
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <label className="doedtc-label">{DOEDTC_PROFILE.appointmentLocationLabel}</label>
          <input className="doedtc-input" value={location} onChange={(event) => setLocation(event.target.value)} />
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <label className="doedtc-label">{DOEDTC_PROFILE.appointmentNotesLabel}</label>
          <textarea className="doedtc-textarea" value={notes} onChange={(event) => setNotes(event.target.value)} />
        </div>
        <button className="doedtc-button" type="submit" disabled={busy}>
          {DOEDTC_PROFILE.addAppointmentLabel}
        </button>
      </form>
    </div>
  );
}

function ResultsTab({ snapshot, busy, onAction }: TabProps) {
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
                <button
                  className="doedtc-icon-button"
                  type="button"
                  disabled={busy}
                  onClick={() => onAction("remove_result", { resultId: result.id })}
                >
                  {DOEDTC_PROFILE.removeLabel}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

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
    </div>
  );
}

function FamilyTab({ snapshot, busy, onAction }: TabProps) {
  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] = useState<DoeDtcFamilyRelationship>("other");
  const [phone, setPhone] = useState("");
  const [noPhone, setNoPhone] = useState(false);

  return (
    <div>
      <h2 className="doedtc-section-title">{DOEDTC_PROFILE.familyTitle}</h2>
      {snapshot.familyMembers.length === 0 ? (
        <p className="doedtc-empty">{DOEDTC_PROFILE.familyEmpty}</p>
      ) : (
        <ul className="doedtc-row-list">
          {snapshot.familyMembers.map((member) => (
            <li className="doedtc-row-item" key={member.id}>
              <div>
                <strong>{member.full_name}</strong>
                <p className="doedtc-row-item__meta">{relationshipLabel(member.relationship)}</p>
                {member.phone ? <p className="doedtc-row-item__meta">{member.phone}</p> : null}
              </div>
              <div className="doedtc-row-item__actions">
                <button
                  className="doedtc-icon-button"
                  type="button"
                  disabled={busy}
                  onClick={() => onAction("remove_family", { memberId: member.id })}
                >
                  {DOEDTC_PROFILE.removeLabel}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form
        className="doedtc-card doedtc-card--spaced"
        onSubmit={async (event) => {
          event.preventDefault();
          await onAction("add_family", {
            fullName,
            relationship,
            phone: noPhone ? null : phone,
          });
          setFullName("");
          setPhone("");
          setNoPhone(false);
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
    </div>
  );
}

function LockerTab({ snapshot, busy, onAction }: TabProps) {
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
                <button
                  className="doedtc-icon-button"
                  type="button"
                  disabled={busy}
                  onClick={() => onAction("remove_locker", { itemId: item.id })}
                >
                  {DOEDTC_PROFILE.removeLabel}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

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
    </div>
  );
}

function ShareTab({ snapshot, busy, onAction }: TabProps) {
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
                <button
                  className="doedtc-icon-button"
                  type="button"
                  disabled={busy}
                  onClick={() => onAction("revoke_share", { shareCodeId: code.id })}
                >
                  {DOEDTC_PROFILE.shareRevokeLabel}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button
        className="doedtc-button"
        type="button"
        disabled={busy}
        onClick={() => onAction("generate_share")}
      >
        {DOEDTC_PROFILE.shareGenerateLabel}
      </button>
    </div>
  );
}
