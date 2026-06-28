"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const MUTED_TEXT = "#6B7280";
const BTN_BG = "#F3F4F6";
const BORDER = "#E5E7EB";

const CLINIC_AGENTS = [
  { name: "Voice Agent", status: "Deployed", icon: "voice" },
  { name: "Scheduling Agent", status: "Deployed", icon: "calendar" },
  { name: "Billing Agent", status: "Ready", icon: "billing" },
] as const;

const DEPLOYMENTS = ["Front Desk", "Inbox", "Referrals"] as const;

type AgentIconKind = (typeof CLINIC_AGENTS)[number]["icon"];
type VisualLayout = "phone" | "desktop";

type VisualSizes = {
  outerRadius: string;
  innerRadius: string;
  btnRadius: string;
  maxWidth: string;
  panelPad: string;
  heading: string;
  action: string;
  body: string;
  status: string;
  addPlus: string;
  agentIcon: string;
  smallIcon: string;
  sectionGap: string;
  chipGap: string;
  chipPad: string;
  rowGap: string;
  rowPad: string;
  footerPad: string;
  headingMarginBottom: string;
  subheadingMarginTop: string;
  subheadingMarginBottom: string;
};

const PHONE_SIZES: VisualSizes = {
  outerRadius: "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]",
  innerRadius: "rounded-[clamp(0.45rem,1.35vmin,0.55rem)]",
  btnRadius: "rounded-[clamp(0.32rem,0.95vmin,0.4rem)]",
  maxWidth: CAROUSEL_MENU_UI.maxWidthPhone,
  panelPad: "clamp(1.2rem,3.85vmin,1.45rem) clamp(1.25rem,4vmin,1.55rem)",
  heading: "clamp(1.02rem,3.15vmin,1.22rem)",
  action: "clamp(0.84rem,2.55vmin,1rem)",
  body: "clamp(0.88rem,2.65vmin,1.05rem)",
  status: "clamp(0.72rem,2.15vmin,0.86rem)",
  addPlus: "clamp(0.95rem,2.85vmin,1.12rem)",
  agentIcon: "clamp(1.35rem,4.15vmin,1.65rem)",
  smallIcon: "clamp(0.9rem,2.75vmin,1.05rem)",
  sectionGap: "clamp(0.62rem,1.95vmin,0.82rem)",
  chipGap: "clamp(0.32rem,1vmin,0.42rem)",
  chipPad: "clamp(0.38rem,1.2vmin,0.48rem) clamp(0.62rem,1.95vmin,0.78rem)",
  rowGap: "clamp(0.55rem,1.75vmin,0.72rem)",
  rowPad: "clamp(0.82rem,2.55vmin,1.02rem) clamp(0.88rem,2.75vmin,1.05rem)",
  footerPad: "clamp(0.62rem,1.95vmin,0.78rem) clamp(0.88rem,2.75vmin,1.05rem)",
  headingMarginBottom: "clamp(0.78rem,2.45vmin,0.95rem)",
  subheadingMarginTop: "clamp(1.15rem,3.55vmin,1.42rem)",
  subheadingMarginBottom: "clamp(0.68rem,2.1vmin,0.82rem)",
};

const DESKTOP_SIZES: VisualSizes = {
  outerRadius: "rounded-[clamp(1rem,1.2vw,1.25rem)]",
  innerRadius: "rounded-[clamp(0.55rem,0.72vw,0.75rem)]",
  btnRadius: "rounded-[clamp(0.42rem,0.55vw,0.58rem)]",
  maxWidth: "min(100%, 44rem)",
  panelPad: "clamp(1.65rem,2.15vw,2.25rem) clamp(1.75rem,2.3vw,2.4rem)",
  heading: "clamp(1.45rem,1.85vw,1.95rem)",
  action: "clamp(1.05rem,1.28vw,1.3rem)",
  body: "clamp(1rem,1.22vw,1.25rem)",
  status: "clamp(0.88rem,1.05vw,1.05rem)",
  addPlus: "clamp(1.1rem,1.3vw,1.35rem)",
  agentIcon: "clamp(1.5rem,1.85vw,1.95rem)",
  smallIcon: "clamp(1rem,1.2vw,1.25rem)",
  sectionGap: "clamp(0.82rem,1.05vw,1.1rem)",
  chipGap: "clamp(0.42rem,0.55vw,0.58rem)",
  chipPad: "clamp(0.52rem,0.68vw,0.72rem) clamp(0.88rem,1.1vw,1.15rem)",
  rowGap: "clamp(0.72rem,0.92vw,0.98rem)",
  rowPad: "clamp(1rem,1.25vw,1.3rem) clamp(1.05rem,1.3vw,1.35rem)",
  footerPad: "clamp(0.82rem,1.05vw,1.1rem) clamp(1.05rem,1.3vw,1.35rem)",
  headingMarginBottom: "clamp(1rem,1.25vw,1.3rem)",
  subheadingMarginTop: "clamp(1.45rem,1.85vw,1.95rem)",
  subheadingMarginBottom: "clamp(0.85rem,1.05vw,1.1rem)",
};

function AgentIcon({ kind, size }: { kind: AgentIconKind; size: string }) {
  const stroke = DOE_ORANGE;
  const sw = 1.25;

  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: size, height: size }}
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

