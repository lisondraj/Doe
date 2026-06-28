"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, divider: DIVIDER } = CAROUSEL_MENU_UI;

const BORDER = "#E5E7EB";
const MUTED = "#9CA3AF";
const MUTED_TEXT = "#6B7280";
const BTN_BG = "#F3F4F6";
const BANNER_BG = "#F3EBD4";
const BANNER_TEXT = "#9A8456";
const BLUE_ICON_BG = "#EAF2FF";
const BLUE_ICON = "#6B9FD4";
const TAN_ICON_BG = "#F7EDD8";
const TAN_ICON = "#C9955A";
const PUBLISH_BG = "#111827";

const OUTER_RADIUS = "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]";
const NODE_RADIUS = "rounded-[clamp(0.62rem,1.85vmin,0.75rem)]";
const BTN_RADIUS = "rounded-[clamp(0.32rem,0.95vmin,0.4rem)]";
const PILL_RADIUS = "rounded-[clamp(0.32rem,0.95vmin,0.4rem)]";

const NODE_W = "clamp(14.5rem,44vmin,18.5rem)";

function DotsMenu() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="shrink-0 opacity-40"
      style={{ width: "clamp(0.78rem,2.35vmin,0.92rem)", height: "clamp(0.78rem,2.35vmin,0.92rem)" }}
    >
      <circle cx="8" cy="3.5" r="1.05" fill={INK} />
      <circle cx="8" cy="8" r="1.05" fill={INK} />
      <circle cx="8" cy="12.5" r="1.05" fill={INK} />
    </svg>
  );
}

function FileUploadIcon() {
  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{
        width: "clamp(1.65rem,5vmin,2rem)",
        height: "clamp(1.65rem,5vmin,2rem)",
        borderRadius: "clamp(0.35rem,1.05vmin,0.42rem)",
        background: BLUE_ICON_BG,
      }}
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden style={{ width: "58%", height: "58%" }}>
        <path d="M6 3.5h5.5L14 6v10.5H6V3.5z" stroke={BLUE_ICON} strokeWidth="1.35" strokeLinejoin="round" />
        <path d="M11.5 3.5V6H14" stroke={BLUE_ICON} strokeWidth="1.35" strokeLinejoin="round" />
        <path d="M10 8.5V13M8.25 10.75h3.5" stroke={BLUE_ICON} strokeWidth="1.35" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function SelectionListIcon() {
  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{
        width: "clamp(1.65rem,5vmin,2rem)",
        height: "clamp(1.65rem,5vmin,2rem)",
        borderRadius: "clamp(0.35rem,1.05vmin,0.42rem)",
        background: BLUE_ICON_BG,
      }}
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden style={{ width: "58%", height: "58%" }}>
        <rect x="3.5" y="3.5" width="5" height="5" rx="0.8" stroke={BLUE_ICON} strokeWidth="1.35" />
        <rect x="11.5" y="3.5" width="5" height="5" rx="0.8" stroke={BLUE_ICON} strokeWidth="1.35" />
        <rect x="3.5" y="11.5" width="5" height="5" rx="0.8" stroke={BLUE_ICON} strokeWidth="1.35" />
        <rect x="11.5" y="11.5" width="5" height="5" rx="0.8" stroke={BLUE_ICON} strokeWidth="1.35" />
      </svg>
    </div>
  );
}

