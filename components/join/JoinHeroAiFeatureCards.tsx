import { suisseIntl } from "@/lib/home/fonts";
import {
  JOIN_HERO_AI_CARD_DISPLAY_SCALE,
  JOIN_HERO_AI_CARD_INVERSE_SCALE,
  JOIN_HERO_AI_FEATURE_CARDS,
  JOIN_HERO_TRIAGE_PANEL,
  JOIN_HERO_TRIAGE_SCALE,
} from "@/lib/home/hero-triage-theme";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";
import type { ReactNode } from "react";

const SHELL = "overflow-hidden rounded-[1rem] border border-[#EBE7E0] bg-white";
const DIVIDER = "#EEEAE3";
const NAV_W = "3.25rem";
const BRAIN_ACCENT = "#D2774C";
const BRAIN_INK = JOIN_FORM_BEIGE.ink;
const BRAIN_MUTED = "rgba(30, 52, 58, 0.52)";

const AGENT_NODES = [
  {
    id: "auth",
    label: "Prior Auth",
    sub: "Running",
    tone: "accent" as const,
    x: "16%",
    y: "20%",
  },
  {
    id: "referral",
    label: "Referral",
    sub: "Queued",
    tone: "beige" as const,
    x: "74%",
    y: "16%",
  },
  {
    id: "lab",
    label: "Lab Sync",
    sub: "Done",
    tone: "ink" as const,
    x: "82%",
    y: "70%",
  },
] as const;

function AgentGraphNode({
  label,
  sub,
  tone,
}: {
  label: string;
  sub: string;
  tone: "beige" | "accent" | "ink";
}) {
  const isAccent = tone === "accent";
  const isInk = tone === "ink";

  return (
    <div
      className="flex flex-col items-start justify-center rounded-[0.55rem] border px-2.5 py-2"
      style={{
        width: "4.85rem",
        minHeight: "2.65rem",
        background: isAccent ? BRAIN_ACCENT : isInk ? BRAIN_INK : "#FFFFFF",
        borderColor: isAccent ? BRAIN_ACCENT : isInk ? BRAIN_INK : "#ECE8E1",
        color: isAccent || isInk ? "#FFFFFF" : BRAIN_INK,
      }}
    >
      <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{label}</span>
      <span
        style={{
          fontSize: "0.48rem",
          fontWeight: 400,
          marginTop: "0.16rem",
          lineHeight: 1.25,
          color: isAccent || isInk ? "rgba(255,255,255,0.82)" : BRAIN_MUTED,
        }}
      >
        {sub}
      </span>
    </div>
  );
}

