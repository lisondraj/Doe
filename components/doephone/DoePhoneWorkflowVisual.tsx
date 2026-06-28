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
const PILL_RADIUS = "rounded-[clamp(0.38rem,1.15vmin,0.48rem)]";

const CARD_PAD = "clamp(1.2rem,3.85vmin,1.45rem) clamp(1.25rem,4vmin,1.55rem)";
const ROW_PAD = "clamp(0.82rem,2.55vmin,1.02rem) clamp(0.88rem,2.75vmin,1.05rem)";
const ICON_SIZE = "clamp(1.35rem,4.15vmin,1.65rem)";
const BODY_SIZE = "clamp(0.88rem,2.65vmin,1.05rem)";
const CAPTION_SIZE = "clamp(0.72rem,2.15vmin,0.86rem)";
const TILE_LABEL_SIZE = "clamp(0.72rem,2.15vmin,0.86rem)";
const TILE_GAP = "clamp(0.32rem,0.98vmin,0.42rem)";
const TILE_BASE_ASPECT = 1.18;
const TILE_ASPECT = "2.08";
const TILE_PAD_Y = "clamp(0.36rem,1.1vmin,0.44rem)";
const TILE_INNER_GAP = "clamp(0.32rem,0.98vmin,0.4rem)";
const MERGE_BAR_Y = "44%";
const FLOW_LINE = { backgroundColor: DIVIDER } as const;
const FLOW_CONNECTOR_H = "clamp(1.35rem,4.15vmin,1.65rem)";
const MERGE_CONNECTOR_H = `calc(0.75 * (${FLOW_CONNECTOR_H} + (100cqw - 2 * ${TILE_GAP}) / 3 * (1 / ${TILE_BASE_ASPECT} - 1 / ${TILE_ASPECT})))`;
const HEADER_BTN_SIZE = "clamp(0.84rem,2.55vmin,1rem)";
const HEADER_BTN_PAD = "clamp(0.38rem,1.2vmin,0.48rem) clamp(0.62rem,1.95vmin,0.78rem)";

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

function OutcomeAction({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <span
      className="max-w-[48%] shrink-0 truncate font-normal leading-snug"
      style={{
        color: accent ? DOE_ORANGE : MUTED_TEXT,
        fontSize: BODY_SIZE,
      }}
    >
      {label}
    </span>
  );
}

