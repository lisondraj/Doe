"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const BORDER = "#E5E7EB";
const MUTED = "#9CA3AF";
const MUTED_TEXT = "#6B7280";
const BTN_BG = "#F3F4F6";
const LIVE_BG = "rgba(210, 119, 76, 0.12)";
const ICON_SW = 1.25;

const PUBLISH_BG = "#111827";
const BTN_RADIUS = "rounded-[clamp(0.32rem,0.95vmin,0.4rem)]";

const OUTER_RADIUS = "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]";
const INNER_RADIUS = "rounded-[clamp(0.45rem,1.35vmin,0.55rem)]";
const NODE_RADIUS = "rounded-[clamp(0.68rem,2.05vmin,0.82rem)]";
const PILL_RADIUS = "rounded-[clamp(0.38rem,1.15vmin,0.48rem)]";

const ROW_PAD = "clamp(0.48rem,1.48vmin,0.6rem) clamp(0.72rem,2.2vmin,0.88rem)";
const ICON_SIZE = "clamp(1.15rem,3.55vmin,1.38rem)";
const TILE_ICON_SIZE = "clamp(1.15rem,3.55vmin,1.38rem)";
const LABEL_SIZE = "clamp(0.76rem,2.28vmin,0.9rem)";
const TILE_LABEL_SIZE = "clamp(0.58rem,1.75vmin,0.68rem)";
const TILE_GAP = "clamp(0.32rem,0.98vmin,0.42rem)";
const CONNECTOR_H = "clamp(1.65rem,5.05vmin,2.02rem)";
const FLOW_STROKE = 1.1;
const FLOW_NODE = "clamp(0.32rem,0.98vmin,0.38rem)";
const CANVAS_PAD =
  "clamp(1.15rem,3.55vmin,1.45rem) clamp(0.95rem,2.9vmin,1.15rem) clamp(1.25rem,3.85vmin,1.55rem)";

const INCOMING_DOCS = [
  { title: "Lab results", icon: "labs" },
  { title: "Referral letter", icon: "referral" },
  { title: "Prior auth", icon: "auth" },
] as const;

const CLINICAL_OUTCOMES = [
  { title: "Lab results", action: "Flagged in chart", accent: true },
  { title: "Referral letter", action: "Routed to specialist", accent: false },
  { title: "Prior auth", action: "Submitted to payer", accent: false },
] as const;

type DocIconKind = (typeof INCOMING_DOCS)[number]["icon"];

function FlowNode({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block shrink-0 rounded-full border bg-white ${className}`}
      style={{
        width: FLOW_NODE,
        height: FLOW_NODE,
        borderColor: BORDER,
        borderWidth: FLOW_STROKE,
      }}
    />
  );
}

function FlowChevron() {
  return (
    <svg
      viewBox="0 0 12 8"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: "clamp(0.55rem,1.65vmin,0.65rem)", height: "clamp(0.32rem,0.98vmin,0.38rem)" }}
    >
      <path
        d="M2 2 L6 6 L10 2"
        stroke={BORDER}
        strokeWidth={FLOW_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocIcon({ kind, size = ICON_SIZE }: { kind: DocIconKind; size?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: size, height: size }}
    >
      {kind === "labs" && (
        <>
          <path d="M4.5 14h11" stroke={DOE_ORANGE} strokeWidth={ICON_SW} strokeLinecap="round" />
          <path
            d="M5.5 13l3.5-4 2.5 2.5 3.5-5"
            stroke={DOE_ORANGE}
            strokeWidth={ICON_SW}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {kind === "referral" && (
        <path
          d="M4 10h8M12 10l-2.5-2.5M12 10l-2.5 2.5"
          stroke={DOE_ORANGE}
          strokeWidth={ICON_SW}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {kind === "auth" && (
        <>
          <rect x="4" y="3.5" width="12" height="13" rx="1.5" stroke={DOE_ORANGE} strokeWidth={ICON_SW} />
          <path d="M7 8.5l2 2 4-4.5" stroke={DOE_ORANGE} strokeWidth={ICON_SW} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

function AgentIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: ICON_SIZE, height: ICON_SIZE }}
    >
      <circle cx="10" cy="10" r="6.25" stroke={DOE_ORANGE} strokeWidth={ICON_SW} />
      <circle cx="10" cy="10" r="2" fill={DOE_ORANGE} />
      <path d="M10 3.75v1.5M10 15v1.5M3.75 10h1.5M15 10h1.5" stroke={DOE_ORANGE} strokeWidth={ICON_SW} strokeLinecap="round" />
    </svg>
  );
}

function OutputTag({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <span
      className={`inline-flex max-w-[48%] shrink-0 items-center truncate font-normal leading-none ${PILL_RADIUS}`}
      style={{
        background: accent ? LIVE_BG : BTN_BG,
        color: accent ? DOE_ORANGE : MUTED_TEXT,
        fontSize: "clamp(0.64rem,1.92vmin,0.76rem)",
        padding: "clamp(0.18rem,0.55vmin,0.24rem) clamp(0.38rem,1.15vmin,0.48rem)",
      }}
    >
      {label}
    </span>
  );
}

function IncomingDocTile({ title, icon }: (typeof INCOMING_DOCS)[number]) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col items-center justify-center border bg-white ${INNER_RADIUS}`}
      style={{
        borderColor: BORDER,
        aspectRatio: "1",
        gap: "clamp(0.28rem,0.85vmin,0.38rem)",
        padding: "clamp(0.38rem,1.15vmin,0.48rem) clamp(0.22rem,0.68vmin,0.28rem)",
      }}
    >
      <DocIcon kind={icon} size={TILE_ICON_SIZE} />
      <span
        className="line-clamp-2 text-center font-medium leading-tight"
        style={{ color: INK, fontSize: TILE_LABEL_SIZE }}
      >
        {title}
      </span>
    </div>
  );
}

