"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const CALL_TYPE = "Refill request";

const TRUNK_NODES = [
  {
    id: "trigger",
    kind: "trigger" as const,
    label: "Incoming call answered",
    meta: "Front desk line",
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
  },
] as const;

const BRANCH_COLUMNS = [
  {
    id: "yes",
    key: "Yes",
    nodes: [
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
    ],
  },
  {
    id: "no",
    key: "No",
    nodes: [
      {
        id: "transfer",
        kind: "action" as const,
        label: "Transfer to front desk",
        meta: "Warm handoff",
      },
      {
        id: "escalate",
        kind: "action" as const,
        label: "Flag for chart review",
        meta: "Same-day callback",
      },
    ],
  },
] as const;

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className="home-call-logic-diagram__chevron h-[0.72em] w-[0.72em] shrink-0">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NodeKindIcon({ kind }: { kind: "trigger" | "action" | "condition" }) {
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

type FlowNode = {
  id: string;
  kind: "trigger" | "action" | "condition";
  label: string;
  meta?: string;
  active?: boolean;
};

function FlowNodeCard({ node }: { node: FlowNode }) {
  return (
    <div
      className={`home-call-logic-diagram__node home-call-logic-diagram__node--${node.kind}${
        node.active ? " home-call-logic-diagram__node--active" : ""
      }`}
    >
      <div className="home-call-logic-diagram__node-head">
        <span className="home-call-logic-diagram__node-kind">
          <NodeKindIcon kind={node.kind} />
          <span className={`${inter.className} home-call-logic-diagram__node-kind-label`}>
            {node.kind === "trigger" ? "Trigger" : node.kind === "condition" ? "If" : "Then"}
          </span>
        </span>
        {node.active ? <span className={`home-call-logic-diagram__edit-badge ${inter.className}`}>Editing</span> : null}
      </div>

      <p className="home-call-logic-diagram__node-label">{node.label}</p>

      {node.meta ? <p className={`home-call-logic-diagram__node-meta ${inter.className}`}>{node.meta}</p> : null}
    </div>
  );
}

/** Mock call-logic editor — branching workflow placed directly on the shader band. */
export function DoePhoneHomeCallLogicDiagram() {
  return (
    <div className={`home-call-logic-diagram ${suisseIntl.className}`} aria-hidden>
      <div className="home-call-logic-diagram__toolbar">
        <div className="home-call-logic-diagram__toolbar-copy">
          <p className="home-call-logic-diagram__eyebrow">Call logic editor</p>
          <p className="home-call-logic-diagram__title">When this call is answered</p>
        </div>
        <span className={`home-call-logic-diagram__type-chip ${inter.className}`}>
          {CALL_TYPE}
          <ChevronDownIcon />
        </span>
      </div>

      <div className="home-call-logic-diagram__canvas">
        <div className="home-call-logic-diagram__trunk">
          {TRUNK_NODES.map((node, index) => (
            <div key={node.id} className="home-call-logic-diagram__trunk-step">
              {index > 0 ? <div className="home-call-logic-diagram__connector home-call-logic-diagram__connector--vertical" aria-hidden /> : null}
              <FlowNodeCard node={node} />
            </div>
          ))}

          <div className="home-call-logic-diagram__connector home-call-logic-diagram__connector--vertical" aria-hidden />
          <div className="home-call-logic-diagram__fork-rail" aria-hidden>
            <span className="home-call-logic-diagram__fork-rail-line home-call-logic-diagram__fork-rail-line--left" />
            <span className="home-call-logic-diagram__fork-rail-line home-call-logic-diagram__fork-rail-line--right" />
          </div>
        </div>

        <div className="home-call-logic-diagram__branches">
          {BRANCH_COLUMNS.map((column) => (
            <div key={column.id} className={`home-call-logic-diagram__branch-col home-call-logic-diagram__branch-col--${column.id}`}>
              <span className={`home-call-logic-diagram__branch-key ${inter.className}`}>{column.key}</span>

              {column.nodes.map((node, index) => (
                <div key={node.id} className="home-call-logic-diagram__branch-step">
                  {index === 0 ? (
                    <div className="home-call-logic-diagram__connector home-call-logic-diagram__connector--branch" aria-hidden />
                  ) : (
                    <div className="home-call-logic-diagram__connector home-call-logic-diagram__connector--vertical" aria-hidden />
                  )}
                  <FlowNodeCard node={node} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button type="button" className={`home-call-logic-diagram__add-step ${inter.className}`} tabIndex={-1}>
        <span aria-hidden>+</span>
        Add step
      </button>
    </div>
  );
}
