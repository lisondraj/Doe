"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { maxWidthPhone } = CAROUSEL_MENU_UI;

type CallEntry = {
  callerName: string;
  phone: string;
  time: string;
  duration: string;
  direction: "inbound" | "outbound";
  agent: string;
  queueTag: string;
  expanded?: boolean;
  highlight?: string;
  outcomes?: readonly { label: string; glyph: string }[];
};

const FILTERS = [
  { id: "all-routed", label: "All routed", count: 18 },
  { id: "agent-queues", label: "Routed to agents", count: 11 },
  { id: "staff-handoff", label: "Routed to staff", count: 7 },
] as const;

const ACTIVE_FILTER_ID = "all-routed";

const CALL_HISTORY: readonly CallEntry[] = [
  {
    callerName: "Maria Lopez",
    phone: "(415) 555-0176",
    time: "2:41 PM",
    duration: "3m 08s",
    direction: "inbound",
    agent: "Inbox",
    queueTag: "Results",
    highlight: "Note drafted",
  },
  {
    callerName: "Dr. Patel's office",
    phone: "(628) 555-0134",
    time: "1:18 PM",
    duration: "6m 44s",
    direction: "inbound",
    agent: "Referrals",
    queueTag: "Cardiology",
    expanded: true,
    highlight: "Tue 2:30 PM held",
    outcomes: [
      { glyph: "↗", label: "Referral queued" },
      { glyph: "☎", label: "Callback 4 PM" },
    ],
  },
  {
    callerName: "James Chen",
    phone: "(510) 555-0192",
    time: "11:52 AM",
    duration: "2m 15s",
    direction: "outbound",
    agent: "Scheduling",
    queueTag: "Confirm",
    highlight: "SMS queued",
  },
] as const;

type VisualLayout = "phone" | "desktop";

function CallDirectionIcon({ direction }: { direction: CallEntry["direction"] }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-call-history-visual__direction-icon">
      {direction === "inbound" ? (
        <path
          d="M8 3.5v9M4.5 8.5 8 12l3.5-3.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M8 12.5v-9M11.5 7.5 8 4 4.5 7.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function RoutePipeline({ call }: { call: CallEntry }) {
  return (
    <div className="home-call-history-visual__route">
      <div className="home-call-history-visual__pipeline" aria-hidden>
        <span className="home-call-history-visual__pipeline-origin" />
        <span className="home-call-history-visual__pipeline-segment" />
        <span className="home-call-history-visual__pipeline-agent">
          <span className="home-call-history-visual__pipeline-orb">{call.agent.charAt(0)}</span>
          <span className={`home-call-history-visual__pipeline-agent-label ${suisseIntl.className}`}>
            {call.agent}
          </span>
        </span>
        <span className="home-call-history-visual__pipeline-segment home-call-history-visual__pipeline-segment--live" />
        <span className="home-call-history-visual__pipeline-status">
          <span className="home-call-history-visual__pipeline-status-ring" />
        </span>
      </div>

      <div className={`home-call-history-visual__route-meta ${inter.className}`}>
        <span className="home-call-history-visual__queue-tag">{call.queueTag}</span>
        {call.highlight ? (
          <span className="home-call-history-visual__route-highlight">{call.highlight}</span>
        ) : null}
      </div>
    </div>
  );
}

function OutcomeTiles({ outcomes }: { outcomes: readonly { label: string; glyph: string }[] }) {
  return (
    <div className="home-call-history-visual__outcome-tiles">
      {outcomes.map((outcome) => (
        <div key={outcome.label} className={`home-call-history-visual__outcome-tile ${inter.className}`}>
          <span className="home-call-history-visual__outcome-glyph" aria-hidden>
            {outcome.glyph}
          </span>
          <span className="home-call-history-visual__outcome-label">{outcome.label}</span>
        </div>
      ))}
    </div>
  );
}

function CallLogRow({ call }: { call: CallEntry }) {
  const isExpanded = Boolean(call.expanded);

  return (
    <article
      className={`home-call-history-visual__row${
        isExpanded ? " home-call-history-visual__row--expanded" : ""
      }`}
    >
      <div className="home-call-history-visual__row-main">
        <span className="home-call-history-visual__avatar">
          <CallDirectionIcon direction={call.direction} />
        </span>

        <div className="home-call-history-visual__row-copy">
          <div className="home-call-history-visual__identity">
            <div className="home-call-history-visual__identity-copy">
              <p className={`home-call-history-visual__name ${suisseIntl.className}`}>{call.callerName}</p>
              <p className={`home-call-history-visual__phone ${inter.className}`}>{call.phone}</p>
            </div>
            <div className={`home-call-history-visual__time-block ${inter.className}`}>
              <span className="home-call-history-visual__time">{call.time}</span>
              <span className="home-call-history-visual__duration">{call.duration}</span>
            </div>
          </div>

          <RoutePipeline call={call} />

          {isExpanded && call.outcomes && call.outcomes.length > 0 ? (
            <OutcomeTiles outcomes={call.outcomes} />
          ) : null}
        </div>
      </div>
    </article>
  );
}

/** Call history — routed tabs and log rows placed directly on the feature shader. */
export function DoePhoneCallHistoryVisual({ layout = "phone" }: { layout?: VisualLayout }) {
  const isDesktop = layout === "desktop";
  const maxWidth = isDesktop ? "min(100%, 28rem)" : maxWidthPhone;

  return (
    <div
      className={`home-call-history-visual mx-auto flex h-full w-full flex-col justify-center ${suisseIntl.className}`}
      style={{ maxWidth }}
      aria-hidden
    >
      <div className="home-call-history-visual__filters" role="tablist" aria-hidden>
        {FILTERS.map((filter) => {
          const isActive = filter.id === ACTIVE_FILTER_ID;

          return (
            <span
              key={filter.id}
              className={`home-call-history-visual__filter home-call-history-visual__filter--${filter.id}${
                isActive ? " home-call-history-visual__filter--active" : ""
              } ${inter.className}`}
            >
              {filter.label}
              <span className="home-call-history-visual__filter-count">{filter.count}</span>
            </span>
          );
        })}
      </div>

      <div className="home-call-history-visual__list">
        {CALL_HISTORY.map((call) => (
          <CallLogRow key={`${call.callerName}-${call.time}`} call={call} />
        ))}
      </div>
    </div>
  );
}
