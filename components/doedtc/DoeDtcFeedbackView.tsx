"use client";

import { useEffect, useMemo, useState } from "react";

import { DOEDTC_PROFILE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcTicketKind, DoeDtcTicketRow, DoeDtcTicketStatus } from "@/lib/doedtc/doedtc-types";
import { plusJakartaSans } from "@/lib/home/fonts";

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

function calendarChip(value: string): { month: string; day: string } {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { month: "—", day: "—" };
  return {
    month: new Intl.DateTimeFormat(undefined, { month: "short" }).format(date),
    day: String(date.getDate()),
  };
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
  const [slice, setSlice] = useState<DoeDtcTicketKind>("feedback");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(focusedTicketId);
  const [adding, setAdding] = useState(false);

  const slices: Array<{ id: DoeDtcTicketKind; label: string }> = [
    { id: "feedback", label: DOEDTC_PROFILE.feedbackSliceFeedback },
    { id: "bug", label: DOEDTC_PROFILE.feedbackSliceBugs },
  ];

  const sortedTickets = useMemo(
    () => [...tickets].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [tickets],
  );

  useEffect(() => {
    if (!focusedTicketId) return;
    const focused = sortedTickets.find((ticket) => ticket.id === focusedTicketId);
    if (!focused) return;
    setSlice(focused.kind);
    setSelectedId(focused.id);
  }, [focusedTicketId, sortedTickets]);

  const sliceTickets = sortedTickets.filter((ticket) => ticket.kind === slice);
  const activeTickets = sliceTickets.filter((ticket) => ticket.status !== "resolved");
  const resolvedTickets = sliceTickets.filter((ticket) => ticket.status === "resolved");
  const featured =
    sliceTickets.find((ticket) => ticket.id === selectedId) ?? activeTickets[0] ?? sliceTickets[0] ?? null;
  const otherActive = activeTickets.filter((ticket) => ticket.id !== featured?.id);
  const otherResolved = resolvedTickets.filter((ticket) => ticket.id !== featured?.id);
  const sliceIndex = slices.findIndex((row) => row.id === slice);
  const emptyLabel =
    slice === "bug" ? DOEDTC_PROFILE.feedbackEmptyBugs : DOEDTC_PROFILE.feedbackEmptyFeedback;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!onSubmit) return;
    const nextTitle = title.trim();
    const nextBody = body.trim();
    if (!nextTitle || !nextBody) return;
    await onSubmit({ kind: slice, title: nextTitle, body: nextBody });
    setTitle("");
    setBody("");
    setAdding(false);
  }

  function renderTicketCard(ticket: DoeDtcTicketRow, past: boolean) {
    const chip = calendarChip(ticket.created_at);
    return (
      <li key={ticket.id}>
        <button
          type="button"
          className={`doedtc-visit-card doedtc-feedback__card${past ? " doedtc-visit-card--past" : ""}`}
          aria-current={featured?.id === ticket.id ? "true" : undefined}
          onClick={() => setSelectedId(ticket.id)}
        >
          <div className="doedtc-visit-card__date" aria-hidden="true">
            <span className="doedtc-visit-card__month">{chip.month}</span>
            <span className="doedtc-visit-card__day">{chip.day}</span>
          </div>
          <div className="doedtc-visit-card__body">
            <div className="doedtc-visit-card__top">
              <strong>{ticket.title}</strong>
              <span className={`doedtc-tag doedtc-tag--${ticket.status}`}>{statusLabel(ticket.status)}</span>
            </div>
            <p className="doedtc-row-item__meta">{formatWhen(ticket.created_at)}</p>
          </div>
        </button>
      </li>
    );
  }

  return (
    <div className="doedtc-feedback">
      <div className="doedtc-results-slider doedtc-results-slider--2" role="tablist" aria-label={DOEDTC_PROFILE.feedbackTitle}>
        <span
          className="doedtc-results-slider__thumb"
          style={{
            width: "calc((100% - 0.44rem) / 2)",
            left: `calc(0.22rem + ${Math.max(sliceIndex, 0)} * ((100% - 0.44rem) / 2))`,
          }}
          aria-hidden="true"
        />
        {slices.map((row) => (
          <button
            key={row.id}
            className={`doedtc-results-slider__btn${slice === row.id ? " doedtc-results-slider__btn--active" : ""}`}
            type="button"
            role="tab"
            aria-selected={slice === row.id}
            onClick={() => {
              setSlice(row.id);
              setSelectedId(null);
            }}
          >
            {row.label}
          </button>
        ))}
      </div>

      {sliceTickets.length === 0 ? (
        <p className="doedtc-empty">{emptyLabel}</p>
      ) : (
        <>
          {featured ? (
            <article className="doedtc-feedback-hero">
              <div className="doedtc-feedback-hero__top">
                <div className="doedtc-feedback__meta">
                  <span className="doedtc-tag">{kindLabel(featured.kind)}</span>
                  <span className={`doedtc-tag doedtc-tag--${featured.status}`}>{statusLabel(featured.status)}</span>
                </div>
              </div>
              <h3 className={`doedtc-feedback-hero__title ${plusJakartaSans.className}`}>{featured.title}</h3>
              <p className="doedtc-feedback-hero__meta">{formatWhen(featured.created_at)}</p>
              <p className="doedtc-feedback-hero__body">{featured.body}</p>
            </article>
          ) : null}

          {otherActive.length > 0 ? (
            <ul className="doedtc-visit-list">{otherActive.map((ticket) => renderTicketCard(ticket, false))}</ul>
          ) : null}

          {otherResolved.length > 0 ? (
            <section>
              <h2 className="doedtc-section-title">{DOEDTC_PROFILE.feedbackResolvedTitle}</h2>
              <ul className="doedtc-visit-list">{otherResolved.map((ticket) => renderTicketCard(ticket, true))}</ul>
            </section>
          ) : null}
        </>
      )}

      {showForm && onSubmit ? (
        adding ? (
          <form className="doedtc-card doedtc-form doedtc-feedback__form" onSubmit={(event) => void handleSubmit(event)}>
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
            <div>
              <label className="doedtc-label" htmlFor="feedback-body">
                {DOEDTC_PROFILE.feedbackBodyLabel}
              </label>
              <textarea
                id="feedback-body"
                className="doedtc-textarea"
                value={body}
                disabled={busy}
                required
                rows={4}
                onChange={(event) => setBody(event.target.value)}
              />
            </div>
            <div className="doedtc-appointments__form-actions">
              <button className="doedtc-button" type="submit" disabled={busy}>
                {busy ? DOEDTC_PROFILE.savingLabel : DOEDTC_PROFILE.feedbackSubmitLabel}
              </button>
              <button
                className="doedtc-button doedtc-button--secondary"
                type="button"
                disabled={busy}
                onClick={() => {
                  setTitle("");
                  setBody("");
                  setAdding(false);
                }}
              >
                {DOEDTC_PROFILE.feedbackAddCancel}
              </button>
            </div>
          </form>
        ) : (
          <button
            className="doedtc-button doedtc-button--secondary doedtc-feedback__add"
            type="button"
            disabled={busy}
            onClick={() => setAdding(true)}
          >
            {DOEDTC_PROFILE.feedbackAddOpen}
          </button>
        )
      ) : null}
    </div>
  );
}
