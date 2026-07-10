"use client";

import { dmSans } from "@/lib/home/fonts";

type CallEntry = {
  callerName: string;
  callerNameBold: string;
  callerNameSuffix?: string;
  phone: string;
  time: string;
  duration: string;
  direction: "inbound" | "outbound";
  agent: string;
  expanded?: boolean;
  highlight?: string;
  outcomes?: readonly string[];
};

const FILTERS = [
  { id: "all-routed", label: "All", count: 18 },
  { id: "agent-queues", label: "Agents", count: 11 },
  { id: "staff-handoff", label: "Staff", count: 7 },
] as const;

const ACTIVE_FILTER_ID = "all-routed";

const CALL_HISTORY: readonly CallEntry[] = [
  {
    callerName: "Maria Lopez",
    callerNameBold: "Maria Lopez",
    phone: "(415) 555-0176",
    time: "2:41 PM",
    duration: "3m 08s",
    direction: "inbound",
    agent: "Inbox",
    highlight: "Note drafted",
  },
  {
    callerName: "Dr. Patel's office",
    callerNameBold: "Dr. Patel",
    callerNameSuffix: "'s office",
    phone: "(628) 555-0134",
    time: "1:18 PM",
    duration: "6m 44s",
    direction: "inbound",
    agent: "Referrals",
    expanded: true,
    highlight: "Tue 2:30 PM held",
    outcomes: ["Referral queued", "Callback 4 PM"],
  },
  {
    callerName: "James Chen",
    callerNameBold: "James Chen",
    phone: "(510) 555-0192",
    time: "11:52 AM",
    duration: "2m 15s",
    direction: "outbound",
    agent: "Scheduling",
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

function CallLogRow({ call, isLast }: { call: CallEntry; isLast: boolean }) {
  const isExpanded = Boolean(call.expanded);

  return (
    <article
      className={`home-call-history-visual__row${
        isExpanded ? " home-call-history-visual__row--expanded" : ""
      }${isLast ? " home-call-history-visual__row--last" : ""}`}
    >
      <div className="home-call-history-visual__row-top">
        <span className="home-call-history-visual__direction">
          <CallDirectionIcon direction={call.direction} />
        </span>

        <div className="home-call-history-visual__identity">
          <div className="home-call-history-visual__identity-line">
            <p className="home-call-history-visual__name">
              <span className="home-call-history-visual__name-bold">{call.callerNameBold}</span>
              {call.callerNameSuffix ?? null}
            </p>
            <span className="home-call-history-visual__time">{call.time}</span>
          </div>
          <div className="home-call-history-visual__identity-line home-call-history-visual__identity-line--sub">
            <p className="home-call-history-visual__phone">
              {call.phone}
            </p>
            <span className="home-call-history-visual__duration">{call.duration}</span>
          </div>
        </div>
      </div>

      {call.highlight ? (
        <p className="home-call-history-visual__route">
          <span className="home-call-history-visual__route-outcome">{call.highlight}</span>
        </p>
      ) : null}

      {isExpanded && call.outcomes && call.outcomes.length > 0 ? (
        <ul className="home-call-history-visual__details">
          {call.outcomes.map((outcome) => (
            <li key={outcome} className="home-call-history-visual__detail">
              {outcome}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

/** Call history — compact routed log on the feature shader. */
export function DoePhoneCallHistoryVisual({ layout = "phone" }: { layout?: VisualLayout }) {
  const isDesktop = layout === "desktop";
  const maxWidth = isDesktop ? "min(100%, 21.5rem)" : "min(90%, 21.5rem)";

  return (
    <div
      className={`home-call-history-visual mx-auto flex h-full w-full flex-col justify-center ${dmSans.className}`}
      style={{ maxWidth }}
      aria-hidden
    >
      <header className="home-call-history-visual__header">
        <div className="home-call-history-visual__header-copy">
          <p className="home-call-history-visual__summary">18 routed today</p>
        </div>

        <div className="home-call-history-visual__filters" role="tablist" aria-hidden>
          {FILTERS.map((filter) => {
            const isActive = filter.id === ACTIVE_FILTER_ID;

            return (
              <span
                key={filter.id}
                className={`home-call-history-visual__filter${
                  isActive ? " home-call-history-visual__filter--active" : ""
                }`}
              >
                {filter.label}
                <span className="home-call-history-visual__filter-count">{filter.count}</span>
              </span>
            );
          })}
        </div>
      </header>

      <div className="home-call-history-visual__card">
        {CALL_HISTORY.map((call, index) => (
          <CallLogRow
            key={`${call.callerName}-${call.time}`}
            call={call}
            isLast={index === CALL_HISTORY.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
