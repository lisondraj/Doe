import {
  HERO_TRIAGE_GLASS,
  HERO_TRIAGE_INNER_GLASS_TW,
  HERO_TRIAGE_OUTER_GLASS_TW,
  HERO_TRIAGE_PANEL_GRADIENT,
  HERO_TRIAGE_PANEL_LEFT,
  HERO_TRIAGE_PANEL_RIGHT,
  HERO_TRIAGE_PANEL_WIDTH,
  HERO_TRIAGE_TILT,
  HERO_TRIAGE_WIDGET_BODY_GRADIENT,
  HERO_TRIAGE_WIDGET_HEADER_GRADIENT,
  HERO_TRIAGE_WIDGET_WIDTH,
} from "@/lib/home/hero-triage-preview-styles";
import type { CSSProperties } from "react";

const TRIAGE = {
  breadcrumbParent: "Engineering",
  breadcrumbLeaf: "Triage",
  title: "App freezes on splash screen",
  description:
    "After launch, the splash screen remains visible indefinitely with no cha… The app does not progress to the primary dashboard or menus.",
  widgetTitle: "Triage Intelligence",
} as const;

const TRIAGE_SUGGESTIONS = [
  { label: "nan", dot: null, dotShape: null },
  { label: "Mobile App Refactor", dot: "rgba(75,142,232,1)", dotShape: "square" as const },
  { label: "Slack", dot: "rgba(224,30,90,1)", dotShape: "circle" as const },
] as const;

const TRIAGE_RELATIONS = [
  { kind: "Duplicate of", id: "ENG-1419", title: "Loading spinner keeps running on startup" },
  { kind: "Related to", id: "ENG-1828", title: "Mobile app takes a long time to open" },
] as const;

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

function IssueCircleIcon() {
  return (
    <svg width="0.72em" height="0.72em" viewBox="0 0 14 14" fill="none" className="shrink-0" aria-hidden>
      <circle cx="7" cy="7" r="5.6" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
    </svg>
  );
}

type DotShape = "circle" | "square" | null;

function SuggestionChip({
  label,
  dot,
  dotShape,
}: {
  label: string;
  dot: string | null;
  dotShape: DotShape;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-[0.28em] rounded-[0.28em] px-[0.44em] py-[0.15em]"
      style={{
        background: dot
          ? dot.replace("1)", "0.20)")
          : "rgba(255,255,255,0.10)",
        color: "rgba(255,255,255,0.78)",
        fontSize: "inherit",
        fontWeight: 500,
        lineHeight: 1.25,
        whiteSpace: "nowrap",
        border: `1px solid ${dot ? dot.replace("1)", "0.18)") : "rgba(255,255,255,0.10)"}`,
      }}
    >
      {dot && (
        <span
          style={{
            width: "0.46em",
            height: "0.46em",
            borderRadius: dotShape === "circle" ? "50%" : "0.1em",
            background: dot,
            flexShrink: 0,
          }}
        />
      )}
      {label}
    </span>
  );
}

