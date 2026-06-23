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

/** Linear-style issue panel palette. */
const PANEL = {
  surface: "#141416",
  surfaceBorder: "rgba(255, 255, 255, 0.06)",
  widget: "#1b1b1f",
  widgetBorder: "rgba(255, 255, 255, 0.08)",
  widgetInset: "#101012",
  breadcrumb: "#8b8f98",
  title: "#f4f5f7",
  body: "#6f737c",
  activity: "#5c6068",
  status: "#7b8fa3",
  statusIcon: "#f2994a",
  shadow: "0 34px 90px rgba(0, 0, 0, 0.48), 0 10px 28px rgba(0, 0, 0, 0.28)",
} as const;

function TriageStatusIcon() {
  return (
    <span
      className="inline-flex h-[1.28em] w-[1.28em] shrink-0 items-center justify-center rounded-full"
      style={{ background: PANEL.statusIcon }}
      aria-hidden
    >
      <svg width="58%" height="58%" viewBox="0 0 16 16" fill="none">
        <path
          d="M4.25 8h7.5M6.5 5.75 4.25 8l2.25 2.25M9.5 5.75 11.75 8 9.5 10.25"
          stroke="#141416"
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
    <svg width="0.95em" height="0.95em" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1.35v2M8 12.65v2M1.35 8h2M12.65 8h2M3.45 3.45l1.4 1.4M11.15 11.15l1.4 1.4M3.45 12.55l1.4-1.4M11.15 4.85l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ActivityBlurRow({ width }: { width: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-[1.85rem] w-[1.85rem] shrink-0 rounded-full"
        style={{ background: "rgba(255,255,255,0.1)", filter: "blur(5px)" }}
        aria-hidden
      />
      <div
        className="h-[0.82rem] rounded-full"
        style={{ width, background: "rgba(255,255,255,0.08)", filter: "blur(5px)" }}
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

/** Linear-style triage issue card — dark panel, right-facing 3D tilt. */
export function HeroTriagePreview({
  fontClassName,
  size = "desktop",
  style,
  className = "",
}: HeroTriagePreviewProps) {
  const isMobile = size === "mobile";

  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{
        width: isMobile ? "min(100%, calc(100vw - 2.25rem))" : "min(52rem, calc(100vw - 8rem))",
        perspective: isMobile ? "1100px" : "1400px",
        perspectiveOrigin: isMobile ? "18% 42%" : "14% 46%",
        ...style,
      }}
      aria-hidden
    >
      <div
        style={{
          transform: isMobile
            ? "rotateX(13deg) rotateY(18deg) rotateZ(0.35deg)"
            : "rotateX(12deg) rotateY(20deg) rotateZ(0.5deg)",
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className={`relative overflow-hidden ${fontClassName}`}
          style={{
            borderRadius: isMobile ? "1.05rem" : "1.2rem",
            background: PANEL.surface,
            border: `1px solid ${PANEL.surfaceBorder}`,
            boxShadow: PANEL.shadow,
            padding: isMobile
              ? "1.05rem 1.05rem 1.2rem"
              : "clamp(1.35rem, 2vw, 1.85rem) clamp(1.35rem, 2vw, 1.85rem) clamp(1.5rem, 2.2vw, 2rem)",
          }}
        >
          <div
            className="flex items-center gap-[0.55em] font-medium tracking-[-0.015em]"
            style={{
              color: PANEL.breadcrumb,
              fontSize: isMobile ? "0.82rem" : "clamp(0.86rem, 1.05vw, 0.98rem)",
            }}
          >
            <TriageStatusIcon />
            <span>{TRIAGE.breadcrumbParent}</span>
            <svg
              className="h-[0.68em] w-[0.68em] shrink-0 opacity-70"
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

          <div className="relative mt-[0.95em]">
            <h2
              className="max-w-[13.5ch] text-left font-semibold tracking-[-0.04em]"
              style={{
                color: PANEL.title,
                fontSize: isMobile ? "clamp(1.45rem, 6.2vw, 2.05rem)" : "clamp(2rem, 3.35vw, 2.85rem)",
                lineHeight: 1.08,
              }}
            >
              {TRIAGE.title}
            </h2>

            <div
              className="absolute z-[2] overflow-hidden"
              style={{
                left: isMobile ? "0.35rem" : "0.5rem",
                top: isMobile ? "2.35rem" : "clamp(2.5rem, 4vw, 3.35rem)",
                width: isMobile ? "min(17.5rem, 88%)" : "min(21rem, 72%)",
                borderRadius: isMobile ? "0.82rem" : "0.95rem",
                background: PANEL.widget,
                border: `1px solid ${PANEL.widgetBorder}`,
                boxShadow: "0 16px 40px rgba(0, 0, 0, 0.34)",
              }}
            >
              <div
                className="flex items-center gap-[0.5em] px-[0.95em] pb-[0.45em] pt-[0.72em] font-medium tracking-[-0.015em]"
                style={{
                  color: "rgba(244, 245, 247, 0.86)",
                  fontSize: isMobile ? "0.78rem" : "clamp(0.82rem, 0.95vw, 0.92rem)",
                }}
              >
                <span className="text-white/90">
                  <TriageSparkleIcon />
                </span>
                <span>{TRIAGE.widgetTitle}</span>
              </div>
              <div
                className="mx-[0.72em] mb-[0.72em] rounded-[0.62rem] px-[0.82em] py-[0.62em] font-medium tracking-[-0.01em]"
                style={{
                  background: PANEL.widgetInset,
                  color: PANEL.status,
                  fontSize: isMobile ? "0.76rem" : "clamp(0.8rem, 0.9vw, 0.88rem)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                {TRIAGE.widgetStatus}
              </div>
            </div>
          </div>

          <p
            className="relative z-[1] mt-[0.35em] max-w-[34ch] text-left font-normal tracking-[-0.015em]"
            style={{
              color: PANEL.body,
              fontSize: isMobile ? "0.84rem" : "clamp(0.92rem, 1.1vw, 1.02rem)",
              lineHeight: 1.55,
              paddingTop: isMobile ? "3.15rem" : "clamp(3.25rem, 4.8vw, 4rem)",
            }}
          >
            {TRIAGE.description}
          </p>

          <div className="mt-[1.35em]">
            <p
              className="mb-[0.85em] text-left font-medium tracking-[-0.015em]"
              style={{
                color: PANEL.activity,
                fontSize: isMobile ? "0.78rem" : "clamp(0.82rem, 0.95vw, 0.9rem)",
              }}
            >
              Activity
            </p>
            <div className="flex flex-col gap-[0.72em]">
              <ActivityBlurRow width="56%" />
              <ActivityBlurRow width="42%" />
              <ActivityBlurRow width="48%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use HeroTriagePreview */
export const DesktopHeroTriagePreview = HeroTriagePreview;