function IncomingDocsRow() {
  return (
    <div className="flex w-full items-stretch" style={{ gap: TILE_GAP }}>
      {INCOMING_DOCS.map((doc) => (
        <IncomingDocTile key={doc.title} {...doc} />
      ))}
    </div>
  );
}

function DocsToInboxConnector() {
  const mergeY = "38%";

  return (
    <div className="relative w-full" style={{ height: CONNECTOR_H }}>
      <div className="flex h-full w-full" style={{ gap: TILE_GAP }}>
        {[0, 1, 2].map((index) => (
          <div key={index} className="relative min-w-0 flex-1">
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: 0, width: 1, height: mergeY, background: BORDER }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ top: mergeY }}
            >
              <FlowNode />
            </div>
          </div>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 flex -translate-y-1/2"
        style={{ top: mergeY, gap: TILE_GAP }}
      >
        {[0, 1, 2].map((index) => (
          <div key={index} className="min-w-0 flex-1">
            <div
              style={{
                height: 1,
                background: BORDER,
                marginLeft: index === 0 ? "50%" : 0,
                marginRight: index === 2 ? "50%" : 0,
                width: index === 1 ? "100%" : "50%",
              }}
            />
          </div>
        ))}
      </div>

      <div
        className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center"
        style={{ top: mergeY, bottom: 0, width: 1 }}
      >
        <div className="w-px flex-1" style={{ background: BORDER }} />
      </div>

      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 translate-y-1/2 flex-col items-center">
        <FlowChevron />
      </div>
    </div>
  );
}

function IncomingDocsFlow() {
  return (
    <>
      <IncomingDocsRow />
      <DocsToInboxConnector />
      <InboxAgentHub />
    </>
  );
}

function InboxAgentHub() {
  return (
    <div className={`w-full border bg-white ${NODE_RADIUS}`} style={{ borderColor: BORDER }}>
      <div
        className="flex items-center"
        style={{ gap: "clamp(0.38rem,1.15vmin,0.48rem)", padding: ROW_PAD }}
      >
        <AgentIcon />
        <span className="truncate font-medium leading-none" style={{ color: INK, fontSize: LABEL_SIZE }}>
          Inbox Agent
        </span>
      </div>
      <div className="h-px w-full" style={{ background: DIVIDER }} />
      <div
        className="flex items-center"
        style={{ gap: "clamp(0.32rem,0.98vmin,0.42rem)", padding: ROW_PAD }}
      >
        <span className="font-normal leading-none" style={{ color: MUTED, fontSize: "clamp(0.68rem,2.05vmin,0.82rem)" }}>
          Output
        </span>
        <OutputTag label="Sorted & routed" />
      </div>
    </div>
  );
}

