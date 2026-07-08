"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const MUTED_TEXT = "#6B7280";
const BTN_BG = "#F3F4F6";
const BORDER = "#E5E7EB";

const ACTIVE_AGENTS = [
  { name: "Voice Agent", status: "Active", icon: "voice" },
  { name: "Scheduling Agent", status: "Active", icon: "calendar" },
  { name: "Inbox Agent", status: "Active", icon: "inbox" },
  { name: "Billing Agent", status: "Active", icon: "billing" },
  { name: "Referrals Agent", status: "Active", icon: "referrals" },
  { name: "Prior Auth Agent", status: "Active", icon: "prior-auth" },
] as const;

type AgentIconKind = (typeof ACTIVE_AGENTS)[number]["icon"];
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
  chipGap: string;
  chipPad: string;
  rowGap: string;
  rowPad: string;
  footerPad: string;
  headingMarginBottom: string;
  cardHeight: string;
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
  chipGap: "clamp(0.32rem,1vmin,0.42rem)",
  chipPad: "clamp(0.38rem,1.2vmin,0.48rem) clamp(0.62rem,1.95vmin,0.78rem)",
  rowGap: "clamp(0.55rem,1.75vmin,0.72rem)",
  rowPad: "clamp(0.72rem,2.25vmin,0.92rem) clamp(0.88rem,2.75vmin,1.05rem)",
  footerPad: "clamp(0.62rem,1.95vmin,0.78rem) clamp(0.88rem,2.75vmin,1.05rem)",
  headingMarginBottom: "clamp(0.68rem,2.1vmin,0.82rem)",
  cardHeight: "clamp(15.25rem,44.5vmin,18.75rem)",
};

const DESKTOP_SIZES: VisualSizes = {
  outerRadius: "rounded-[clamp(0.85rem,0.95vw,1rem)]",
  innerRadius: "rounded-[clamp(0.48rem,0.58vw,0.62rem)]",
  btnRadius: "rounded-[clamp(0.36rem,0.44vw,0.48rem)]",
  maxWidth: "min(100%, 32rem)",
  panelPad: "clamp(1.15rem,1.45vw,1.5rem) clamp(1.2rem,1.55vw,1.6rem)",
  heading: "clamp(1.12rem,1.35vw,1.42rem)",
  action: "clamp(0.92rem,1.05vw,1.08rem)",
  body: "clamp(0.9rem,1.02vw,1.05rem)",
  status: "clamp(0.78rem,0.9vw,0.92rem)",
  addPlus: "clamp(0.98rem,1.1vw,1.12rem)",
  agentIcon: "clamp(1.18rem,1.4vw,1.48rem)",
  smallIcon: "clamp(0.86rem,0.98vw,1.02rem)",
  chipGap: "clamp(0.34rem,0.42vw,0.46rem)",
  chipPad: "clamp(0.42rem,0.52vw,0.56rem) clamp(0.68rem,0.82vw,0.88rem)",
  rowGap: "clamp(0.58rem,0.72vw,0.76rem)",
  rowPad: "clamp(0.72rem,0.88vw,0.84rem) clamp(0.82rem,1vw,1.05rem)",
  footerPad: "clamp(0.62rem,0.78vw,0.82rem) clamp(0.82rem,1vw,1.05rem)",
  headingMarginBottom: "clamp(0.68rem,0.82vw,0.88rem)",
  cardHeight: "clamp(15.5rem,18.5vw,19rem)",
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
      {kind === "inbox" && (
        <>
          <path d="M3.5 5.5h13v9a1.5 1.5 0 01-1.5 1.5H5a1.5 1.5 0 01-1.5-1.5v-9z" stroke={stroke} strokeWidth={sw} />
          <path d="M3.5 8.5l4.2 2.8a1.2 1.2 0 001.2 0l4.1-2.8" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {kind === "referrals" && (
        <>
          <path d="M4 10h8.5M10.5 7.5L13 10l-2.5 2.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 5.5h5a2 2 0 012 2v7.5a2 2 0 01-2 2h-5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {kind === "prior-auth" && (
        <>
          <rect x="5.5" y="3.5" width="9" height="13" rx="1.5" stroke={stroke} strokeWidth={sw} />
          <path d="M8 7.5h4M8 10.5h4M8 13.5h2.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
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
  const isActive = label === "Active";

  return (
    <span
      className="shrink-0 font-medium leading-none"
      style={{
        color: isActive ? DOE_ORANGE : MUTED_TEXT,
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
}: (typeof ACTIVE_AGENTS)[number] & { sizes: VisualSizes }) {
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
        <span className={`min-w-0 truncate font-normal leading-snug ${inter.className}`} style={{ color: MUTED_TEXT, fontSize: sizes.body }}>
          {name}
        </span>
      </div>
      <StatusLabel label={status} size={sizes.status} />
    </div>
  );
}

/** Active clinic agents list — Agents carousel slide and desktop intelligence section. */
export function DoePhoneClinicAgentsVisual({
  layout = "phone",
}: {
  layout?: VisualLayout;
}) {
  const sizes = layout === "desktop" ? DESKTOP_SIZES : PHONE_SIZES;

  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center px-[clamp(0.65rem,2vmin,0.9rem)] ${suisseIntl.className}`}
      style={{ maxWidth: sizes.maxWidth }}
      aria-hidden
    >
      <div
        className={`flex w-full flex-col border bg-white ${sizes.outerRadius}`}
        style={{
          borderColor: BORDER,
          padding: sizes.panelPad,
          height: sizes.cardHeight,
          minHeight: sizes.cardHeight,
          maxHeight: sizes.cardHeight,
        }}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-3"
          style={{ marginBottom: sizes.headingMarginBottom }}
        >
          <p
            className="font-semibold leading-none tracking-[-0.015em]"
            style={{
              color: INK,
              fontSize: sizes.heading,
            }}
          >
            Active Agents
          </p>
          <span
            className={`inline-flex shrink-0 items-center ${inter.className} font-medium leading-none`}
            style={{
              background: BTN_BG,
              color: INK,
              fontSize: sizes.status,
              padding: sizes.chipPad,
              borderRadius: "999px",
            }}
          >
            {ACTIVE_AGENTS.length} live
          </span>
        </div>

        <div
          className={`flex min-h-0 flex-1 flex-col overflow-hidden border ${sizes.innerRadius}`}
          style={{ borderColor: BORDER }}
        >
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {ACTIVE_AGENTS.map((agent, index) => (
              <div key={agent.name}>
                {index > 0 ? <div className="h-px w-full" style={{ background: DIVIDER }} /> : null}
                <AgentRow {...agent} sizes={sizes} />
              </div>
            ))}

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0"
              style={{
                height: "clamp(1.75rem,18%,2.35rem)",
                background:
                  "linear-gradient(0deg, #FFFFFF 0%, #FFFFFF 28%, rgba(255,255,255,0.92) 58%, rgba(255,255,255,0) 100%)",
              }}
              aria-hidden
            />
          </div>

          <div className="h-px w-full shrink-0" style={{ background: DIVIDER }} />

          <div
            className="flex shrink-0 items-center justify-between bg-white"
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
