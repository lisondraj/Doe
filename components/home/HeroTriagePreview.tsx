import {
  DOEPHONE_SHORTCUT_KEY_GRADIENT,
  DOEPHONE_SHORTCUT_PILL_GRADIENT,
  HERO_TRIAGE_GLASS,
  HERO_TRIAGE_INNER_GLASS_TW,
  HERO_TRIAGE_OUTER_GLASS_TW,
  HERO_TRIAGE_PANEL_RIGHT,
  HERO_TRIAGE_PANEL_WIDTH,
  HERO_TRIAGE_TILT,
} from "@/lib/home/hero-triage-preview-styles";
import type { CSSProperties } from "react";

const TRIAGE = {
  breadcrumbParent: "Engineering",
  breadcrumbLeaf: "Triage",
  title: "App freezes on splash screen",
  description:
    "After launch, the splash screen remains visible indefinitely with no cha… The app does not progress to the primary dashboard or menus.",
  widgetTitle: "Triage Intelligence",
  widgetStatus: "Looking for labels…",
} as const;

function TriageStatusIcon() {
  return (
    <span
      className="inline-flex h-[1.15em] w-[1.15em] shrink-0 items-center justify-center rounded-full"
      style={{ background: HERO_TRIAGE_GLASS.accent }}
      aria-hidden
    >
      <svg width="58%" height="58%" viewBox="0 0 16 16" fill="none">
        <path
          d="M4.25 8h7.5M6.5 5.75 4.25 8l2.25 2.25M9.5 5.75 11.75 8 9.5 10.25"
          stroke="#141416"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function TriageSparkleIcon() {
  return (
    <svg width="0.92em" height="0.92em" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1.35v2M8 12.65v2M1.35 8h2M12.65 8h2M3.4 3.4l1.45 1.45M11.15 11.15l1.45 1.45M3.4 12.6l1.45-1.45M11.15 4.85l1.45-1.45"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ActivityBlurRow({ width }: { width: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-[1.65rem] w-[1.65rem] shrink-0 rounded-full"
        style={{ background: "rgba(255,255,255,0.11)", filter: "blur(5px)" }}
        aria-hidden
      />
      <div
        className="h-[0.72rem] rounded-full"
        style={{ width, background: "rgba(255,255,255,0.09)", filter: "blur(5px)" }}
        aria-hidden
      />
    </div>
  );
}

export type HeroTriagePreviewProps = {
  fontClassName: string;
  size?: "desktop" | "mobile";
  style?: CSSProperties;
  className?: string;
};

/**
 * Linear-style triage card — warm Doe glass, single 3D tilt, half bleeds off the right edge.
 * Intro fade is applied on the outer shell via `.doephone-hero-triage-preview` (opacity only).
 */
export function HeroTriagePreview({
  fontClassName,
  size = "desktop",
  style,
  className = "",
}: HeroTriagePreviewProps) {
  const isMobile = size === "mobile";

  return (
    <div
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        top: isMobile ? "34%" : "30%",
        right: isMobile ? HERO_TRIAGE_PANEL_RIGHT.mobile : HERO_TRIAGE_PANEL_RIGHT.desktop,
        width: isMobile ? HERO_TRIAGE_PANEL_WIDTH.mobile : HERO_TRIAGE_PANEL_WIDTH.desktop,
        ...style,
      }}
      aria-hidden
    >
      <div
        style={{
          transform: isMobile ? HERO_TRIAGE_TILT.mobile : HERO_TRIAGE_TILT.desktop,
          transformOrigin: "18% 6%",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className={`${HERO_TRIAGE_OUTER_GLASS_TW} ${fontClassName}`}
          style={{
            borderRadius: isMobile ? "1rem" : "1.1rem",
            background: DOEPHONE_SHORTCUT_PILL_GRADIENT,
            border: `1px solid ${HERO_TRIAGE_GLASS.panelBorder}`,
            boxShadow: HERO_TRIAGE_GLASS.panelShadow,
            padding: isMobile ? "1.1rem 1.15rem 1.25rem" : "1.45rem 1.55rem 1.65rem",
          }}
        >
          <div
            className="flex items-center gap-[0.5em] font-medium tracking-[-0.015em]"
            style={{
              color: HERO_TRIAGE_GLASS.breadcrumb,
              fontSize: isMobile ? "0.8rem" : "0.88rem",
            }}
          >
            <TriageStatusIcon />
            <span>{TRIAGE.breadcrumbParent}</span>
            <svg
              className="h-[0.62em] w-[0.62em] shrink-0 opacity-60"
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

          <div className="relative mt-[0.85rem]">
            <h2
              className="relative z-[1] max-w-[13ch] text-left font-semibold tracking-[-0.04em]"
              style={{
                color: HERO_TRIAGE_GLASS.title,
                fontSize: isMobile ? "clamp(1.65rem, 7.4vw, 2.35rem)" : "clamp(2.05rem, 3.2vw, 3.15rem)",
                lineHeight: 1.08,
              }}
            >
              {TRIAGE.title}
            </h2>

            <p
              className="relative z-[1] mt-[0.85rem] max-w-[32ch] text-left font-normal tracking-[-0.015em]"
              style={{
                color: HERO_TRIAGE_GLASS.body,
                fontSize: isMobile ? "0.84rem" : "0.94rem",
                lineHeight: 1.55,
              }}
            >
              {TRIAGE.description}
            </p>

            <div
              className={`absolute z-[2] ${HERO_TRIAGE_INNER_GLASS_TW}`}
              style={{
                left: 0,
                top: isMobile ? "1.55rem" : "1.85rem",
                width: isMobile ? "min(16.5rem, 88%)" : "min(19.5rem, 68%)",
                borderRadius: "0.82rem",
                background: DOEPHONE_SHORTCUT_KEY_GRADIENT,
                border: `1px solid ${HERO_TRIAGE_GLASS.widgetBorder}`,
                boxShadow: HERO_TRIAGE_GLASS.widgetShadow,
                overflow: "hidden",
              }}
            >
              <div
                className="flex items-center gap-[0.48em] px-[0.9em] pb-[0.35em] pt-[0.68em] font-medium tracking-[-0.015em]"
                style={{
                  color: "rgba(255,255,255,0.88)",
                  fontSize: isMobile ? "0.78rem" : "0.84rem",
                }}
              >
                <span className="text-white/90">
                  <TriageSparkleIcon />
                </span>
                <span>{TRIAGE.widgetTitle}</span>
              </div>
              <div
                className={HERO_TRIAGE_INNER_GLASS_TW}
                style={{
                  margin: "0 0.68em 0.68em",
                  padding: "0.58em 0.78em",
                  borderRadius: "0.58rem",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(210,119,76,0.05) 100%)",
                  color: HERO_TRIAGE_GLASS.status,
                  fontSize: isMobile ? "0.76rem" : "0.82rem",
                  fontWeight: 500,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                {TRIAGE.widgetStatus}
              </div>
            </div>
          </div>

          <div className="mt-[1.35rem]">
            <p
              className="mb-[0.72rem] text-left font-medium tracking-[-0.015em]"
              style={{
                color: HERO_TRIAGE_GLASS.activity,
                fontSize: isMobile ? "0.76rem" : "0.82rem",
              }}
            >
              Activity
            </p>
            <div className="flex flex-col gap-[0.72rem]">
              <ActivityBlurRow width="54%" />
              <ActivityBlurRow width="40%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use HeroTriagePreview */
export const DesktopHeroTriagePreview = HeroTriagePreview;
