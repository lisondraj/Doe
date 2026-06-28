"use client";

import {
  DoePhoneAmbientPromptCard,
  PromptTag,
  WorkflowMentionAt,
} from "@/components/doephone/DoePhoneAmbientPromptCard";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { inter } from "@/lib/home/fonts";
import {
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_PT,
} from "@/lib/doephone/section-styles";
import { DOEPHONE_HERO_HEIGHT } from "@/components/doephone/DoePhoneHeroSection";
import { DOEPHONE_HERO_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

const BUILD_ADD_BADGE_SIZE = "clamp(5.25rem,16vmin,6.75rem)";

const ORANGE_FROST_STYLE = {
  background: "rgba(210, 119, 76, 0.48)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.38)",
} as const;

const FROST_BLUR_CLASS = "backdrop-blur-[10px] iphone-page:backdrop-blur-[8px]";
const EXPAND_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const EXPAND_DURATION_MS = 720;

const BUILD_PARAGRAPHS = [
  "Tell Doe what you are trying to accomplish, from chart pulls and trial lists to exports, integrations, and handoffs.",
  "It assembles the steps, tags the right sources, and routes the result to the people who need it without rebuilding the workflow every time.",
] as const;

type PanelPhase = "idle" | "open" | "closing";

function BuildSectionFrostOverlay({ closing }: { closing: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[12] h-full w-full ${FROST_BLUR_CLASS} ${
        closing ? "doephone-carousel-frost-out" : "doephone-carousel-frost-fill"
      }`}
      style={ORANGE_FROST_STYLE}
      aria-hidden
    />
  );
}

function BuildSectionToggleBadge({
  expanded,
  interactive,
  onToggle,
  className = "",
  style,
}: {
  expanded: boolean;
  interactive: boolean;
  onToggle: () => void;
  className?: string;
  style?: CSSProperties;
}) {
  const sharedStyle = {
    width: BUILD_ADD_BADGE_SIZE,
    height: BUILD_ADD_BADGE_SIZE,
    ...ORANGE_FROST_STYLE,
    ...style,
  } as const;

  const plusStyle = {
    fontSize: "clamp(3.35rem,10.4vmin,4.2rem)",
    marginTop: "-0.06em",
    textShadow: "0 1px 8px rgba(30, 52, 58, 0.18)",
  } as const;

  if (!interactive) {
    return (
      <span
        className={`pointer-events-none absolute flex items-center justify-center rounded-full ${FROST_BLUR_CLASS} ${className}`}
        style={sharedStyle}
        aria-hidden
      >
        <span className="font-light leading-none text-white" style={plusStyle}>
          +
        </span>
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`absolute flex items-center justify-center rounded-full ${FROST_BLUR_CLASS} ${className}`}
      style={{ ...sharedStyle, transition: `opacity 720ms ${EXPAND_EASE}` }}
      aria-label={expanded ? "Close details" : "Show details"}
      aria-expanded={expanded}
      onClick={onToggle}
    >
      {expanded ? (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          className="shrink-0"
          style={{
            width: "clamp(2.15rem,6.65vmin,2.75rem)",
            height: "clamp(2.15rem,6.65vmin,2.75rem)",
          }}
        >
          <path
            d="M5 5l10 10M15 5L5 15"
            stroke="white"
            strokeWidth="1.35"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 1px 8px rgba(30, 52, 58, 0.18))" }}
          />
        </svg>
      ) : (
        <span className="font-light leading-none text-white" style={plusStyle}>
          +
        </span>
      )}
    </button>
  );
}

/** Gradient viewport — Build. Build. Build. title + workflow prompt. */
export function DoePhoneCommunicationIntelligenceSection() {
  const [panelPhase, setPanelPhase] = useState<PanelPhase>("idle");
  const closeTimerRef = useRef<number | undefined>(undefined);
  const panelOpen = panelPhase !== "idle";
  const isClosing = panelPhase === "closing";
  const showContent = panelPhase === "open";

  const backdrop = {
    ...DOEPHONE_HERO_BACKDROP,
    lineOverlayOpacity: 0.14,
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const toggleExpanded = useCallback(() => {
    if (panelPhase === "closing") return;

    if (panelPhase === "open") {
      setPanelPhase("closing");
      closeTimerRef.current = window.setTimeout(() => {
        setPanelPhase("idle");
      }, EXPAND_DURATION_MS);
      return;
    }

    setPanelPhase("open");
  }, [panelPhase]);

  return (
    <section
      className="relative isolate z-10 h-full w-full overflow-hidden bg-[#1E343A]"
      style={{ minHeight: DOEPHONE_HERO_HEIGHT, height: DOEPHONE_HERO_HEIGHT }}
      aria-label="Build"
    >
      <div className="pointer-events-none absolute -inset-[3%] overflow-hidden" aria-hidden>
        <WorkflowCarouselDesignBackdrop
          backdrop={backdrop}
          embedded
          gradientScale={1.52}
          patternScale={1}
        />
      </div>

      {panelOpen ? <BuildSectionFrostOverlay closing={isClosing} /> : null}

      <div className="relative z-[20] flex h-full min-h-0 flex-col">

        <BuildSectionToggleBadge
          expanded={panelOpen}
          interactive={!isClosing}
          onToggle={toggleExpanded}
          className="z-30 right-6 iphone-page:right-[max(2.35rem,calc(env(safe-area-inset-right,0px)+5.25vmin))]"
          style={{
            top: "max(1.95rem, calc(env(safe-area-inset-top, 0px) + calc(var(--app-vh, 100lvh) * 0.0725)))",
          }}
        />

        <div className={`relative z-[20] shrink-0 ${DOEPHONE_SECTION_CONTENT_INSET} ${DOEPHONE_SECTION_TITLE_PT}`}>
          <div className="relative pr-[clamp(5.5rem,17vmin,7rem)]">
            <DoePhoneSectionTitle
              line1="Build."
              line2="Build."
              line3="Build."
              color="text-white"
            />
          </div>
        </div>

        <div className="relative z-[20] flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <div
              className={`${DOEPHONE_SECTION_CAROUSEL_INSET_X} w-full max-w-full transition-[opacity,transform] duration-[720ms]`}
              style={{
                transitionTimingFunction: EXPAND_EASE,
                opacity: showContent ? 1 : 0,
                transform: showContent ? "translateY(0)" : "translateY(0.65rem)",
                pointerEvents: showContent ? "auto" : "none",
              }}
            >
              {BUILD_PARAGRAPHS.map((paragraph) => (
                <p
                  key={paragraph}
                  className={`${inter.className} text-left font-normal text-white`}
                  style={{
                    fontSize: "clamp(1.38rem,4.25vmin,1.78rem)",
                    lineHeight: 1.48,
                    letterSpacing: "-0.018em",
                    marginTop: paragraph === BUILD_PARAGRAPHS[0] ? 0 : "clamp(1rem,3.1vmin,1.35rem)",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div
            className={`relative shrink-0 ${DOEPHONE_SECTION_CAROUSEL_INSET_X} pb-[clamp(5.75rem,17.5vmin,7.5rem)]`}
          >
            <DoePhoneAmbientPromptCard headerLabel="New Workflow" layout="section" toolIcons="workflow" size="large">
              Show me which patients have been enrolled in <PromptTag label="Clinical Trial #473" /> from my EMR,
              compile results in <PromptTag label="Excel" /> and integrate data from{" "}
              <PromptTag label="OpenEvidence" /> + email to <WorkflowMentionAt />
            </DoePhoneAmbientPromptCard>
          </div>
        </div>
      </div>
    </section>
  );
}
