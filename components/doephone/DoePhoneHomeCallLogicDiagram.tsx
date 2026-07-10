"use client";

import { dmSans } from "@/lib/home/fonts";
import type { ReactNode } from "react";

type NodeKind = "trigger" | "action" | "condition";
type NodeStatus = "done" | "current" | "active" | "upcoming";
type IntegrationIcon = "phone" | "epic" | "surescripts" | "teams";

type Integration = {
  id: string;
  label: string;
  icon: IntegrationIcon;
};

type LogicNode = {
  id: string;
  label: string;
  kind: NodeKind;
  status: NodeStatus;
  typeLabel: string;
  integrations?: Integration[];
};

type LogicBranch = {
  id: string;
  label: string;
  chain: LogicNode[];
};

type LogicFork = {
  id: string;
  condition: LogicNode;
  branches: LogicBranch[];
};

const TRUNK: LogicNode[] = [
  {
    id: "answer",
    label: "Call answered",
    kind: "trigger",
    status: "done",
    typeLabel: "Incoming",
    integrations: [{ id: "voice", label: "Voice", icon: "phone" }],
  },
  {
    id: "verify",
    label: "Verify patient",
    kind: "action",
    status: "done",
    typeLabel: "Step",
    integrations: [{ id: "epic-verify", label: "Epic", icon: "epic" }],
  },
];

const ROOT_FORK: LogicFork = {
  id: "med-list-fork",
  condition: {
    id: "med-list",
    label: "On active med list?",
    kind: "condition",
    status: "current",
    typeLabel: "If / Else",
    integrations: [{ id: "epic-list", label: "Epic", icon: "epic" }],
  },
  branches: [
    {
      id: "yes",
      label: "Yes",
      chain: [
        {
          id: "check-date",
          label: "Check refill date",
          kind: "action",
          status: "active",
          typeLabel: "Step",
          integrations: [{ id: "epic-date", label: "Epic", icon: "epic" }],
        },
        {
          id: "route-rx",
          label: "Send to pharmacy",
          kind: "action",
          status: "upcoming",
          typeLabel: "Step",
          integrations: [{ id: "rx", label: "Surescripts", icon: "surescripts" }],
        },
      ],
    },
    {
      id: "no",
      label: "No",
      chain: [
        {
          id: "transfer",
          label: "Transfer to desk",
          kind: "action",
          status: "upcoming",
          typeLabel: "Step",
          integrations: [{ id: "teams", label: "Teams", icon: "teams" }],
        },
        {
          id: "flag",
          label: "Flag for review",
          kind: "action",
          status: "upcoming",
          typeLabel: "Step",
          integrations: [{ id: "epic-flag", label: "Epic", icon: "epic" }],
        },
      ],
    },
  ],
};