function OutputTag({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <span
      className={`inline-flex max-w-[48%] shrink-0 items-center truncate font-normal leading-none ${PILL_RADIUS}`}
      style={{
        background: accent ? LIVE_BG : BTN_BG,
        color: accent ? DOE_ORANGE : MUTED_TEXT,
        fontSize: "clamp(0.72rem,2.15vmin,0.86rem)",
        padding: "clamp(0.22rem,0.68vmin,0.28rem) clamp(0.42rem,1.28vmin,0.52rem)",
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
        aspectRatio: TILE_ASPECT,
        gap: TILE_INNER_GAP,
        padding: `${TILE_PAD_Y} clamp(0.36rem,1.1vmin,0.44rem)`,
      }}
    >
      <DocIcon kind={icon} size={ICON_SIZE} />
      <span
        className="line-clamp-2 w-full text-center font-medium leading-tight"
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

function MergeToCenter() {
  return (
    <div aria-hidden className="relative w-full" style={{ height: MERGE_CONNECTOR_H }}>
      <div className="absolute inset-x-0 top-0 flex" style={{ gap: TILE_GAP, height: MERGE_BAR_Y }}>
        {[0, 1, 2].map((index) => (
          <div key={index} className="relative min-w-0 flex-1">
            <div
              className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2"
              style={FLOW_LINE}
            />
          </div>
        ))}
      </div>

      <div
        className="pointer-events-none absolute h-px -translate-y-1/2"
        style={{
          ...FLOW_LINE,
          top: MERGE_BAR_Y,
          left: `calc((100% - 2 * ${TILE_GAP}) / 6)`,
          right: `calc((100% - 2 * ${TILE_GAP}) / 6)`,
        }}
      />

      <div
        className="absolute bottom-0 left-1/2 w-px -translate-x-1/2"
        style={{ ...FLOW_LINE, top: MERGE_BAR_Y }}
      />
    </div>
  );
}

function IncomingDocsFlow() {
  return (
    <div className="relative overflow-visible" style={{ containerType: "inline-size" }}>
      <IncomingDocsRow />
      <MergeToCenter />
      <InboxAgentHub />
    </div>
  );
}

function InboxAgentHub() {
  return (
    <div className={`w-full overflow-hidden border bg-white ${INNER_RADIUS}`} style={{ borderColor: BORDER }}>
      <div
        className="flex items-center"
        style={{ gap: "clamp(0.55rem,1.75vmin,0.72rem)", padding: ROW_PAD }}
      >
        <AgentIcon />
        <span className="truncate font-normal leading-snug" style={{ color: MUTED_TEXT, fontSize: BODY_SIZE }}>
          Inbox Agent
        </span>
      </div>
      <div className="h-px w-full" style={{ background: DIVIDER }} />
      <div
        className="flex items-center"
        style={{ gap: "clamp(0.35rem,1.05vmin,0.45rem)", padding: ROW_PAD }}
      >
        <span className="font-normal leading-none" style={{ color: MUTED, fontSize: CAPTION_SIZE }}>
          Integrations
        </span>
        <OutputTag label="Outlook" />
        <OutputTag label="EPIC" />
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
            style={{ gap: "clamp(0.55rem,1.75vmin,0.72rem)", padding: ROW_PAD }}
          >
            <span className="min-w-0 truncate font-normal leading-snug" style={{ color: MUTED_TEXT, fontSize: BODY_SIZE }}>
              {row.title}
            </span>
            <OutcomeAction label={row.action} accent={row.accent} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FlowConnector() {
  return (
    <div
      aria-hidden
      className="w-px shrink-0"
      style={{ ...FLOW_LINE, height: FLOW_CONNECTOR_H }}
    />
  );
}

function HeaderButton({
  label,
  variant = "outline",
}: {
  label: string;
  variant?: "outline" | "solid";
}) {
  return (
    <span
      className={`inline-flex items-center font-medium leading-none ${BTN_RADIUS} ${inter.className}`}
      style={{
        fontSize: HEADER_BTN_SIZE,
        padding: HEADER_BTN_PAD,
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
export function DoePhoneWorkflowVisual({
  layout = "phone",
}: {
  layout?: "phone" | "desktop";
}) {
  const headingSize = "clamp(1.02rem,3.15vmin,1.22rem)";
  const scale = layout === "desktop" ? 0.74 : 0.9;

  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div
        className="w-full origin-center"
        style={{ transform: `scale(${scale})` }}
      >
        <div
          className={`w-full border bg-white ${OUTER_RADIUS}`}
          style={{ borderColor: BORDER, padding: CARD_PAD }}
        >
        <div
          className="flex items-center justify-between"
          style={{ gap: "clamp(0.55rem,1.65vmin,0.72rem)", marginBottom: "clamp(0.78rem,2.45vmin,0.95rem)" }}
        >
          <p
            className="min-w-0 truncate font-semibold leading-none tracking-[-0.015em]"
            style={{ color: INK, fontSize: headingSize }}
          >
            Documents Workflow
          </p>

          <div className="flex shrink-0 items-center" style={{ gap: "clamp(0.28rem,0.85vmin,0.36rem)" }}>
            <HeaderButton label="Review" />
            <HeaderButton label="Deploy" variant="solid" />
          </div>
        </div>

        <IncomingDocsFlow />

        <div className="flex justify-center">
          <FlowConnector />
        </div>

        <ClinicalOutcomesColumn />
        </div>
      </div>
    </div>
  );
}
