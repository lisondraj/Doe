"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const MUTED_TEXT = "#6B7280";
const BTN_BG = "#F3F4F6";
const BORDER = "#E5E7EB";
const LIVE_BG = "rgba(210, 119, 76, 0.12)";

const OUTER_RADIUS = "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]";
const INNER_RADIUS = "rounded-[clamp(0.45rem,1.35vmin,0.55rem)]";
const BTN_RADIUS = "rounded-[clamp(0.32rem,0.95vmin,0.4rem)]";
const PILL_RADIUS = "rounded-[clamp(0.32rem,0.95vmin,0.4rem)]";

const CLINIC_AGENTS = [
  { name: "Voice Agent", status: "Live", icon: "voice" },
  { name: "Scheduling Agent", status: "Live", icon: "calendar" },
  { name: "Labs Agent", status: "Active", icon: "labs" },
] as const;

const WORKFLOW_CHIPS = ["Front Desk", "Inbox"] as const;

function AgentIcon({ kind }: { kind: (typeof CLINIC_AGENTS)[number]["icon"] }) {
  const size = "clamp(1.05rem,3.2vmin,1.28rem)";

  if (kind === "voice") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0" style={{ width: size, height: size }}>
        <path
          d="M10 3.5a2.5 2.5 0 00-2.5 2.5v5a2.5 2.5 0 005 0V6a2.5 2.5 0 00-2.5-2.5z"
          stroke={DOE_ORANGE}
          strokeWidth="1.55"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6.5 11.5a3.5 3.5 0 007 0M10 15v2" stroke={DOE_ORANGE} strokeWidth="1.55" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "calendar") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0" style={{ width: size, height: size }}>
        <rect x="3.5" y="4.5" width="13" height="12" rx="1.5" stroke={DOE_ORANGE} strokeWidth="1.55" />
        <path d="M3.5 8.5h13M7 2.5v3M13 2.5v3" stroke={DOE_ORANGE} strokeWidth="1.55" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0" style={{ width: size, height: size }}>
      <path d="M4 15l3.5-5 3 3.5L14 8l2.5 7H4z" stroke={DOE_ORANGE} strokeWidth="1.55" strokeLinejoin="round" />
      <circle cx="7.5" cy="6.5" r="1.5" stroke={DOE_ORANGE} strokeWidth="1.55" />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: "clamp(0.9rem,2.75vmin,1.05rem)", height: "clamp(0.9rem,2.75vmin,1.05rem)" }}
    >
      <circle cx="10" cy="10" r="7.25" stroke={DOE_ORANGE} strokeWidth="1.45" />
      <path d="M6.5 10h7M10 6.5v7" stroke={DOE_ORANGE} strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: "clamp(0.82rem,2.5vmin,0.98rem)", height: "clamp(0.82rem,2.5vmin,0.98rem)" }}
    >
      <line x1="3" y1="7" x2="17" y2="7" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="13" cy="7" r="2.25" fill="white" stroke={INK} strokeWidth="1.5" />
      <line x1="3" y1="13" x2="17" y2="13" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="13" r="2.25" fill="white" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

function StatusPill({ label }: { label: string }) {
  const isLive = label === "Live";

  return (
    <span
      className={`inline-flex shrink-0 items-center font-medium leading-none ${PILL_RADIUS}`}
      style={{
        background: isLive ? LIVE_BG : BTN_BG,
        color: isLive ? DOE_ORANGE : MUTED_TEXT,
        fontSize: "clamp(0.72rem,2.15vmin,0.86rem)",
        padding: "clamp(0.22rem,0.68vmin,0.28rem) clamp(0.42rem,1.28vmin,0.52rem)",
      }}
    >
      {label}
    </span>
  );
}

