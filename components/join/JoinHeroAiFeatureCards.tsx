import { suisseIntl } from "@/lib/home/fonts";
import {
  JOIN_HERO_AI_CARD_INVERSE_SCALE,
  JOIN_HERO_AI_FEATURE_CARDS,
  JOIN_HERO_TRIAGE_PANEL,
  JOIN_HERO_TRIAGE_SCALE,
  type JoinHeroAiFeatureCardId,
} from "@/lib/home/hero-triage-theme";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

const SHELL = "overflow-hidden rounded-[1rem] border border-[#EBE7E0] bg-white";
const DIVIDER = "#EEEAE3";
const NAV_W = "3.25rem";

type MiniRow = {
  id: string;
  sender: string;
  initials: string;
  subject: string;
  preview: string;
  time: string;
  selected?: boolean;
};

function MiniIcon({ d, color = "rgba(30, 52, 58, 0.34)" }: { d: string; color?: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden style={{ color, display: "block" }}>
      <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MiniSenderMark({ initials, selected }: { initials: string; selected?: boolean }) {
  return (
    <div
      className="flex h-[1.45rem] w-[1.45rem] shrink-0 items-center justify-center rounded-full text-[0.52rem] font-medium"
      style={{
        background: selected ? "rgba(255,255,255,0.14)" : "rgba(210,119,76,0.14)",
        color: selected ? "#FFFFFF" : JOIN_FORM_BEIGE.ink,
        border: `1px solid ${selected ? "rgba(255,255,255,0.12)" : "#ECE8E1"}`,
      }}
    >
      {initials}
    </div>
  );
}

function MiniListRow({ row }: { row: MiniRow }) {
  const pad = "0.42rem 0.52rem";
  const gap = "0.38rem";

  if (row.selected) {
    return (
      <div
        style={{
          margin: "0 0.32rem",
          padding: pad,
          borderRadius: "0.55rem",
          background: "#D2774C",
          border: "1px solid #D2774C",
          display: "flex",
          alignItems: "flex-start",
          gap,
        }}
      >
        <MiniSenderMark initials={row.initials} selected />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-[0.4em]">
            <span style={{ fontSize: "0.62rem", fontWeight: 500, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
              {row.sender}
            </span>
            <span style={{ fontSize: "0.48rem", fontWeight: 400, color: "rgba(255,255,255,0.72)", flexShrink: 0 }}>
              {row.time}
            </span>
          </div>
          <p className="truncate" style={{ fontSize: "0.56rem", fontWeight: 500, color: "#FFFFFF", marginTop: "0.15em" }}>
            {row.subject}
          </p>
          <p className="mt-[0.12em] truncate" style={{ fontSize: "0.56rem", fontWeight: 400, color: "rgba(255,255,255,0.84)" }}>
            {row.preview}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-start"
      style={{
        gap,
        margin: "0 0.32rem",
        padding: pad,
        borderRadius: "0.45rem",
        background: JOIN_FORM_BEIGE.page,
      }}
    >
      <MiniSenderMark initials={row.initials} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-[0.4em]">
          <span style={{ fontSize: "0.62rem", fontWeight: 500, color: JOIN_FORM_BEIGE.ink, letterSpacing: "-0.01em" }}>
            {row.sender}
          </span>
          <span style={{ fontSize: "0.48rem", fontWeight: 400, color: "rgba(154, 143, 130, 0.88)", flexShrink: 0 }}>
            {row.time}
          </span>
        </div>
        <p className="truncate" style={{ fontSize: "0.56rem", fontWeight: 500, color: "rgba(30, 52, 58, 0.76)", marginTop: "0.15em" }}>
          {row.subject}
        </p>
        <p className="mt-[0.1em] truncate" style={{ fontSize: "0.56rem", fontWeight: 400, color: "rgba(30, 52, 58, 0.56)" }}>
          {row.preview}
        </p>
      </div>
    </div>
  );
}

function MiniInboxShell({
  width,
  height,
  navIcon,
  toolbarLabel,
  toolbarIcon,
  badge,
  rows,
  footer,
}: {
  width: string;
  height: string;
  navIcon: string;
  toolbarLabel: string;
  toolbarIcon: string;
  badge?: string;
  rows: readonly MiniRow[];
  footer?: string;
}) {
  return (
    <div className={`${SHELL} flex ${width} ${height} ${suisseIntl.className}`}>
      <nav
        className="flex shrink-0 flex-col items-center"
        style={{
          width: NAV_W,
          borderRight: `1px solid ${DIVIDER}`,
          padding: "0.85rem 0.4rem",
          background: "#FFFFFF",
        }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-[0.55rem]"
          style={{ background: JOIN_FORM_BEIGE.page }}
        >
          <MiniIcon d={navIcon} color={JOIN_FORM_BEIGE.ink} />
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col" style={{ background: "#FFFFFF" }}>
        <div
          className="flex items-center gap-[0.45em]"
          style={{
            padding: "0.85rem 1rem",
            borderBottom: `1px solid ${DIVIDER}`,
          }}
        >
          <div className="flex items-center gap-[0.35em]">
            <MiniIcon d={toolbarIcon} color="#D2774C" />
            <span style={{ fontSize: "0.92rem", fontWeight: 500, color: JOIN_FORM_BEIGE.ink }}>{toolbarLabel}</span>
            {badge ? (
              <span
                className="rounded-full px-[0.45em] text-center"
                style={{
                  fontSize: "0.48rem",
                  fontWeight: 500,
                  color: "rgba(30, 52, 58, 0.52)",
                  background: JOIN_FORM_BEIGE.page,
                  minWidth: "1.4em",
                }}
              >
                {badge}
              </span>
            ) : null}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden" style={{ padding: "0.55rem 0.45rem" }}>
          <div className="flex flex-col gap-[0.18rem]">
            {rows.map((row) => (
              <MiniListRow key={row.id} row={row} />
            ))}
          </div>
        </div>

        {footer ? (
          <div
            className="truncate px-4 py-2.5"
            style={{
              borderTop: `1px solid ${DIVIDER}`,
              fontSize: "0.52rem",
              fontWeight: 400,
              color: "rgba(154, 143, 130, 0.92)",
              background: "#FAFAF8",
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const BRAIN_ROWS: readonly MiniRow[] = [
  {
    id: "chart",
    sender: "Chart",
    initials: "CH",
    subject: "Patient context loaded",
    preview: "Dizziness after metformin · A1c 8.2%",
    time: "Now",
  },
  {
    id: "risk",
    sender: "Reasoning",
    initials: "Rx",
    subject: "Orthostatic risk flagged",
    preview: "Cross-check new Rx against symptoms",
    time: "Live",
    selected: true,
  },
  {
    id: "plan",
    sender: "Plan",
    initials: "PL",
    subject: "Follow-up suggested",
    preview: "Cardio window within 5 days",
    time: "Draft",
  },
];

const AGENT_ROWS: readonly MiniRow[] = [
  {
    id: "auth",
    sender: "Prior Auth",
    initials: "PA",
    subject: "Packet drafting",
    preview: "Medical necessity · chart cited",
    time: "Running",
    selected: true,
  },
  {
    id: "referral",
    sender: "Referral",
    initials: "RF",
    subject: "Cardio routing",
    preview: "Tue 9:20 · awaiting booking",
    time: "Queued",
  },
  {
    id: "lab",
    sender: "Lab Sync",
    initials: "LS",
    subject: "Synopsis ready",
    preview: "Urgent panel sorted for review",
    time: "Done",
  },
];

function JoinHeroBrainPanel() {
  return (
    <MiniInboxShell
      width="w-[23rem]"
      height="h-[18.5rem]"
      navIcon="M12 3v2M12 19v2M5 12H3M21 12h-2M7.05 7.05 5.636 5.636M18.364 18.364l-1.414-1.414M16.95 7.05l1.414-1.414M7.05 16.95l-1.414 1.414"
      toolbarLabel="Brain"
      toolbarIcon="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      rows={BRAIN_ROWS}
      footer="Guardrailed reasoning · needs sign-off before note"
    />
  );
}

function JoinHeroAgentsPanel() {
  return (
    <MiniInboxShell
      width="w-[24rem]"
      height="h-[19.5rem]"
      navIcon="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"
      toolbarLabel="Agents"
      toolbarIcon="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"
      badge="3"
      rows={AGENT_ROWS}
      footer="Automations run inside the same inbox thread"
    />
  );
}

const PANELS: Record<JoinHeroAiFeatureCardId, () => JSX.Element> = {
  brain: JoinHeroBrainPanel,
  agents: JoinHeroAgentsPanel,
};

const CARD_ANCHOR: Record<JoinHeroAiFeatureCardId, { className: string; transform: string }> = {
  brain: {
    className: "left-0 top-1/2",
    transform: `translate(-50%, -50%) scale(${JOIN_HERO_AI_CARD_INVERSE_SCALE})`,
  },
  agents: {
    className: "left-1/2 top-full",
    transform: `translate(-50%, -50%) scale(${JOIN_HERO_AI_CARD_INVERSE_SCALE})`,
  },
};

function JoinHeroAiFeatureCard({ id, zIndex }: { id: JoinHeroAiFeatureCardId; zIndex: number }) {
  const Panel = PANELS[id];
  const anchor = CARD_ANCHOR[id];

  return (
    <div
      className={`absolute ${anchor.className}`}
      style={{
        zIndex,
        transform: anchor.transform,
      }}
      aria-hidden
    >
      <Panel />
    </div>
  );
}

/** Desktop join hero — inbox-style AI panels locked to inbox preview edge midpoints. */
export function JoinHeroAiFeatureCards({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        top: JOIN_HERO_TRIAGE_PANEL.top,
        right: JOIN_HERO_TRIAGE_PANEL.right,
        bottom: JOIN_HERO_TRIAGE_PANEL.bottom,
        width: JOIN_HERO_TRIAGE_PANEL.width,
      }}
      aria-hidden
    >
      <div
        className="relative h-full w-full"
        style={{
          transform: `scale(${JOIN_HERO_TRIAGE_SCALE})`,
          transformOrigin: "bottom right",
        }}
      >
        {JOIN_HERO_AI_FEATURE_CARDS.map((config) => (
          <JoinHeroAiFeatureCard key={config.id} id={config.id} zIndex={config.zIndex} />
        ))}
      </div>
    </div>
  );
}