function ActivityBlurRow({ width }: { width: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-[1.5rem] w-[1.5rem] shrink-0 rounded-full"
        style={{ background: "rgba(255,255,255,0.09)", filter: "blur(4px)" }}
        aria-hidden
      />
      <div
        className="h-[0.65rem] rounded-full"
        style={{ width, background: "rgba(255,255,255,0.07)", filter: "blur(4px)" }}
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
 * Linear-style triage card — dark frosted glass, single 3D tilt, right side
 * bleeds off screen. Intro fade applied via `.doephone-hero-triage-preview`.
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
        top: isMobile ? "45%" : "30%",
        ...(isMobile
          ? { left: HERO_TRIAGE_PANEL_LEFT.mobile }
          : { right: HERO_TRIAGE_PANEL_RIGHT.desktop }),
        width: isMobile ? HERO_TRIAGE_PANEL_WIDTH.mobile : HERO_TRIAGE_PANEL_WIDTH.desktop,
        ...style,
      }}
      aria-hidden
    >
      <div
        style={{
          transform: isMobile ? HERO_TRIAGE_TILT.mobile : HERO_TRIAGE_TILT.desktop,
          transformOrigin: isMobile ? "5% 6%" : "18% 6%",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className={`${HERO_TRIAGE_OUTER_GLASS_TW} ${fontClassName}`}
          style={{
            borderRadius: isMobile ? "1.6rem" : "1.1rem",
            background: HERO_TRIAGE_PANEL_GRADIENT,
            border: `1px solid ${HERO_TRIAGE_GLASS.panelBorder}`,
            boxShadow: isMobile ? "none" : HERO_TRIAGE_GLASS.panelShadow,
            padding: isMobile ? "3.0rem 3.3rem 3.5rem" : "1.45rem 1.55rem 1.65rem",
          }}
        >
          {/* Breadcrumb */}
          <div
            className="flex items-center gap-[0.5em] font-medium tracking-[-0.015em]"
            style={{
              color: HERO_TRIAGE_GLASS.breadcrumb,
              fontSize: isMobile ? "1.78rem" : "0.88rem",
            }}
          >
            <TriageStatusIcon />
            <span>{TRIAGE.breadcrumbParent}</span>
            <svg
              className="h-[0.62em] w-[0.62em] shrink-0 opacity-55"
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

          {/* Title + widget + description */}
          <div className="relative mt-[0.82rem]">
            <h2
              className="relative z-[1] max-w-[13ch] text-left font-semibold tracking-[-0.04em]"
              style={{
                color: HERO_TRIAGE_GLASS.title,
                fontSize: isMobile ? "clamp(4.3rem, 18.5vw, 6.2rem)" : "clamp(2.05rem, 3.2vw, 3.15rem)",
                lineHeight: 1.08,
              }}
            >
              {TRIAGE.title}
            </h2>

            <p
              className="relative z-[1] mt-[0.82rem] max-w-[32ch] text-left font-normal tracking-[-0.015em]"
              style={{
                color: HERO_TRIAGE_GLASS.body,
                fontSize: isMobile ? "1.9rem" : "0.94rem",
                lineHeight: 1.55,
              }}
            >
              {TRIAGE.description}
            </p>

            {/* Triage Intelligence floating widget */}
            <div
              className={`absolute z-[2] ${HERO_TRIAGE_INNER_GLASS_TW}`}
              style={{
                left: 0,
                top: isMobile ? "2.4rem" : "1.85rem",
                width: isMobile ? HERO_TRIAGE_WIDGET_WIDTH.mobile : HERO_TRIAGE_WIDGET_WIDTH.desktop,
                borderRadius: "1.2rem",
                background: HERO_TRIAGE_WIDGET_HEADER_GRADIENT,
                border: `1px solid ${HERO_TRIAGE_GLASS.widgetBorder}`,
                boxShadow: HERO_TRIAGE_GLASS.widgetShadow,
                overflow: "hidden",
              }}
            >
              {/* Widget header */}
              <div
                className="flex items-center gap-[0.46em] px-[0.88em] pb-[0.3em] pt-[0.65em] font-medium tracking-[-0.015em]"
                style={{
                  color: "rgba(255,255,255,0.86)",
                  fontSize: isMobile ? "1.7rem" : "0.84rem",
                }}
              >
                <span className="text-white/85">
                  <TriageSparkleIcon />
                </span>
                <span>{TRIAGE.widgetTitle}</span>
              </div>

              {/* Suggestions + relations rows */}
              <div
                style={{
                  margin: "0 0.65em 0.65em",
                  borderRadius: "0.7rem",
                  background: HERO_TRIAGE_WIDGET_BODY_GRADIENT,
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: isMobile ? "0.88em 1.1em" : "0.58em 0.78em",
                  fontSize: isMobile ? "1.48rem" : "0.72rem",
                  fontWeight: 500,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.44em",
                }}
              >
                {/* Suggestions */}
                <div className="flex items-start gap-[0.5em]">
                  <span
                    className="shrink-0 pt-[0.08em]"
                    style={{
                      color: HERO_TRIAGE_GLASS.activity,
                      minWidth: "4.7em",
                    }}
                  >
                    Suggestions
                  </span>
                  <div className="flex flex-wrap gap-[0.28em]">
                    {TRIAGE_SUGGESTIONS.map((s) => (
                      <SuggestionChip
                        key={s.label}
                        label={s.label}
                        dot={s.dot}
                        dotShape={s.dotShape}
                      />
                    ))}
                  </div>
                </div>

                {/* Duplicate of / Related to */}
                {TRIAGE_RELATIONS.map((rel) => (
                  <div key={rel.id} className="flex min-w-0 items-center gap-[0.5em]">
                    <span
                      className="shrink-0"
                      style={{
                        color: HERO_TRIAGE_GLASS.activity,
                        minWidth: "4.7em",
                      }}
                    >
                      {rel.kind}
                    </span>
                    <div className="flex min-w-0 items-center gap-[0.36em]">
                      <IssueCircleIcon />
                      <span className="shrink-0" style={{ color: "rgba(255,255,255,0.44)", fontWeight: 600 }}>
                        {rel.id}
                      </span>
                      <span className="truncate" style={{ color: "rgba(255,255,255,0.64)" }}>
                        {rel.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="mt-[1.3rem]">
            <p
              className="mb-[0.68rem] text-left font-medium tracking-[-0.015em]"
              style={{
                color: HERO_TRIAGE_GLASS.activity,
                fontSize: isMobile ? "1.7rem" : "0.82rem",
              }}
            >
              Activity
            </p>
            <div className="flex flex-col gap-[0.68rem]">
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