/** Clinic agent management panel — Agents carousel slide. */
export function DoePhoneClinicAgentsVisual() {
  const headingSize = "clamp(1.02rem,3.15vmin,1.22rem)";
  const bodySize = "clamp(0.88rem,2.65vmin,1.05rem)";
  const actionSize = "clamp(0.84rem,2.55vmin,1rem)";

  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div
        className={`w-full border bg-white ${OUTER_RADIUS}`}
        style={{
          borderColor: BORDER,
          padding: "clamp(1.35rem,4.4vmin,1.65rem) clamp(1.25rem,4vmin,1.55rem)",
        }}
      >
        <p
          className="font-semibold leading-none tracking-[-0.015em] iphone-page:mb-[clamp(0.95rem,3.05vmin,1.2rem)]"
          style={{ color: INK, fontSize: headingSize, marginBottom: "clamp(0.78rem,2.45vmin,0.95rem)" }}
        >
          Clinic Agents
        </p>

        <div className={`overflow-hidden border ${INNER_RADIUS}`} style={{ borderColor: BORDER }}>
          {CLINIC_AGENTS.map((agent, index) => (
            <div key={agent.name}>
              {index > 0 ? <div className="h-px w-full" style={{ background: DIVIDER }} /> : null}
              <div
                className="flex items-center justify-between"
                style={{
                  gap: "clamp(0.55rem,1.75vmin,0.72rem)",
                  padding: "clamp(0.82rem,2.55vmin,1.02rem) clamp(0.88rem,2.75vmin,1.05rem)",
                }}
              >
                <div className="flex min-w-0 items-center" style={{ gap: "clamp(0.55rem,1.75vmin,0.72rem)" }}>
                  <AgentIcon kind={agent.icon} />
                  <span
                    className="min-w-0 truncate font-normal leading-snug"
                    style={{ color: MUTED_TEXT, fontSize: bodySize }}
                  >
                    {agent.name}
                  </span>
                </div>
                <StatusPill label={agent.status} />
              </div>
            </div>
          ))}

          <div className="h-px w-full" style={{ background: DIVIDER }} />

          <div
            className="flex items-center justify-between"
            style={{
              padding: "clamp(0.62rem,1.95vmin,0.78rem) clamp(0.88rem,2.75vmin,1.05rem)",
            }}
          >
            <button
              type="button"
              className={`inline-flex items-center ${BTN_RADIUS} font-medium leading-none ${inter.className}`}
              style={{
                background: BTN_BG,
                color: INK,
                fontSize: actionSize,
                gap: "clamp(0.22rem,0.7vmin,0.32rem)",
                padding: "clamp(0.38rem,1.2vmin,0.48rem) clamp(0.62rem,1.95vmin,0.78rem)",
              }}
              tabIndex={-1}
            >
              <span className="font-normal" style={{ fontSize: "clamp(0.95rem,2.85vmin,1.12rem)" }}>
                +
              </span>
              Deploy agent
            </button>

            <button
              type="button"
              className={`ml-auto inline-flex items-center font-medium leading-none ${inter.className}`}
              style={{
                color: INK,
                fontSize: actionSize,
                gap: "clamp(0.28rem,0.85vmin,0.38rem)",
              }}
              tabIndex={-1}
            >
              <SlidersIcon />
              Manage agents
            </button>
          </div>
        </div>

        <p
          className="font-semibold leading-none tracking-[-0.015em] iphone-page:mb-[clamp(0.95rem,3.05vmin,1.2rem)]"
          style={{
            color: INK,
            fontSize: headingSize,
            marginTop: "clamp(1.45rem,4.5vmin,1.85rem)",
            marginBottom: "clamp(0.78rem,2.45vmin,0.95rem)",
          }}
        >
          Assigned Workflows
        </p>

        <div className="flex items-center" style={{ gap: "clamp(0.62rem,1.95vmin,0.82rem)" }}>
          {WORKFLOW_CHIPS.map((label) => (
            <button
              key={label}
              type="button"
              className={`inline-flex items-center ${BTN_RADIUS} font-medium leading-none ${inter.className}`}
              style={{
                background: BTN_BG,
                color: INK,
                fontSize: actionSize,
                gap: "clamp(0.32rem,1vmin,0.42rem)",
                padding: "clamp(0.38rem,1.2vmin,0.48rem) clamp(0.62rem,1.95vmin,0.78rem)",
              }}
              tabIndex={-1}
            >
              <WorkflowIcon />
              {label}
            </button>
          ))}

          <button
            type="button"
            className={`inline-flex items-center font-medium leading-none ${inter.className}`}
            style={{
              color: INK,
              fontSize: actionSize,
              gap: "clamp(0.15rem,0.48vmin,0.22rem)",
            }}
            tabIndex={-1}
          >
            <span className="font-normal" style={{ fontSize: "clamp(0.95rem,2.85vmin,1.12rem)" }}>
              +
            </span>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
