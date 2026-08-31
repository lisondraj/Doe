"use client";

import { useState } from "react";

import { PRODUCTNEW_CALL_HISTORY, PRODUCTNEW_VOICE, type ProductNewCallLog } from "@/lib/productnew/productnew-copy";

const OUTCOME_LABEL: Record<ProductNewCallLog["outcome"], string> = {
  resolved: "Resolved",
  escalated: "Escalated",
  voicemail: "No answer",
};

function CallListItem({
  call,
  active,
  onSelect,
}: {
  call: ProductNewCallLog;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        className={`productnew-history__item${active ? " productnew-history__item--active" : ""}`}
        onClick={onSelect}
        aria-current={active ? "true" : undefined}
      >
        <div className="productnew-history__item-top">
          <span className="productnew-history__item-caller">{call.caller}</span>
          <span className="productnew-history__item-time">{call.time}</span>
        </div>
        <p className="productnew-history__item-summary">{call.summary}</p>
        <div className="productnew-history__item-meta">
          <span>{call.category}</span>
          <span>{call.duration}</span>
          <span>{OUTCOME_LABEL[call.outcome]}</span>
        </div>
      </button>
    </li>
  );
}

function CallDetail({ call }: { call: ProductNewCallLog }) {
  return (
    <div className="productnew-history__detail">
      <div className="productnew-history__detail-head">
        <div>
          <p className="productnew-history__caller">{call.caller}</p>
          <p className="productnew-history__phone">{call.phone}</p>
        </div>
        <div className="productnew-history__stats">
          <span>
            <strong>{call.time}</strong> started
          </span>
          <span>
            <strong>{call.duration}</strong> duration
          </span>
          <span>
            <strong>{OUTCOME_LABEL[call.outcome]}</strong>
          </span>
        </div>
      </div>

      <p className="productnew-history__summary">{call.summary}</p>

      <ol className="productnew-history__log">
        {call.actions.map((action, i) => (
          <li key={`${call.id}-${i}`} className="productnew-history__log-item">
            <span className="productnew-history__log-rail" aria-hidden>
              <span className="productnew-history__log-dot" />
              {i < call.actions.length - 1 ? <span className="productnew-history__log-line" /> : null}
            </span>
            <div className="productnew-history__log-body">
              <span className="productnew-history__log-time">{action.time}</span>
              <p className="productnew-history__log-label">{action.label}</p>
              {action.detail ? <p className="productnew-history__log-detail">{action.detail}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Call history tab: clickable call list with a per-call agent action log. */
export function ProductNewCallHistoryView() {
  const [selectedId, setSelectedId] = useState(PRODUCTNEW_CALL_HISTORY[0]?.id ?? "");
  const selected = PRODUCTNEW_CALL_HISTORY.find((call) => call.id === selectedId) ?? PRODUCTNEW_CALL_HISTORY[0];

  return (
    <>
      <div className="productnew-history-head">
        <h2 className="productnew-history-head__title">Call history</h2>
        <p className="productnew-history-head__meta">{PRODUCTNEW_VOICE.total} calls since {PRODUCTNEW_VOICE.since}</p>
      </div>

      <div className="productnew-history">
        <ul className="productnew-history__list">
          {PRODUCTNEW_CALL_HISTORY.map((call) => (
            <CallListItem
              key={call.id}
              call={call}
              active={call.id === selected?.id}
              onSelect={() => setSelectedId(call.id)}
            />
          ))}
        </ul>

        {selected ? <CallDetail call={selected} /> : null}
      </div>
    </>
  );
}
