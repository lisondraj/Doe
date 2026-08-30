"use client";

import { useMemo, useState } from "react";

import { DOEDTC_PROFILE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcTicketKind, DoeDtcTicketRow, DoeDtcTicketStatus } from "@/lib/doedtc/doedtc-types";

function formatWhen(value: string): string {
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

function kindLabel(kind: DoeDtcTicketKind): string {
  return kind === "bug" ? DOEDTC_PROFILE.feedbackKindBug : DOEDTC_PROFILE.feedbackKindFeedback;
}

function statusLabel(status: DoeDtcTicketStatus): string {
  switch (status) {
    case "in_progress":
      return DOEDTC_PROFILE.feedbackStatusInProgress;
    case "resolved":
      return DOEDTC_PROFILE.feedbackStatusResolved;
    default:
      return DOEDTC_PROFILE.feedbackStatusOpen;
  }
}

type DoeDtcFeedbackViewProps = {
  tickets: DoeDtcTicketRow[];
  focusedTicketId?: string | null;
  busy?: boolean;
  showForm?: boolean;
  onSubmit?: (payload: { kind: DoeDtcTicketKind; title: string; body: string }) => Promise<void>;
};

export function DoeDtcFeedbackView({
  tickets,
  focusedTicketId = null,
  busy = false,
  showForm = true,
  onSubmit,
}: DoeDtcFeedbackViewProps) {
  const [kind, setKind] = useState<DoeDtcTicketKind>("feedback");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(focusedTicketId);

  const sortedTickets = useMemo(
    () => [...tickets].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [tickets],
  );

  const activeTicket =
    sortedTickets.find((ticket) => ticket.id === selectedId) ??
    sortedTickets.find((ticket) => ticket.id === focusedTicketId) ??
    sortedTickets[0] ??
    null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!onSubmit) return;
    const nextTitle = title.trim();
    const nextBody = body.trim();
    if (!nextTitle || !nextBody) return;
    await onSubmit({ kind, title: nextTitle, body: nextBody });
    setTitle("");
    setBody("");
    setKind("feedback");
  }

  return (
    <div className="doedtc-feedback">
      {sortedTickets.length === 0 ? (
        <p className="doedtc-empty">{DOEDTC_PROFILE.feedbackEmpty}</p>
      ) : (
        <>
          {sortedTickets.length > 1 ? (
            <div className="doedtc-artifact-picker" role="tablist" aria-label="Reports">
              {sortedTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  aria-current={activeTicket?.id === ticket.id ? "true" : undefined}
                  onClick={() => setSelectedId(ticket.id)}
                >
                  {ticket.title}
                </button>
              ))}
            </div>
          ) : null}

          {activeTicket ? (
            <div className="doedtc-card doedtc-card--flat doedtc-feedback__detail">
              <div className="doedtc-feedback__meta">
                <span className="doedtc-badge">{kindLabel(activeTicket.kind)}</span>
                <span className="doedtc-badge doedtc-badge--muted">{statusLabel(activeTicket.status)}</span>
              </div>
              <h2 className="doedtc-section-title">{activeTicket.title}</h2>
              <p className="doedtc-muted">{formatWhen(activeTicket.created_at)}</p>
              <p className="doedtc-body">{activeTicket.body}</p>
            </div>
          ) : null}

          {sortedTickets.length > 1 ? (
            <div className="doedtc-section">
              <h3 className="doedtc-section-title">All reports</h3>
              <div className="doedtc-list">
                {sortedTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    className="doedtc-card doedtc-card--flat doedtc-tracker-card doedtc-feedback__row"
                    aria-current={activeTicket?.id === ticket.id ? "true" : undefined}
                    onClick={() => setSelectedId(ticket.id)}
                  >
                    <div className="doedtc-feedback__meta">
                      <span className="doedtc-badge">{kindLabel(ticket.kind)}</span>
                      <span className="doedtc-badge doedtc-badge--muted">{statusLabel(ticket.status)}</span>
                    </div>
                    <strong>{ticket.title}</strong>
                    <p className="doedtc-muted">{formatWhen(ticket.created_at)}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}

      {showForm && onSubmit ? (
        <form className="doedtc-card doedtc-card--spaced doedtc-feedback__form" onSubmit={(event) => void handleSubmit(event)}>
          <h3 className="doedtc-section-title">{DOEDTC_PROFILE.feedbackSubmitLabel}</h3>
          <label className="doedtc-label" htmlFor="feedback-kind">
            {DOEDTC_PROFILE.feedbackKindLabel}
          </label>
          <select
            id="feedback-kind"
            className="doedtc-input"
            value={kind}
            disabled={busy}
            onChange={(event) => setKind(event.target.value as DoeDtcTicketKind)}
          >
            <option value="feedback">{DOEDTC_PROFILE.feedbackKindFeedback}</option>
            <option value="bug">{DOEDTC_PROFILE.feedbackKindBug}</option>
          </select>
          <div style={{ marginTop: "0.75rem" }}>
            <label className="doedtc-label" htmlFor="feedback-title">
              {DOEDTC_PROFILE.feedbackTitleLabel}
            </label>
            <input
              id="feedback-title"
              className="doedtc-input"
              value={title}
              disabled={busy}
              required
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div style={{ marginTop: "0.75rem" }}>
            <label className="doedtc-label" htmlFor="feedback-body">
              {DOEDTC_PROFILE.feedbackBodyLabel}
            </label>
            <textarea
              id="feedback-body"
              className="doedtc-input doedtc-textarea"
              value={body}
              disabled={busy}
              required
              rows={4}
              onChange={(event) => setBody(event.target.value)}
            />
          </div>
          <button className="doedtc-button" type="submit" disabled={busy}>
            {busy ? DOEDTC_PROFILE.savingLabel : DOEDTC_PROFILE.feedbackSubmitLabel}
          </button>
        </form>
      ) : null}
    </div>
  );
}
