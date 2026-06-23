import type { CSSProperties } from "react";

const HERO_TRIAGE = {
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
      className="inline-flex h-[1.35em] w-[1.35em] shrink-0 items-center justify-center rounded-full"
      style={{ background: "linear-gradient(145deg, #f2cf7a 0%, #d4893f 48%, #bf593d 100%)" }}
      aria-hidden
    >
      <svg width="62%" height="62%" viewBox="0 0 16 16" fill="none">
        <path
          d="M4.25 8h7.5M6.5 5.75 4.25 8l2.25 2.25M9.5 5.75 11.75 8 9.5 10.25"
          stroke="#1a2e34"
          strokeWidth="1.35"
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
        d="M8 1.5v2.2M8 12.3v2.2M1.5 8h2.2M12.3 8h2.2M3.4 3.4l1.55 1.55M11.05 11.05l1.55 1.55M3.4 12.6l1.55-1.55M11.05 4.95l1.55-1.55"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ActivityBlurRow({ width }: { width: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-[2.15rem] w-[2.15rem] shrink-0 rounded-full"
        style={{
          background: "rgba(255,255,255,0.14)",
          filter: "blur(5px)",
        }}
        aria-hidden
      />
      <div
        className="h-[0.95rem] rounded-full"
        style={{
          width,
          background: "rgba(255,255,255,0.12)",
          filter: "blur(6px)",
        }}
        aria-hidden
      />
    </div>
  );
}

type DesktopHeroTriagePreviewProps = {
  fontClassName: string;
  style?: CSSProperties;
  className?: string;
};

/** Linear-style triage issue UI — tilted, no outer card; colors tuned for hero gradient. */
export function DesktopHeroTriagePreview({
  fontClassName,
  style,
  className = "",
}: DesktopHeroTriagePreviewProps) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{
        width: "min(58rem, calc(100vw - 10rem))",
        perspective: "1500px",
        perspectiveOrigin: "42% 38%",
        ...style,
      }}
      aria-hidden
    >
      <div
        className={`relative ${fontClassName}`}
        style={{
          transform: "rotateX(11deg) rotateY(-17deg) rotateZ(-1.25deg)",
          transformOrigin: "18% 22%",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex items-center gap-[0.62em] text-[clamp(0.95rem,1.35vw,1.2rem)] font-medium tracking-[-0.02em] text-white/58">
          <TriageStatusIcon />
          <span>{HERO_TRIAGE.breadcrumbParent}</span>
          <svg
            className="h-[0.72em] w-[0.72em] shrink-0 opacity-55"
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
          <span>{HERO_TRIAGE.breadcrumbLeaf}</span>
        </div>

        <div className="relative mt-[clamp(1.35rem,2.2vw,2rem)]">
          <h2
            className="max-w-[14.5ch] text-left font-semibold tracking-[-0.045em] text-white"
            style={{
              fontSize: "clamp(2.35rem, 4.8vw, 4.15rem)",
              lineHeight: 1.04,
              textShadow: "0 2px 28px rgba(20, 36, 42, 0.22)",
            }}
          >
            {HERO_TRIAGE.title}
          </h2>

          <div
            className="absolute left-[clamp(0.5rem,2vw,1.5rem)] top-[clamp(2.8rem,5.2vw,4.4rem)] z-[2] w-[min(24rem,78%)] overflow-hidden rounded-[1.05rem]"
            style={{
              background: "rgba(22, 42, 48, 0.78)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 22px 54px rgba(16, 30, 36, 0.34)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <div className="flex items-center gap-[0.55em] px-[1.05em] pb-[0.55em] pt-[0.85em] text-[clamp(0.88rem,1.15vw,1.02rem)] font-medium tracking-[-0.02em] text-white/82">
              <span className="text-white/88">
                <TriageSparkleIcon />
              </span>
              <span>{HERO_TRIAGE.widgetTitle}</span>
            </div>
            <div
              className="mx-[0.85em] mb-[0.85em] rounded-[0.72rem] px-[0.95em] py-[0.72em] text-[clamp(0.86rem,1.08vw,0.98rem)] font-medium tracking-[-0.015em]"
              style={{
                background: "rgba(8, 18, 22, 0.42)",
                color: "rgba(176, 206, 218, 0.82)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {HERO_TRIAGE.widgetStatus}
            </div>
          </div>
        </div>

        <p
          className="mt-[clamp(1.65rem,2.8vw,2.35rem)] max-w-[36ch] text-left font-normal tracking-[-0.02em] text-white/62"
          style={{
            fontSize: "clamp(1.02rem, 1.55vw, 1.28rem)",
            lineHeight: 1.55,
          }}
        >
          {HERO_TRIAGE.description}
        </p>

        <div className="mt-[clamp(2.2rem,3.6vw,3.2rem)]">
          <p
            className="mb-[clamp(1rem,1.6vw,1.35rem)] text-left text-[clamp(0.92rem,1.2vw,1.05rem)] font-medium tracking-[-0.02em] text-white/42"
          >
            Activity
          </p>
          <div className="flex flex-col gap-[0.95rem]">
            <ActivityBlurRow width="58%" />
            <ActivityBlurRow width="44%" />
            <ActivityBlurRow width="52%" />
          </div>
        </div>
      </div>
    </div>
  );
}