function ClinicalOutcomesColumn() {
  return (
    <div className={`w-full overflow-hidden border bg-white ${INNER_RADIUS}`} style={{ borderColor: BORDER }}>
      {CLINICAL_OUTCOMES.map((row, index) => (
        <div key={row.title}>
          {index > 0 ? <div className="h-px w-full" style={{ background: DIVIDER }} /> : null}
          <div
            className="flex items-center justify-between"
            style={{ gap: "clamp(0.38rem,1.15vmin,0.48rem)", padding: ROW_PAD }}
          >
            <span className="min-w-0 truncate font-normal leading-none" style={{ color: MUTED_TEXT, fontSize: LABEL_SIZE }}>
              {row.title}
            </span>
            <OutputTag label={row.action} accent={row.accent} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FlowConnector() {
  return (
    <div
      className="flex flex-col items-center"
      style={{ height: "clamp(1.35rem,4.15vmin,1.65rem)", width: "clamp(0.85rem,2.6vmin,1.02rem)" }}
    >
      <FlowNode />
      <div className="w-px flex-1" style={{ background: BORDER }} />
      <FlowChevron />
    </div>
  );
}

function HeaderButton({
  label,
  variant = "outline",
}: {
  label: string;
  variant?: "outline" | "solid";
}) {
  const labelSize = "clamp(0.72rem,2.15vmin,0.86rem)";

  return (
    <span
      className={`inline-flex items-center font-medium leading-none ${BTN_RADIUS} ${inter.className}`}
      style={{
        fontSize: labelSize,
        padding: "clamp(0.28rem,0.85vmin,0.36rem) clamp(0.42rem,1.28vmin,0.55rem)",
        ...(variant === "solid"
          ? { background: PUBLISH_BG, color: "#FFFFFF" }
          : { background: "#FFFFFF", color: INK, border: `1px solid ${BORDER}` }),
      }}
    >
      {label}
    </span>
  );
}

/** Incoming document flow web — Inbox carousel slide. */
export function DoePhoneWorkflowVisual() {
  const titleSize = "clamp(0.82rem,2.5vmin,0.96rem)";

  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div className={`w-full overflow-hidden border bg-white ${OUTER_RADIUS}`} style={{ borderColor: BORDER }}>
        <div
          className="flex items-center justify-between border-b"
          style={{
            borderColor: BORDER,
            padding: "clamp(0.68rem,2.1vmin,0.82rem) clamp(0.88rem,2.7vmin,1.05rem)",
            gap: "clamp(0.55rem,1.65vmin,0.72rem)",
          }}
        >
          <div className="flex min-w-0 flex-1 items-center" style={{ gap: "clamp(0.28rem,0.85vmin,0.38rem)" }}>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="shrink-0 opacity-45"
              style={{ width: "clamp(0.72rem,2.15vmin,0.85rem)", height: "clamp(0.72rem,2.15vmin,0.85rem)" }}
            >
              <path d="M10 3L5 8l5 5" stroke={INK} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="truncate font-medium leading-none" style={{ color: INK, fontSize: titleSize }}>
              Dr. Chen&apos;s Clinic
            </span>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="shrink-0 opacity-30"
              style={{ width: "clamp(0.62rem,1.85vmin,0.72rem)", height: "clamp(0.62rem,1.85vmin,0.72rem)" }}
            >
              <path d="M11.5 2.5l2 2-7.5 7.5H4v-2L11.5 2.5z" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex shrink-0 items-center" style={{ gap: "clamp(0.22rem,0.68vmin,0.32rem)" }}>
            <HeaderButton label="Review" />
            <HeaderButton label="Deploy" variant="solid" />
          </div>
        </div>

        <div className="flex flex-col items-center" style={{ padding: CANVAS_PAD, gap: 0 }}>
          <div className="w-full" style={{ maxWidth: "clamp(15rem,46vmin,19rem)" }}>
            <IncomingDocsFlow />
          </div>

          <FlowConnector />

          <div className="w-full" style={{ maxWidth: "clamp(15rem,46vmin,19rem)" }}>
            <ClinicalOutcomesColumn />
          </div>
        </div>
      </div>
    </div>
  );
}