function DeploymentIcon({ size }: { size: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: size, height: size }}
    >
      <circle cx="10" cy="10" r="7.25" stroke={DOE_ORANGE} strokeWidth="1.2" />
      <path d="M6.5 10h7M10 6.5v7" stroke={DOE_ORANGE} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function SlidersIcon({ size }: { size: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: size, height: size }}
    >
      <line x1="3" y1="7" x2="17" y2="7" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="13" cy="7" r="2.25" fill="white" stroke={INK} strokeWidth="1.2" />
      <line x1="3" y1="13" x2="17" y2="13" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="13" r="2.25" fill="white" stroke={INK} strokeWidth="1.2" />
    </svg>
  );
}

function StatusLabel({ label, size }: { label: string; size: string }) {
  const isDeployed = label === "Deployed";

  return (
    <span
      className="shrink-0 font-medium leading-none"
      style={{
        color: isDeployed ? DOE_ORANGE : MUTED_TEXT,
        fontSize: size,
      }}
    >
      {label}
    </span>
  );
}

function AgentRow({
  name,
  status,
  icon,
  sizes,
}: (typeof CLINIC_AGENTS)[number] & { sizes: VisualSizes }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        gap: sizes.rowGap,
        padding: sizes.rowPad,
      }}
    >
      <div className="flex min-w-0 items-center" style={{ gap: sizes.rowGap }}>
        <AgentIcon kind={icon} size={sizes.agentIcon} />
        <span className="min-w-0 truncate font-normal leading-snug" style={{ color: MUTED_TEXT, fontSize: sizes.body }}>
          {name}
        </span>
      </div>
      <StatusLabel label={status} size={sizes.status} />
    </div>
  );
}

/** Clinic agent roster — Agents carousel slide and desktop intelligence section. */
export function DoePhoneClinicAgentsVisual({
  layout = "phone",
}: {
  layout?: VisualLayout;
}) {
  const sizes = layout === "desktop" ? DESKTOP_SIZES : PHONE_SIZES;

  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: sizes.maxWidth }}
      aria-hidden
    >
      <div
        className={`w-full border bg-white ${sizes.outerRadius}`}
        style={{
          borderColor: BORDER,
          padding: sizes.panelPad,
        }}
      >
        <p
          className="font-semibold leading-none tracking-[-0.015em]"
          style={{
            color: INK,
            fontSize: sizes.heading,
            marginBottom: sizes.headingMarginBottom,
          }}
        >
          Deployments
        </p>

        <div className="flex flex-wrap items-center" style={{ gap: sizes.sectionGap }}>
          {DEPLOYMENTS.map((label) => (
            <button
              key={label}
              type="button"
              className={`inline-flex items-center ${sizes.btnRadius} font-medium leading-none ${inter.className}`}
              style={{
                background: BTN_BG,
                color: INK,
                fontSize: sizes.action,
                gap: sizes.chipGap,
                padding: sizes.chipPad,
              }}
              tabIndex={-1}
            >
              <DeploymentIcon size={sizes.smallIcon} />
              {label}
            </button>
          ))}

          <button
            type="button"
            className={`inline-flex items-center font-medium leading-none ${inter.className}`}
            style={{
              color: INK,
              fontSize: sizes.action,
              gap: sizes.chipGap,
            }}
            tabIndex={-1}
          >
            <span className="font-normal" style={{ fontSize: sizes.addPlus }}>
              +
            </span>
            Add
          </button>
        </div>

        <p
          className="font-semibold leading-none tracking-[-0.015em]"
          style={{
            color: INK,
            fontSize: sizes.heading,
            marginTop: sizes.subheadingMarginTop,
            marginBottom: sizes.subheadingMarginBottom,
          }}
        >
          Clinic Agents
        </p>

        <div className={`overflow-hidden border ${sizes.innerRadius}`} style={{ borderColor: BORDER }}>
          {CLINIC_AGENTS.map((agent, index) => (
            <div key={agent.name}>
              {index > 0 ? <div className="h-px w-full" style={{ background: DIVIDER }} /> : null}
              <AgentRow {...agent} sizes={sizes} />
            </div>
          ))}

          <div className="h-px w-full" style={{ background: DIVIDER }} />

          <div
            className="flex items-center justify-between"
            style={{
              padding: sizes.footerPad,
            }}
          >
            <button
              type="button"
              className={`inline-flex items-center ${sizes.btnRadius} font-medium leading-none ${inter.className}`}
              style={{
                background: BTN_BG,
                color: INK,
                fontSize: sizes.action,
                gap: sizes.chipGap,
                padding: sizes.chipPad,
              }}
              tabIndex={-1}
            >
              <span className="font-normal" style={{ fontSize: sizes.addPlus }}>
                +
              </span>
              Build agent
            </button>

            <button
              type="button"
              className={`ml-auto inline-flex items-center font-medium leading-none ${inter.className}`}
              style={{
                color: INK,
                fontSize: sizes.action,
                gap: sizes.chipGap,
              }}
              tabIndex={-1}
            >
              <SlidersIcon size={sizes.smallIcon} />
              Manage agents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
