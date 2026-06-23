import {
  DOEPHONE_COMMUNICATION_INNER_GLASS_TW,
  DOEPHONE_COMMUNICATION_OUTER_GLASS_TW,
  DOEPHONE_SHORTCUT_KEY_GRADIENT,
  DOEPHONE_SHORTCUT_PILL_GRADIENT,
  HERO_TRIAGE_GLASS,
  HERO_TRIAGE_PANEL_RIGHT,
  HERO_TRIAGE_PANEL_WIDTH,
} from "@/lib/home/hero-triage-preview-styles";
import type { CSSProperties } from "react";

const TRIAGE = {
  breadcrumbParent: "Engineering",
  breadcrumbLeaf: "Triage",
  issueId: "ENG-2841",
  title: "App freezes on splash screen",
  description:
    "After launch, the splash screen remains visible indefinitely with no cha… The app does not progress to the primary dashboard or menus.",
  widgetTitle: "Triage Intelligence",
  widgetStatus: "Looking for labels…",
  chips: ["Mobile", "P0", "Regression"] as const,
  activity: [
    { who: "M", line: "Assigned to Engineering", time: "2m ago" },
    { who: "A", line: "Similar issue linked", time: "5m ago" },
  ] as const,
} as const;

function TriageStatusIcon() {
  return (
    <span
      className="inline-flex h-[1.45em] w-[1.45em] shrink-0 items-center justify-center rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]"
      style={{ background: `linear-gradient(145deg, ${HERO_TRIAGE_GLASS.accent} 0%, ${HERO_TRIAGE_GLASS.accentDeep} 100%)` }}
      aria-hidden
    >
      <svg width="56%" height="56%" viewBox="0 0 16 16" fill="none">
        <path
          d="M4.25 8h7.5M6.5 5.75 4.25 8l2.25 2.25M9.5 5.75 11.75 8 9.5 10.25"
          stroke="rgba(20, 36, 42, 0.92)"
          strokeWidth="1.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function TriageSparkleIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1.2v2.15M8 12.65v2.15M1.2 8h2.15M12.65 8h2.15M3.35 3.35l1.52 1.52M11.13 11.13l1.52 1.52M3.35 12.65l1.52-1.52M11.13 4.87l1.52-1.52"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MetaChip({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex items-center px-[0.72em] py-[0.34em] text-[0.78em] font-medium tracking-[-0.01em] ${DOEPHONE_COMMUNICATION_INNER_GLASS_TW}`}
      style={{
        background: DOEPHONE_SHORTCUT_KEY_GRADIENT,
        color: HERO_TRIAGE_GLASS.chipText,
      }}
    >
      {label}
    </span>
  );
}

function ActivityRow({
  who,
  line,
  time,
  compact,
}: {
  who: string;
  line: string;
  time: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-[0.85em]">
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${DOEPHONE_COMMUNICATION_INNER_GLASS_TW}`}
        style={{
          width: compact ? "2.15rem" : "2.45rem",
          height: compact ? "2.15rem" : "2.45rem",
          fontSize: compact ? "0.78rem" : "0.86rem",
          background: DOEPHONE_SHORTCUT_KEY_GRADIENT,
          color: HERO_TRIAGE_GLASS.title,
        }}
        aria-hidden
      >
        {who}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="truncate font-medium tracking-[-0.015em]"
          style={{
            color: HERO_TRIAGE_GLASS.body,
            fontSize: compact ? "0.84rem" : "clamp(0.92rem, 1.05vw, 1.02rem)",
          }}
        >
          {line}
        </p>
        <p
          className="mt-[0.2em] font-normal tracking-[-0.01em]"
          style={{
            color: HERO_TRIAGE_GLASS.muted,
            fontSize: compact ? "0.74rem" : "clamp(0.78rem, 0.88vw, 0.86rem)",
          }}
        >
          {time}
        </p>
      </div>
    </div>
  );
}

export type HeroTriagePreviewProps = {
  fontClassName: string;
  size?: "desktop" | "mobile";
  style?: CSSProperties;
  className?: string;
};

/** Large warm-glass triage card — right-facing tilt, half bleeds off the right edge. */
export function HeroTriagePreview({
  fontClassName,
  size = "desktop",
  style,
  className = "",
}: HeroTriagePreviewProps) {
  const isMobile = size === "mobile";
  const panelWidth = isMobile ? HERO_TRIAGE_PANEL_WIDTH.mobile : HERO_TRIAGE_PANEL_WIDTH.desktop;
  const panelRight = isMobile ? HERO_TRIAGE_PANEL_RIGHT.mobile : HERO_TRIAGE_PANEL_RIGHT.desktop;

  return (
    <div
      className={`pointer-events-none absolute bottom-[5%] select-none iphone-page:bottom-[4%] ${className}`}
      style={{
        right: panelRight,
        width: panelWidth,
        perspective: isMobile ? "1050px" : "1350px",
        perspectiveOrigin: "22% 54%",
        ...style,
      }}
      aria-hidden
    >
      <div
        style={{
          transform: isMobile
            ? "rotateX(14deg) rotateY(19deg) rotateZ(0.4deg)"
            : "rotateX(13deg) rotateY(21deg) rotateZ(0.55deg)",
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className={`relative overflow-hidden backdrop-blur-[6px] iphone-page:backdrop-blur-[4px] [transform:translateZ(0)] ${DOEPHONE_COMMUNICATION_OUTER_GLASS_TW} ${fontClassName}`}
          style={{
            borderRadius: isMobile ? "1.2rem" : "clamp(1.15rem, 1.4vw, 1.55rem)",
            background: DOEPHONE_SHORTCUT_PILL_GRADIENT,
            border: "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow: HERO_TRIAGE_GLASS.panelShadow,
            padding: isMobile
              ? "1.35rem 1.35rem 1.5rem"
              : "clamp(1.75rem, 2.4vw, 2.35rem) clamp(1.85rem, 2.5vw, 2.5rem) clamp(2rem, 2.8vw, 2.65rem)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div
              className="flex min-w-0 items-center gap-[0.58em] font-medium tracking-[-0.015em]"
              style={{
                color: HERO_TRIAGE_GLASS.breadcrumb,
                fontSize: isMobile ? "0.9rem" : "clamp(0.95rem, 1.1vw, 1.08rem)",
              }}
            >
              <TriageStatusIcon />
              <span>{TRIAGE.breadcrumbParent}</span>
              <svg
                className="h-[0.68em] w-[0.68em] shrink-0 opacity-65"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6.25 4.5 9.75 8l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{TRIAGE.breadcrumbLeaf}</span>
            </div>
            <span
              className="shrink-0 font-medium tracking-[-0.02em]"
              style={{
                color: HERO_TRIAGE_GLASS.muted,
                fontSize: isMobile ? "0.78rem" : "clamp(0.82rem, 0.92vw, 0.9rem)",
              }}
            >
              {TRIAGE.issueId}
            </span>
          </div>

          <div className="relative mt-[1.05em]">
            <h2
              className="max-w-[12.5ch] text-left font-semibold tracking-[-0.045em]"
              style={{
                color: HERO_TRIAGE_GLASS.title,
                fontSize: isMobile ? "clamp(2.15rem, 9.2vw, 3.35rem)" : "clamp(2.85rem, 4.8vw, 4.65rem)",
                lineHeight: 1.02,
                textShadow: "0 2px 24px rgba(18, 32, 38, 0.18)",
              }}
            >
              {TRIAGE.title}
            </h2>

            <div
              className="mt-[0.95em] flex flex-wrap gap-[0.45em]"
              style={{ maxWidth: isMobile ? "88%" : "72%" }}
            >
              {TRIAGE.chips.map((chip) => (
                <MetaChip key={chip} label={chip} />
              ))}
            </div>

            <div
              className={`absolute z-[2] overflow-hidden backdrop-blur-[3px] iphone-page:backdrop-blur-[2px] [transform:translateZ(0)] ${DOEPHONE_COMMUNICATION_INNER_GLASS_TW}`}
              style={{
                left: isMobile ? "0.15rem" : "0.35rem",
                top: isMobile ? "clamp(5.5rem, 24vw, 7.25rem)" : "clamp(6.5rem, 9vw, 8.75rem)",
                width: isMobile ? "min(19.5rem, 92%)" : "min(24rem, 74%)",
                borderRadius: isMobile ? "0.95rem" : "clamp(0.9rem, 1vw, 1.05rem)",
                background: DOEPHONE_SHORTCUT_KEY_GRADIENT,
                border: "1px solid rgba(255, 255, 255, 0.16)",
                boxShadow: HERO_TRIAGE_GLASS.widgetShadow,
              }}
            >
              <div
                className="flex items-center justify-between gap-3 px-[1em] pb-[0.42em] pt-[0.82em]"
              >
                <div
                  className="flex min-w-0 items-center gap-[0.52em] font-medium tracking-[-0.015em]"
                  style={{
                    color: HERO_TRIAGE_GLASS.title,
                    fontSize: isMobile ? "0.86rem" : "clamp(0.9rem, 1vw, 1rem)",
                  }}
                >
                  <span className="text-white/92">
                    <TriageSparkleIcon />
                  </span>
                  <span>{TRIAGE.widgetTitle}</span>
                </div>
                <span
                  className="inline-flex h-[0.42rem] w-[0.42rem] shrink-0 animate-pulse rounded-full"
                  style={{ background: HERO_TRIAGE_GLASS.accent }}
                  aria-hidden
                />
              </div>
              <div
                className={`mx-[0.78em] mb-[0.78em] px-[0.92em] py-[0.72em] font-medium tracking-[-0.01em] ${DOEPHONE_COMMUNICATION_INNER_GLASS_TW}`}
                style={{
                  borderRadius: isMobile ? "0.68rem" : "0.72rem",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(210,119,76,0.06) 100%)",
                  color: HERO_TRIAGE_GLASS.status,
                  fontSize: isMobile ? "0.82rem" : "clamp(0.86rem, 0.95vw, 0.94rem)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                {TRIAGE.widgetStatus}
              </div>
            </div>
          </div>

          <p
            className="relative z-[1] max-w-[36ch] text-left font-normal tracking-[-0.018em]"
            style={{
              color: HERO_TRIAGE_GLASS.body,
              fontSize: isMobile ? "0.94rem" : "clamp(1rem, 1.15vw, 1.12rem)",
              lineHeight: 1.58,
              paddingTop: isMobile ? "3.65rem" : "clamp(4.25rem, 5.5vw, 5.15rem)",
            }}
          >
            {TRIAGE.description}
          </p>

          <div
            className="my-[1.25em] h-px w-full"
            style={{ background: HERO_TRIAGE_GLASS.divider }}
            aria-hidden
          />

          <div>
            <p
              className="mb-[0.95em] text-left font-medium tracking-[-0.015em]"
              style={{
                color: HERO_TRIAGE_GLASS.muted,
                fontSize: isMobile ? "0.82rem" : "clamp(0.86rem, 0.95vw, 0.94rem)",
              }}
            >
              Activity
            </p>
            <div className="flex flex-col gap-[0.95em]">
              {TRIAGE.activity.map((row) => (
                <ActivityRow key={row.line} {...row} compact={isMobile} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use HeroTriagePreview */
export const DesktopHeroTriagePreview = HeroTriagePreview;
