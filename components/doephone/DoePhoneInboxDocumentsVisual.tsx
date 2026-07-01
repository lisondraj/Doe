"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const MUTED = "#9CA3AF";
const MUTED_TEXT = "#6B7280";
const BTN_BG = "#F3F4F6";
const BORDER = "#E5E7EB";
const LIVE_BG = "rgba(210, 119, 76, 0.12)";

const OUTER_RADIUS = "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]";
const INNER_RADIUS = "rounded-[clamp(0.45rem,1.35vmin,0.55rem)]";
const BTN_RADIUS = "rounded-[clamp(0.32rem,0.95vmin,0.4rem)]";
const PILL_RADIUS = "rounded-[clamp(0.32rem,0.95vmin,0.4rem)]";

const INCOMING_DOCS = [
  { label: "Lab results", outcome: "Flagged in chart", icon: "labs", accent: true },
  { label: "Referral letter", outcome: "Routed to specialist", icon: "referral", accent: false },
  { label: "Prior auth", outcome: "Submitted", icon: "auth", accent: false },
  { label: "Imaging report", outcome: "Attached to chart", icon: "imaging", accent: false },
  { label: "Insurance EOB", outcome: "Filed in billing", icon: "billing", accent: false },
  { label: "Patient intake", outcome: "Triaged to inbox", icon: "intake", accent: true },
] as const;

const ROUTING_CHIPS = ["Triage", "Flag", "File"] as const;

type DocIconKind = (typeof INCOMING_DOCS)[number]["icon"];

function DocIcon({ kind }: { kind: DocIconKind }) {
  const iconSize = "clamp(1.15rem,3.55vmin,1.38rem)";
  const stroke = DOE_ORANGE;
  const sw = 1.5;

  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: iconSize, height: iconSize }}
    >
      {kind === "labs" && (
        <>
          <path d="M8 2.5h4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path
            d="M7.5 4.5h5l-1.2 11c0 .9-.8 1.5-1.8 1.5h-0.4c-1 0-1.8-.6-1.8-1.5L7.5 4.5z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </>
      )}
      {kind === "referral" && (
        <path
          d="M4 10h8M12 10l-2.5-2.5M12 10l-2.5 2.5"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {kind === "auth" && (
        <>
          <rect x="4" y="3.5" width="12" height="13" rx="1.5" stroke={stroke} strokeWidth={sw} />
          <path d="M7 8.5l2 2 4-4.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {kind === "imaging" && (
        <>
          <rect x="3.5" y="5" width="13" height="10" rx="1.5" stroke={stroke} strokeWidth={sw} />
          <circle cx="8" cy="9.5" r="1.8" stroke={stroke} strokeWidth={sw} />
          <path d="M11.5 12l2.5-3 2.5 4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {kind === "billing" && (
        <>
          <path d="M5 4.5h10v11H5V4.5z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M7.5 8h5M7.5 10.5h3.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {kind === "intake" && (
        <>
          <path d="M5 4.5h10v11H5V4.5z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M7.5 8h5M7.5 10.5h5M7.5 13h3" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function RoutingIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: "clamp(0.9rem,2.75vmin,1.05rem)", height: "clamp(0.9rem,2.75vmin,1.05rem)" }}
    >
      <path d="M4 10h12M12 6l4 4-4 4" stroke={DOE_ORANGE} strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlowArrow() {
  return (
    <svg
      viewBox="0 0 16 8"
      fill="none"
      aria-hidden
      className="shrink-0 opacity-35"
      style={{ width: "clamp(0.62rem,1.85vmin,0.72rem)", height: "clamp(0.32rem,0.95vmin,0.38rem)" }}
    >
      <path d="M1 4h10M9 2l3 2-3 2" stroke={INK} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocGridCell({ label, outcome, icon, accent }: (typeof INCOMING_DOCS)[number]) {
  const labelSize = "clamp(0.78rem,2.35vmin,0.92rem)";
  const outcomeSize = "clamp(0.68rem,2.05vmin,0.8rem)";

  return (
    <div
      className="flex min-w-0 flex-col"
      style={{
        gap: "clamp(0.38rem,1.15vmin,0.48rem)",
        padding: "clamp(0.72rem,2.25vmin,0.88rem) clamp(0.68rem,2.05vmin,0.82rem)",
      }}
    >
      <div className="flex min-w-0 items-center" style={{ gap: "clamp(0.42rem,1.28vmin,0.55rem)" }}>
        <DocIcon kind={icon} />
        <span className="truncate font-normal leading-snug" style={{ color: MUTED_TEXT, fontSize: labelSize }}>
          {label}
        </span>
      </div>
      <div className="flex min-w-0 items-center" style={{ gap: "clamp(0.28rem,0.85vmin,0.38rem)" }}>
        <FlowArrow />
        <span
          className={`inline-flex max-w-full truncate font-normal leading-none ${PILL_RADIUS}`}
          style={{
            background: accent ? LIVE_BG : BTN_BG,
            color: accent ? DOE_ORANGE : MUTED_TEXT,
            fontSize: outcomeSize,
            padding: "clamp(0.2rem,0.62vmin,0.26rem) clamp(0.38rem,1.15vmin,0.48rem)",
          }}
        >
          {outcome}
        </span>
      </div>
    </div>
  );
}

/** Incoming document flow grid — Inbox carousel slide. */
export function DoePhoneInboxDocumentsVisual() {
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
          padding: "clamp(1.35rem,4.4vmin,1.65rem) clamp(1.25rem,4vmin,1.55rem)",
        }}
      >
        <p
          className="font-semibold leading-none tracking-[-0.015em] iphone-page:mb-[clamp(0.95rem,3.05vmin,1.2rem)]"
          style={{ color: INK, fontSize: headingSize, marginBottom: "clamp(0.78rem,2.45vmin,0.95rem)" }}
        >
          Incoming Documents
        </p>

        <div className={`overflow-hidden border ${INNER_RADIUS}`} style={{ borderColor: BORDER }}>
          <div className="grid grid-cols-2">
            {INCOMING_DOCS.map((doc, index) => (
              <div
                key={doc.label}
                className={index % 2 === 0 ? "border-r" : ""}
                style={{
                  borderColor: BORDER,
                  ...(index < INCOMING_DOCS.length - 2 ? { borderBottom: `1px solid ${DIVIDER}` } : {}),
                }}
              >
                <DocGridCell {...doc} />
              </div>
            ))}
          </div>

          <div className="h-px w-full" style={{ background: DIVIDER }} />

          <div
            className="flex items-center justify-between"
            style={{
              padding: "clamp(0.62rem,1.95vmin,0.78rem) clamp(0.88rem,2.75vmin,1.05rem)",
            }}
          >
            <span className="font-normal leading-none" style={{ color: MUTED, fontSize: "clamp(0.72rem,2.15vmin,0.86rem)" }}>
              247 documents processed today
            </span>
            <span
              className={`inline-flex items-center font-medium leading-none ${PILL_RADIUS}`}
              style={{
                background: LIVE_BG,
                color: DOE_ORANGE,
                fontSize: "clamp(0.72rem,2.15vmin,0.86rem)",
                padding: "clamp(0.22rem,0.68vmin,0.28rem) clamp(0.42rem,1.28vmin,0.52rem)",
              }}
            >
              Auto-sorting on
            </span>
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
          Routing rules
        </p>

        <div className="flex flex-wrap items-center" style={{ gap: "clamp(0.62rem,1.95vmin,0.82rem)" }}>
          {ROUTING_CHIPS.map((label) => (
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
              <RoutingIcon />
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
