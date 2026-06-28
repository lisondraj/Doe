"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const MUTED_TEXT = "#6B7280";
const BTN_BG = "#F3F4F6";
const BORDER = "#E5E7EB";

const OUTER_RADIUS = "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]";
const INNER_RADIUS = "rounded-[clamp(0.45rem,1.35vmin,0.55rem)]";
const BTN_RADIUS = "rounded-[clamp(0.32rem,0.95vmin,0.4rem)]";

const CLINIC_AGENTS = [
  { name: "Voice Agent", status: "Deployed", icon: "voice" },
  { name: "Scheduling Agent", status: "Deployed", icon: "calendar" },
  { name: "Billing Agent", status: "Ready", icon: "billing" },
] as const;

const DEPLOYMENTS = ["Front Desk", "Inbox", "Referrals"] as const;

type AgentIconKind = (typeof CLINIC_AGENTS)[number]["icon"];

function AgentIcon({ kind }: { kind: AgentIconKind }) {
  const iconSize = "clamp(1.35rem,4.15vmin,1.65rem)";
  const stroke = DOE_ORANGE;
  const sw = 1.25;

  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: iconSize, height: iconSize }}
    >
      {kind === "voice" && (
        <>
          <rect x="7.5" y="3" width="5" height="8.5" rx="2.5" stroke={stroke} strokeWidth={sw} />
          <path d="M5.5 11a4.5 4.5 0 009 0" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M10 15.5v2.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {kind === "calendar" && (
        <>
          <rect x="3.5" y="4.5" width="13" height="12.5" rx="1.5" stroke={stroke} strokeWidth={sw} />
          <path d="M3.5 8.5h13" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M7 2.5v3M13 2.5v3" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <circle cx="7.1" cy="11.6" r="1.05" stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="11" cy="11.6" r="1.05" stroke={stroke} strokeWidth={sw * 0.85} />
        </>
      )}
      {kind === "billing" && (
        <>
          <rect x="4.5" y="5.5" width="11" height="9" rx="1.5" stroke={stroke} strokeWidth={sw} />
          <path d="M4.5 8.5h11" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <rect x="6.5" y="10.25" width="2.5" height="1.75" rx="0.35" stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M11 10.75h2.5M11 12.75h1.75" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function DeploymentIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: "clamp(0.9rem,2.75vmin,1.05rem)", height: "clamp(0.9rem,2.75vmin,1.05rem)" }}
    >
      <circle cx="10" cy="10" r="7.25" stroke={DOE_ORANGE} strokeWidth="1.2" />
      <path d="M6.5 10h7M10 6.5v7" stroke={DOE_ORANGE} strokeWidth="1.2" strokeLinecap="round" />
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
      <line x1="3" y1="7" x2="17" y2="7" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="13" cy="7" r="2.25" fill="white" stroke={INK} strokeWidth="1.2" />
      <line x1="3" y1="13" x2="17" y2="13" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="13" r="2.25" fill="white" stroke={INK} strokeWidth="1.2" />
    </svg>
  );
}

function StatusLabel({ label }: { label: string }) {
  const isDeployed = label === "Deployed";

  return (
    <span
      className="shrink-0 font-medium leading-none"
      style={{
        color: isDeployed ? DOE_ORANGE : MUTED_TEXT,
        fontSize: "clamp(0.72rem,2.15vmin,0.86rem)",
      }}
    >
      {label}
    </span>
  );
}

function AgentRow({ name, status, icon }: (typeof CLINIC_AGENTS)[number]) {
  const bodySize = "clamp(0.88rem,2.65vmin,1.05rem)";

  return (
    <div
      className="flex items-center justify-between"
      style={{
        gap: "clamp(0.55rem,1.75vmin,0.72rem)",
        padding: "clamp(0.82rem,2.55vmin,1.02rem) clamp(0.88rem,2.75vmin,1.05rem)",
      }}
    >
      <div className="flex min-w-0 items-center" style={{ gap: "clamp(0.55rem,1.75vmin,0.72rem)" }}>
        <AgentIcon kind={icon} />
        <span className="min-w-0 truncate font-normal leading-snug" style={{ color: MUTED_TEXT, fontSize: bodySize }}>
          {name}
        </span>
      </div>
      <StatusLabel label={status} />
    </div>
  );
}

/** Clinic agent roster — Agents carousel slide. */
export function DoePhoneClinicAgentsVisual() {
  const headingSize = "clamp(1.02rem,3.15vmin,1.22rem)";
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
          padding: "clamp(1.2rem,3.85vmin,1.45rem) clamp(1.25rem,4vmin,1.55rem)",
        }}
      >
        <p
          className="font-semibold leading-none tracking-[-0.015em] iphone-page:mb-[clamp(0.95rem,3.05vmin,1.2rem)]"
          style={{ color: INK, fontSize: headingSize, marginBottom: "clamp(0.78rem,2.45vmin,0.95rem)" }}
        >
          Deployments
        </p>

        <div className="flex flex-wrap items-center" style={{ gap: "clamp(0.62rem,1.95vmin,0.82rem)" }}>
          {DEPLOYMENTS.map((label) => (
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
              <DeploymentIcon />
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

        <p
          className="font-semibold leading-none tracking-[-0.015em] iphone-page:mb-[clamp(0.95rem,3.05vmin,1.2rem)]"
          style={{
            color: INK,
            fontSize: headingSize,
            marginTop: "clamp(1.15rem,3.55vmin,1.42rem)",
            marginBottom: "clamp(0.68rem,2.1vmin,0.82rem)",
          }}
        >
          Clinic Agents
        </p>

        <div className={`overflow-hidden border ${INNER_RADIUS}`} style={{ borderColor: BORDER }}>
          {CLINIC_AGENTS.map((agent, index) => (
            <div key={agent.name}>
              {index > 0 ? <div className="h-px w-full" style={{ background: DIVIDER }} /> : null}
              <AgentRow {...agent} />
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
              Build agent
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
      </div>
    </div>
  );
}