function ConditionalIcon() {
  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{
        width: "clamp(1.65rem,5vmin,2rem)",
        height: "clamp(1.65rem,5vmin,2rem)",
        borderRadius: "clamp(0.35rem,1.05vmin,0.42rem)",
        background: TAN_ICON_BG,
      }}
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden style={{ width: "58%", height: "58%" }}>
        <path d="M10 3.5v4.5" stroke={TAN_ICON} strokeWidth="1.35" strokeLinecap="round" />
        <path d="M6.5 8h7" stroke={TAN_ICON} strokeWidth="1.35" strokeLinecap="round" />
        <path d="M6.5 8L4.5 13.5M13.5 8l2 5.5" stroke={TAN_ICON} strokeWidth="1.35" strokeLinecap="round" />
        <path d="M4.5 13.5h3.5M12 13.5h3.5" stroke={TAN_ICON} strokeWidth="1.35" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function OutputTag({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex items-center font-normal leading-none ${PILL_RADIUS}`}
      style={{
        background: BTN_BG,
        color: MUTED_TEXT,
        fontSize: "clamp(0.72rem,2.15vmin,0.86rem)",
        padding: "clamp(0.24rem,0.72vmin,0.3rem) clamp(0.48rem,1.45vmin,0.58rem)",
      }}
    >
      {label}
    </span>
  );
}

function WorkflowNode({
  icon,
  title,
  output,
  compact = false,
}: {
  icon: React.ReactNode;
  title: string;
  output?: string;
  compact?: boolean;
}) {
  const titleSize = "clamp(0.84rem,2.55vmin,1rem)";

  return (
    <div
      className={`border bg-white ${NODE_RADIUS}`}
      style={{
        borderColor: BORDER,
        width: compact ? "clamp(9.5rem,29vmin,12rem)" : NODE_W,
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          gap: "clamp(0.48rem,1.45vmin,0.62rem)",
          padding: compact
            ? "clamp(0.58rem,1.85vmin,0.72rem) clamp(0.72rem,2.25vmin,0.88rem)"
            : "clamp(0.72rem,2.25vmin,0.88rem) clamp(0.82rem,2.55vmin,0.98rem)",
        }}
      >
        <div className="flex min-w-0 items-center" style={{ gap: "clamp(0.48rem,1.45vmin,0.62rem)" }}>
          {icon}
          <span className="truncate font-semibold leading-none" style={{ color: INK, fontSize: titleSize }}>
            {title}
          </span>
        </div>
        <DotsMenu />
      </div>

      {output ? (
        <>
          <div className="h-px w-full" style={{ background: DIVIDER }} />
          <div
            className="flex items-center"
            style={{
              gap: "clamp(0.38rem,1.15vmin,0.48rem)",
              padding: "clamp(0.62rem,1.95vmin,0.78rem) clamp(0.82rem,2.55vmin,0.98rem)",
            }}
          >
            <span
              className="font-normal leading-none"
              style={{ color: MUTED, fontSize: "clamp(0.72rem,2.15vmin,0.86rem)" }}
            >
              Output
            </span>
            <OutputTag label={output} />
          </div>
        </>
      ) : null}
    </div>
  );
}

function FlowConnector() {
  return (
    <svg
      viewBox="0 0 24 40"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: "clamp(1rem,3.05vmin,1.22rem)", height: "clamp(1.85rem,5.75vmin,2.45rem)" }}
    >
      <circle cx="12" cy="3" r="2" stroke={BORDER} strokeWidth="1.15" fill="white" />
      <line x1="12" y1="5.5" x2="12" y2="30" stroke={BORDER} strokeWidth="1.15" />
      <path
        d="M8.5 30 L12 36 L15.5 30"
        stroke={BORDER}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function BranchSplit() {
  const branchW = NODE_W;

  return (
    <div className="flex flex-col items-center" style={{ width: branchW }}>
      <svg
        viewBox="0 0 240 88"
        fill="none"
        aria-hidden
        className="w-full"
        style={{ height: "clamp(2.65rem,8.25vmin,3.55rem)" }}
      >
        <circle cx="120" cy="4" r="2" stroke={BORDER} strokeWidth="1.15" fill="white" />
        <line x1="120" y1="6.5" x2="120" y2="24" stroke={BORDER} strokeWidth="1.15" />
        <path
          d="M48 24 H192"
          stroke={BORDER}
          strokeWidth="1.15"
          strokeLinecap="round"
        />
        <path
          d="M48 24 V68"
          stroke={BORDER}
          strokeWidth="1.15"
          strokeLinecap="round"
        />
        <path
          d="M192 24 V68"
          stroke={BORDER}
          strokeWidth="1.15"
          strokeLinecap="round"
        />
        <path
          d="M44 68 L48 74 L52 68"
          stroke={BORDER}
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M188 68 L192 74 L196 68"
          stroke={BORDER}
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      <div
        className="relative w-full"
        style={{ height: "clamp(1.65rem,5.1vmin,2.05rem)", marginTop: "clamp(0.08rem,0.25vmin,0.15rem)" }}
      >
        {[
          { label: "Buyer", left: "20%" },
          { label: "Supplier", left: "80%" },
        ].map(({ label, left }) => (
          <span
            key={label}
            className={`absolute -translate-x-1/2 border bg-white font-medium leading-none ${PILL_RADIUS}`}
            style={{
              left,
              borderColor: BORDER,
              color: INK,
              fontSize: "clamp(0.76rem,2.3vmin,0.9rem)",
              padding: "clamp(0.38rem,1.15vmin,0.48rem) clamp(0.72rem,2.25vmin,0.88rem)",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function HeaderButton({
  label,
  variant = "outline",
  children,
}: {
  label: string;
  variant?: "outline" | "solid";
  children?: React.ReactNode;
}) {
  const labelSize = "clamp(0.72rem,2.15vmin,0.86rem)";

  return (
    <span
      className={`inline-flex items-center font-medium leading-none ${BTN_RADIUS} ${inter.className}`}
      style={{
        gap: "clamp(0.2rem,0.62vmin,0.28rem)",
        fontSize: labelSize,
        padding: "clamp(0.28rem,0.85vmin,0.36rem) clamp(0.42rem,1.28vmin,0.55rem)",
        ...(variant === "solid"
          ? { background: PUBLISH_BG, color: "#FFFFFF" }
          : { background: "#FFFFFF", color: INK, border: `1px solid ${BORDER}` }),
      }}
    >
      {children}
      {label}
    </span>
  );
}

/** Workflow builder panel — Front Desk carousel slide. */
export function DoePhoneWorkflowVisual() {
  const labelSize = "clamp(0.72rem,2.15vmin,0.86rem)";
  const titleSize = "clamp(0.84rem,2.55vmin,1rem)";

  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div className={`w-full overflow-hidden border bg-white ${OUTER_RADIUS}`} style={{ borderColor: BORDER }}>
        {/* Header */}
        <div
          className="flex items-center justify-between border-b"
          style={{
            borderColor: BORDER,
            padding: "clamp(0.62rem,1.95vmin,0.78rem) clamp(0.82rem,2.55vmin,0.98rem)",
            gap: "clamp(0.55rem,1.65vmin,0.72rem)",
          }}
        >
          <div className="flex min-w-0 flex-1 items-center" style={{ gap: "clamp(0.32rem,0.98vmin,0.42rem)" }}>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="shrink-0 opacity-50"
              style={{ width: "clamp(0.75rem,2.25vmin,0.88rem)", height: "clamp(0.75rem,2.25vmin,0.88rem)" }}
            >
              <path d="M10 3L5 8l5 5" stroke={INK} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="truncate font-semibold leading-none" style={{ color: INK, fontSize: titleSize }}>
              First-pass Red Flag Review
            </span>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="shrink-0 opacity-35"
              style={{ width: "clamp(0.65rem,1.95vmin,0.76rem)", height: "clamp(0.65rem,1.95vmin,0.76rem)" }}
            >
              <path d="M11.5 2.5l2 2-7.5 7.5H4v-2L11.5 2.5z" stroke={INK} strokeWidth="1.15" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex shrink-0 items-center" style={{ gap: "clamp(0.22rem,0.68vmin,0.32rem)" }}>
            <HeaderButton label="Test">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden style={{ width: "clamp(0.55rem,1.65vmin,0.65rem)", height: "clamp(0.55rem,1.65vmin,0.65rem)" }}>
                <path d="M6.5 4.5v7l5.5-3.5-5.5-3.5z" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" fill="none" />
              </svg>
            </HeaderButton>
            <HeaderButton label="Access">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden style={{ width: "clamp(0.55rem,1.65vmin,0.65rem)", height: "clamp(0.55rem,1.65vmin,0.65rem)" }}>
                <circle cx="8" cy="5.5" r="2.2" stroke={INK} strokeWidth="1.2" />
                <path d="M3.5 13c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </HeaderButton>
            <HeaderButton label="Publish" variant="solid" />
            <DotsMenu />
          </div>
        </div>

        {/* Shared banner */}
        <div
          className="flex items-center justify-center border-b"
          style={{
            background: BANNER_BG,
            borderColor: "rgba(154, 132, 86, 0.1)",
            gap: "clamp(0.35rem,1.05vmin,0.45rem)",
            padding: "clamp(0.48rem,1.45vmin,0.58rem) clamp(0.82rem,2.55vmin,0.98rem)",
          }}
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden style={{ width: "clamp(0.75rem,2.25vmin,0.88rem)", height: "clamp(0.75rem,2.25vmin,0.88rem)" }}>
            <path d="M3 3.5h10v9H3V3.5z" stroke={BANNER_TEXT} strokeWidth="1.15" strokeLinejoin="round" />
            <path d="M5.5 3.5V2.5h5v1" stroke={BANNER_TEXT} strokeWidth="1.15" strokeLinecap="round" />
            <path d="M6 7h4M6 9.5h2.5" stroke={BANNER_TEXT} strokeWidth="1.15" strokeLinecap="round" />
          </svg>
          <span className="font-normal leading-none" style={{ color: BANNER_TEXT, fontSize: labelSize }}>
            Shared by Whitestone Lane
          </span>
        </div>

        {/* Workflow canvas */}
        <div
          className="flex flex-col items-center"
          style={{
            padding: "clamp(1.05rem,3.25vmin,1.35rem) clamp(0.82rem,2.55vmin,0.98rem) clamp(1.15rem,3.55vmin,1.45rem)",
            gap: "clamp(0.05rem,0.15vmin,0.1rem)",
          }}
        >
          <WorkflowNode icon={<FileUploadIcon />} title="File upload" output="SupplyAgreement" />
          <FlowConnector />
          <WorkflowNode icon={<SelectionListIcon />} title="Selection list" output="Party" />
          <FlowConnector />
          <WorkflowNode icon={<ConditionalIcon />} title="Conditional" compact />
          <BranchSplit />
        </div>
      </div>
    </div>
  );
}