function IntegrationIconGlyph({ icon }: { icon: IntegrationIcon }) {
  const stroke = "currentColor";
  const sw = 1.2;

  const glyphs: Record<IntegrationIcon, ReactNode> = {
    phone: (
      <>
        <path
          d="M4.5 3.5h7v9h-7z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
        <path d="M6.5 3.5V2.5M9.5 3.5V2.5" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap="round" />
      </>
    ),
    epic: (
      <>
        <rect x="3.5" y="3" width="9" height="8" rx="1.1" stroke={stroke} strokeWidth={sw} />
        <path d="M5.5 5.5h5M5.5 7.5h5M5.5 9.5h3" stroke={stroke} strokeWidth={sw * 0.85} strokeLinecap="round" />
      </>
    ),
    surescripts: (
      <>
        <path d="M6 3.5h4l2 2.5v5.5H4V5.5z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M8.5 6.5v3M7 8h3" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap="round" />
      </>
    ),
    teams: (
      <>
        <circle cx="6.5" cy="6.5" r="2" stroke={stroke} strokeWidth={sw} />
        <circle cx="10.5" cy="6.5" r="2" stroke={stroke} strokeWidth={sw} />
        <path d="M4.5 12c0-1.4 1.2-2.5 2.5-2.5M11 9.5c1.3 0 2.5 1.1 2.5 2.5" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap="round" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 16 14" fill="none" aria-hidden className="home-call-logic-diagram__chip-icon">
      {glyphs[icon]}
    </svg>
  );
}

function IntegrationChip({ integration }: { integration: Integration }) {
  return (
    <span className="home-call-logic-diagram__chip">
      <IntegrationIconGlyph icon={integration.icon} />
      <span className="home-call-logic-diagram__chip-label">{integration.label}</span>
    </span>
  );
}

function FlowLink() {
  return (
    <span className="home-call-logic-diagram__link" aria-hidden>
      <span className="home-call-logic-diagram__link-line" />
    </span>
  );
}

function FlowNode({ node }: { node: LogicNode }) {
  return (
    <div
      className={`home-call-logic-diagram__node home-call-logic-diagram__node--${node.kind} home-call-logic-diagram__node--${node.status}`}
    >
      <div className="home-call-logic-diagram__node-surface">
        <span className="home-call-logic-diagram__node-grip" aria-hidden>
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} className="home-call-logic-diagram__node-grip-dot" />
          ))}
        </span>

        <div className="home-call-logic-diagram__node-body">
          <span className="home-call-logic-diagram__node-type">{node.typeLabel}</span>
          <span className="home-call-logic-diagram__node-label">{node.label}</span>
          {node.integrations?.length ? (
            <span className="home-call-logic-diagram__node-integrations">
              {node.integrations.map((integration) => (
                <IntegrationChip key={integration.id} integration={integration} />
              ))}
            </span>
          ) : null}
        </div>

        <span className="home-call-logic-diagram__node-edit" aria-hidden>
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M10.5 3.5l2 2-6.5 6.5H4v-2L10.5 3.5z"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
            <path d="M9 5l2 2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function FlowChain({ nodes }: { nodes: LogicNode[] }) {
  return (
    <div className="home-call-logic-diagram__chain">
      {nodes.map((node, index) => (
        <div key={node.id} className="home-call-logic-diagram__chain-step">
          {index > 0 ? <FlowLink /> : null}
          <FlowNode node={node} />
        </div>
      ))}
    </div>
  );
}

function FlowForkRail({ columns }: { columns: number }) {
  return (
    <div className={`home-call-logic-diagram__fork-rail home-call-logic-diagram__fork-rail--${columns}`} aria-hidden>
      <span className="home-call-logic-diagram__fork-rail-stem" />
      <div className="home-call-logic-diagram__fork-rail-split">
        <span className="home-call-logic-diagram__fork-rail-bar" />
        {Array.from({ length: columns }, (_, index) => (
          <span key={index} className="home-call-logic-diagram__fork-rail-drop" />
        ))}
      </div>
    </div>
  );
}

function FlowBranch({ branch }: { branch: LogicBranch }) {
  return (
    <div className={`home-call-logic-diagram__branch home-call-logic-diagram__branch--${branch.id}`}>
      <span className="home-call-logic-diagram__branch-key">{branch.label}</span>
      <FlowLink />
      <FlowChain nodes={branch.chain} />
    </div>
  );
}

function FlowFork({ fork }: { fork: LogicFork }) {
  return (
    <div className="home-call-logic-diagram__fork">
      <FlowLink />
      <FlowNode node={fork.condition} />
      <FlowForkRail columns={fork.branches.length} />
      <div className={`home-call-logic-diagram__branches home-call-logic-diagram__branches--${fork.branches.length}`}>
        {fork.branches.map((branch) => (
          <FlowBranch key={branch.id} branch={branch} />
        ))}
      </div>
    </div>
  );
}

/** Refill logic canvas — editable steps with integration chips on the Customize agents band. */
export function DoePhoneHomeCallLogicDiagram() {
  return (
    <div className={`home-call-logic-diagram ${dmSans.className}`} aria-hidden>
      <div className="home-call-logic-diagram__canvas">
        <div className="home-call-logic-diagram__trunk">
          {TRUNK.map((node, index) => (
            <div key={node.id} className="home-call-logic-diagram__trunk-step">
              {index > 0 ? <FlowLink /> : null}
              <FlowNode node={node} />
            </div>
          ))}
        </div>

        <FlowFork fork={ROOT_FORK} />
      </div>
    </div>
  );
}