function JoinHeroAgentsVisualBody() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-white">
      <div
        className="flex items-center justify-between border-b px-4 py-[0.85rem]"
        style={{ borderColor: DIVIDER }}
      >
        <span style={{ fontSize: "0.58rem", fontWeight: 600, color: BRAIN_INK }}>3 agents coordinating</span>
        <span
          className="inline-flex items-center rounded-[0.35rem] border px-1.5 py-[0.12rem]"
          style={{ borderColor: "#ECE8E1", color: BRAIN_ACCENT, fontSize: "0.48rem", fontWeight: 600 }}
        >
          Same thread
        </span>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden px-3 py-[0.75rem]">
        <svg className="pointer-events-none absolute inset-0 h-full w-[112%] max-w-none" viewBox="0 0 420 240" preserveAspectRatio="none" aria-hidden>
          <path d="M122 62 C 172 46, 198 52, 252 46" fill="none" stroke="#EEEAE3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M252 46 C 278 88, 284 132, 278 178" fill="none" stroke="#EEEAE3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M122 62 C 146 92, 160 118, 176 128" fill="none" stroke="#EEEAE3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M278 178 C 236 154, 204 138, 176 128" fill="none" stroke="#EEEAE3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M252 46 C 218 76, 194 102, 176 128" fill="none" stroke={BRAIN_ACCENT} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M278 178 C 244 154, 208 138, 176 128" fill="none" stroke={BRAIN_ACCENT} strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        <div
          className="absolute left-1/2 top-[52%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
          style={{ zIndex: 2 }}
        >
          <div
            className="flex h-[2.65rem] w-[2.65rem] items-center justify-center rounded-full border"
            style={{ borderColor: "#ECE8E1", background: "#FFFFFF" }}
          >
            <div
              className="flex h-[1.85rem] w-[1.85rem] items-center justify-center rounded-full"
              style={{ background: BRAIN_INK }}
            >
              <MiniIcon d="M4 6h16v12H4V6zm0 0 8 7 8-7" color="#FFFFFF" size={12} />
            </div>
          </div>
          <span style={{ fontSize: "0.5rem", fontWeight: 500, color: BRAIN_MUTED }}>Inbox hub</span>
        </div>

        {AGENT_NODES.map((node) => (
          <div
            key={node.id}
            className="absolute"
            style={{ left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}
          >
            <AgentGraphNode label={node.label} sub={node.sub} tone={node.tone} />
          </div>
        ))}
      </div>

      <div
        className="flex items-center gap-2 border-t px-4 py-[0.8rem]"
        style={{ borderColor: DIVIDER }}
      >
        {[
          { label: "Running", value: "1" },
          { label: "Queued", value: "1" },
          { label: "Done", value: "1" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex min-w-0 flex-1 items-center justify-between rounded-[0.45rem] border px-2.5 py-2"
            style={{ borderColor: "#ECE8E1", background: "#FFFFFF" }}
          >
            <span style={{ fontSize: "0.52rem", fontWeight: 500, color: BRAIN_MUTED }}>{item.label}</span>
            <span style={{ fontSize: "0.6rem", fontWeight: 600, color: BRAIN_INK }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type MiniRow = {
  id: string;
  sender: string;
  initials: string;
  subject: string;
  preview: string;
  time: string;
  selected?: boolean;
};

function MiniIcon({ d, color = "rgba(30, 52, 58, 0.34)", size = 14 }: { d: string; color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden style={{ color, display: "block" }}>
      <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MiniSenderMark({
  initials,
  selected,
  large = false,
}: {
  initials: string;
  selected?: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-medium ${
        large ? "h-[1.75rem] w-[1.75rem] text-[0.62rem]" : "h-[1.45rem] w-[1.45rem] text-[0.52rem]"
      }`}
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

function MiniListRow({ row, large = false }: { row: MiniRow; large?: boolean }) {
  const pad = large ? "0.52rem 0.62rem" : "0.42rem 0.52rem";
  const gap = large ? "0.46rem" : "0.38rem";
  const nameFs = large ? "0.74rem" : "0.62rem";
  const subFs = large ? "0.68rem" : "0.56rem";
  const timeFs = large ? "0.58rem" : "0.48rem";

  if (row.selected) {
    return (
      <div
        style={{
          margin: large ? "0 0.38rem" : "0 0.32rem",
          padding: pad,
          borderRadius: large ? "0.62rem" : "0.55rem",
          background: "#D2774C",
          border: "1px solid #D2774C",
          display: "flex",
          alignItems: "flex-start",
          gap,
        }}
      >
        <MiniSenderMark initials={row.initials} selected large={large} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-[0.4em]">
            <span style={{ fontSize: nameFs, fontWeight: 500, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
              {row.sender}
            </span>
            <span style={{ fontSize: timeFs, fontWeight: 400, color: "rgba(255,255,255,0.72)", flexShrink: 0 }}>
              {row.time}
            </span>
          </div>
          <p className="truncate" style={{ fontSize: subFs, fontWeight: 500, color: "#FFFFFF", marginTop: "0.15em" }}>
            {row.subject}
          </p>
          <p className="mt-[0.12em] truncate" style={{ fontSize: subFs, fontWeight: 400, color: "rgba(255,255,255,0.84)" }}>
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
        margin: large ? "0 0.38rem" : "0 0.32rem",
        padding: pad,
        borderRadius: large ? "0.52rem" : "0.45rem",
        background: JOIN_FORM_BEIGE.page,
      }}
    >
      <MiniSenderMark initials={row.initials} large={large} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-[0.4em]">
          <span style={{ fontSize: nameFs, fontWeight: 500, color: JOIN_FORM_BEIGE.ink, letterSpacing: "-0.01em" }}>
            {row.sender}
          </span>
          <span style={{ fontSize: timeFs, fontWeight: 400, color: "rgba(154, 143, 130, 0.88)", flexShrink: 0 }}>
            {row.time}
          </span>
        </div>
        <p className="truncate" style={{ fontSize: subFs, fontWeight: 500, color: "rgba(30, 52, 58, 0.76)", marginTop: "0.15em" }}>
          {row.subject}
        </p>
        <p className="mt-[0.1em] truncate" style={{ fontSize: subFs, fontWeight: 400, color: "rgba(30, 52, 58, 0.56)" }}>
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
  body,
  footer,
  large = false,
}: {
  width: string;
  height: string;
  navIcon: string;
  toolbarLabel: string;
  toolbarIcon: string;
  badge?: string;
  rows?: readonly MiniRow[];
  body?: ReactNode;
  footer?: string;
  large?: boolean;
}) {
  const navWidth = large ? "3.65rem" : NAV_W;
  const iconSize = large ? 16 : 14;

  return (
    <div className={`${SHELL} flex ${width} ${height} ${suisseIntl.className}`}>
      <nav
        className="flex shrink-0 flex-col items-center"
        style={{
          width: navWidth,
          borderRight: `1px solid ${DIVIDER}`,
          padding: large ? "1rem 0.45rem" : "0.85rem 0.4rem",
          background: "#FFFFFF",
        }}
      >
        <div
          className={`flex items-center justify-center rounded-[0.55rem] ${large ? "h-9 w-9" : "h-8 w-8"}`}
          style={{ background: JOIN_FORM_BEIGE.page }}
        >
          <MiniIcon d={navIcon} color={JOIN_FORM_BEIGE.ink} size={iconSize} />
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col" style={{ background: "#FFFFFF" }}>
        <div
          className="flex items-center gap-[0.45em]"
          style={{
            padding: large ? "1rem 1.15rem" : "0.85rem 1rem",
            borderBottom: `1px solid ${DIVIDER}`,
          }}
        >
          <div className="flex items-center gap-[0.35em]">
            <MiniIcon d={toolbarIcon} color="#D2774C" size={iconSize} />
            <span style={{ fontSize: large ? "1.05rem" : "0.92rem", fontWeight: 500, color: JOIN_FORM_BEIGE.ink }}>
              {toolbarLabel}
            </span>
            {badge ? (
              <span
                className="rounded-full px-[0.45em] text-center"
                style={{
                  fontSize: large ? "0.56rem" : "0.48rem",
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

        <div className="min-h-0 flex-1 overflow-hidden" style={{ padding: body ? 0 : large ? "0.65rem 0.55rem" : "0.55rem 0.45rem" }}>
          {body ?? (
            <div className={`flex flex-col ${large ? "gap-[0.24rem]" : "gap-[0.18rem]"}`}>
              {rows?.map((row) => (
                <MiniListRow key={row.id} row={row} large={large} />
              ))}
            </div>
          )}
        </div>

        {footer ? (
          <div
            className={`truncate border-t ${large ? "px-[1.15rem] py-[0.85rem]" : "px-4 py-2.5"}`}
            style={{
              borderColor: DIVIDER,
              fontSize: large ? "0.62rem" : "0.52rem",
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

const BRAIN_GRAPH_NODES = [
  { id: "rx", label: "Metformin", sub: "Rx change", tone: "beige" as const },
  { id: "sym", label: "Dizziness", sub: "New symptom", tone: "beige" as const },
  { id: "risk", label: "Orthostatic", sub: "Risk flagged", tone: "accent" as const },
  { id: "plan", label: "Cardio", sub: "5-day window", tone: "ink" as const },
] as const;

function BrainGraphNode({
  label,
  sub,
  tone,
}: {
  label: string;
  sub: string;
  tone: "beige" | "accent" | "ink";
}) {
  const isAccent = tone === "accent";
  const isInk = tone === "ink";

  return (
    <div
      className="flex flex-col items-start justify-center rounded-[0.55rem] border px-3 py-2"
      style={{
        width: "5.35rem",
        minHeight: "2.85rem",
        background: isAccent ? BRAIN_ACCENT : isInk ? BRAIN_INK : "#FFFFFF",
        borderColor: isAccent ? BRAIN_ACCENT : isInk ? BRAIN_INK : "#ECE8E1",
        color: isAccent || isInk ? "#FFFFFF" : BRAIN_INK,
      }}
    >
      <span style={{ fontSize: "0.64rem", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{label}</span>
      <span
        style={{
          fontSize: "0.5rem",
          fontWeight: 400,
          marginTop: "0.18rem",
          lineHeight: 1.25,
          color: isAccent || isInk ? "rgba(255,255,255,0.82)" : BRAIN_MUTED,
        }}
      >
        {sub}
      </span>
    </div>
  );
}

function JoinHeroBrainVisualBody() {
  return (
    <div className="flex h-full flex-col bg-white">
      <div
        className="flex items-center gap-3 border-b px-[1.15rem] py-[0.85rem]"
        style={{ borderColor: DIVIDER }}
      >
        <div
          className="flex h-[2.1rem] w-[2.1rem] shrink-0 items-center justify-center rounded-full font-medium"
          style={{
            background: JOIN_FORM_BEIGE.page,
            color: BRAIN_INK,
            border: "1px solid #ECE8E1",
            fontSize: "0.58rem",
          }}
        >
          DK
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "0.74rem", fontWeight: 600, color: BRAIN_INK, letterSpacing: "-0.02em" }}>
              D. Kim · 68F
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-[0.35rem] border px-1.5 py-[0.12rem]"
              style={{ borderColor: "#ECE8E1", color: BRAIN_ACCENT, fontSize: "0.48rem", fontWeight: 600 }}
            >
              <span className="h-1 w-1 rounded-full" style={{ background: BRAIN_ACCENT }} aria-hidden />
              Live
            </span>
          </div>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 px-[1.05rem] py-[0.8rem]">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 396 210" preserveAspectRatio="none" aria-hidden>
          <path d="M108 78 C 142 78, 152 102, 170 102" fill="none" stroke="#EEEAE3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M108 168 C 142 168, 152 102, 170 102" fill="none" stroke="#EEEAE3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M254 102 H 308" fill="none" stroke={BRAIN_ACCENT} strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        <div className="relative grid h-full grid-cols-[1fr_auto_1fr] items-center gap-2.5">
          <div className="flex flex-col items-end gap-2.5">
            {BRAIN_GRAPH_NODES.slice(0, 2).map((node) => (
              <BrainGraphNode key={node.id} label={node.label} sub={node.sub} tone={node.tone} />
            ))}
          </div>

          <div className="flex flex-col items-center gap-1.5 px-1">
            <div
              className="flex h-[2.65rem] w-[2.65rem] items-center justify-center rounded-full border"
              style={{ borderColor: "#ECE8E1", background: "#FFFFFF" }}
            >
              <div
                className="flex h-[1.85rem] w-[1.85rem] items-center justify-center rounded-full"
                style={{ background: BRAIN_ACCENT }}
              >
                <MiniIcon
                  d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"
                  color="#FFFFFF"
                  size={13}
                />
              </div>
            </div>
            <span style={{ fontSize: "0.5rem", fontWeight: 500, color: BRAIN_MUTED }}>Reasoning</span>
          </div>

          <div className="flex flex-col items-start gap-2.5">
            {BRAIN_GRAPH_NODES.slice(2).map((node) => (
              <BrainGraphNode key={node.id} label={node.label} sub={node.sub} tone={node.tone} />
            ))}
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-2 border-t px-[1.15rem] py-[0.8rem]"
        style={{ borderColor: DIVIDER }}
      >
        {[
          { label: "A1c", value: "8.2%" },
          { label: "Confidence", value: "Low" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex min-w-0 flex-1 items-center justify-between rounded-[0.45rem] border px-3 py-2"
            style={{ borderColor: "#ECE8E1", background: "#FFFFFF" }}
          >
            <span style={{ fontSize: "0.56rem", fontWeight: 500, color: BRAIN_MUTED }}>{stat.label}</span>
            <span style={{ fontSize: "0.62rem", fontWeight: 600, color: BRAIN_INK }}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function JoinHeroBrainPanel() {
  return (
    <MiniInboxShell
      large
      width="w-[32rem]"
      height="h-[25rem]"
      navIcon="M12 3v2M12 19v2M5 12H3M21 12h-2M7.05 7.05 5.636 5.636M18.364 18.364l-1.414-1.414M16.95 7.05l1.414-1.414M7.05 16.95l-1.414 1.414"
      toolbarLabel="Brain"
      toolbarIcon="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      body={<JoinHeroBrainVisualBody />}
      footer="Guardrailed reasoning · needs sign-off before note"
    />
  );
}

function JoinHeroAgentsPanel() {
  return (
    <MiniInboxShell
      width="w-[31rem]"
      height="h-[25rem]"
      navIcon="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"
      toolbarLabel="Agents"
      toolbarIcon="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"
      badge="3"
      body={<JoinHeroAgentsVisualBody />}
      footer="Automations run inside the same inbox thread"
    />
  );
}

const BRAIN_SCALE = JOIN_HERO_AI_CARD_INVERSE_SCALE * JOIN_HERO_AI_CARD_DISPLAY_SCALE;
const AGENTS_SCALE = JOIN_HERO_AI_CARD_DISPLAY_SCALE;

function JoinHeroBrainCard({ zIndex }: { zIndex: number }) {
  return (
    <div
      className="absolute"
      style={{
        left: "-18%",
        top: "56%",
        zIndex,
        transform: `translate(-50%, -50%) scale(${BRAIN_SCALE})`,
      }}
      aria-hidden
    >
      <JoinHeroBrainPanel />
    </div>
  );
}

function JoinHeroAgentsCard({ zIndex }: { zIndex: number }) {
  return (
    <div
      className="absolute left-1/2 top-full"
      style={{
        zIndex,
        transform: `translate(-50%, -50%) scale(${AGENTS_SCALE})`,
      }}
      aria-hidden
    >
      <JoinHeroAgentsPanel />
    </div>
  );
}

/** Desktop join hero — Brain on inbox left edge; Agents on inbox bottom edge center. */
export function JoinHeroAiFeatureCards({ className = "" }: { className?: string }) {
  const brainConfig = JOIN_HERO_AI_FEATURE_CARDS.find((card) => card.id === "brain");
  const agentsConfig = JOIN_HERO_AI_FEATURE_CARDS.find((card) => card.id === "agents");

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
        {brainConfig ? <JoinHeroBrainCard zIndex={brainConfig.zIndex} /> : null}
        {agentsConfig ? <JoinHeroAgentsCard zIndex={agentsConfig.zIndex} /> : null}
      </div>
    </div>
  );
}
