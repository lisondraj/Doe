"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const CALL_TYPE = "Refill request";

const FLOW_NODES = [
  {
    id: "trigger",
    kind: "trigger" as const,
    label: "Incoming call answered",
    meta: CALL_TYPE,
  },
  {
    id: "verify",
    kind: "action" as const,
    label: "Verify patient in chart",
    meta: "Match DOB + phone",
  },
  {
    id: "condition",
    kind: "condition" as const,
    label: "Medication on active list?",
    branches: [
      { label: "Yes", target: "continue" },
      { label: "No", target: "Transfer to front desk" },
    ],
  },
  {
    id: "eligibility",
    kind: "action" as const,
    label: "Check last refill date",
    meta: "Editing rule",
    active: true,
  },
  {
    id: "route",
    kind: "action" as const,
    label: "Route to pharmacy queue",
    meta: "Notify Dr. Chen",
  },
] as const;

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className="home-call-logic-diagram__chevron h-[0.72em] w-[0.72em] shrink-0">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NodeKindIcon({ kind }: { kind: (typeof FLOW_NODES)[number]["kind"] }) {
  if (kind === "trigger") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-call-logic-diagram__node-icon h-[0.95em] w-[0.95em] shrink-0">
        <path d="M4 6.5a4 4 0 018 0v2.2l1.4 1.1H2.6L4 8.7V6.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M6.5 12.2h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "condition") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-call-logic-diagram__node-icon h-[0.95em] w-[0.95em] shrink-0">
        <path d="M3.5 8h3.2M9.3 8H12.5M8 3.5v3.2M8 9.3v3.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <rect x="2.5" y="2.5" width="11" height="11" rx="2.2" stroke="currentColor" strokeWidth="1.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-call-logic-diagram__node-icon h-[0.95em] w-[0.95em] shrink-0">
      <rect x="3" y="3" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.1" />
      <path d="M6 8.2l1.4 1.4 2.8-2.9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Mock call-logic editor — workflow diagram for a specific answered call type. */
export function DoePhoneHomeCallLogicDiagram() {
  return (
    <div
      className={`home-call-logic-diagram mx-auto w-full ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div className="home-call-logic-diagram__card">
        <div className="home-call-logic-diagram__header">
          <div className="home-call-logic-diagram__header-copy">
            <p className="home-call-logic-diagram__eyebrow">Call logic editor</p>
            <p className="home-call-logic-diagram__title">When this call is answered</p>
          </div>
          <span className={`home-call-logic-diagram__type-chip ${inter.className}`}>
            {CALL_TYPE}
            <ChevronDownIcon />
          </span>
        </div>

        <div className="home-call-logic-diagram__flow">
          {FLOW_NODES.map((node, index) => (
            <div key={node.id} className="home-call-logic-diagram__step">
              {index > 0 ? <div className="home-call-logic-diagram__connector" aria-hidden /> : null}

              <div
                className={`home-call-logic-diagram__node home-call-logic-diagram__node--${node.kind}${
                  "active" in node && node.active ? " home-call-logic-diagram__node--active" : ""
                }`}
              >
                <div className="home-call-logic-diagram__node-head">
                  <span className="home-call-logic-diagram__node-kind">
                    <NodeKindIcon kind={node.kind} />
                    <span className={`${inter.className} home-call-logic-diagram__node-kind-label`}>
                      {node.kind === "trigger" ? "Trigger" : node.kind === "condition" ? "If" : "Then"}
                    </span>
                  </span>
                  {"active" in node && node.active ? (
                    <span className={`home-call-logic-diagram__edit-badge ${inter.className}`}>Editing</span>
                  ) : null}
                </div>

                <p className="home-call-logic-diagram__node-label">{node.label}</p>

                {"meta" in node && node.meta ? (
                  <p className={`home-call-logic-diagram__node-meta ${inter.className}`}>{node.meta}</p>
                ) : null}

                {"branches" in node && node.branches ? (
                  <div className="home-call-logic-diagram__branches">
                    {node.branches.map((branch) => (
                      <span key={branch.label} className={`home-call-logic-diagram__branch ${inter.className}`}>
                        <span className="home-call-logic-diagram__branch-key">{branch.label}</span>
                        <span className="home-call-logic-diagram__branch-value">
                          {branch.target === "continue" ? "Continue flow" : branch.target}
                        </span>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <button type="button" className={`home-call-logic-diagram__add-step ${inter.className}`} tabIndex={-1}>
          <span aria-hidden>+</span>
          Add step
        </button>
      </div>
    </div>
  );
}
