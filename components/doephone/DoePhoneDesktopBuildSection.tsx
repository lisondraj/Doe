"use client";

import {
  DoePhoneAmbientPromptCard,
  PromptTag,
  WorkflowMentionAt,
} from "@/components/doephone/DoePhoneAmbientPromptCard";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { inter } from "@/lib/home/fonts";
import { DOEPHONE_SECTION_TITLE_PT } from "@/lib/doephone/section-styles";
import { doephoneSectionRevealStyleVars } from "@/lib/doephone/section-reveal-timing";
import {
  doePhoneSectionRevealSegmentClass,
  useDoePhoneSectionReveal,
} from "@/lib/doephone/use-doe-phone-section-reveal";
import { DOEPHONE_HERO_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

const DESKTOP_BUILD_INSET = "px-10 md:px-20 lg:px-28 xl:px-36";
const DESKTOP_BUILD_INPUT_INSET = "p-10 md:p-14 lg:p-16 xl:p-20";
const DESKTOP_BUILD_BADGE_INSET = "right-10 md:right-20 lg:right-28 xl:right-36 top-10 md:top-14 lg:top-16 xl:top-20";

const BUILD_ADD_BADGE_SIZE = "clamp(5.25rem, 7.5vw, 6.75rem)";

const ORANGE_FROST_STYLE = {
  background: "rgba(210, 119, 76, 0.48)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.38)",
} as const;

const FROST_BLUR_CLASS = "backdrop-blur-[10px]";
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
}: {
  expanded: boolean;
  interactive: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const sharedStyle = {
    width: BUILD_ADD_BADGE_SIZE,
    height: BUILD_ADD_BADGE_SIZE,
    ...ORANGE_FROST_STYLE,
  } as const;

  const plusStyle = {
    fontSize: "clamp(3.15rem, 4.5vw, 4rem)",
    marginTop: "-0.06em",
    paddingRight: "0.07em",
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
            width: "clamp(2rem, 2.85vw, 2.55rem)",
            height: "clamp(2rem, 2.85vw, 2.55rem)",
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

/** Desktop third section — iPhone Build backdrop, title, + expand panel, and bottom-right workflow input. */
export function DoePhoneDesktopBuildSection() {
  const { ref: sectionRef, revealed } = useDoePhoneSectionReveal();
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
      className="relative isolate z-10 min-h-[100dvh] w-full overflow-hidden bg-[#1E343A]"
      style={doephoneSectionRevealStyleVars() as CSSProperties}
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

      <div ref={sectionRef} className="relative z-[20] flex min-h-[100dvh] w-full flex-col">
        <BuildSectionToggleBadge
          expanded={panelOpen}
          interactive={!isClosing}
          onToggle={toggleExpanded}
          className={`z-30 ${DESKTOP_BUILD_BADGE_INSET} ${doePhoneSectionRevealSegmentClass("badge", revealed)}`}
        />

        <div className={`shrink-0 ${DESKTOP_BUILD_INSET} ${DOEPHONE_SECTION_TITLE_PT}`}>
          <div className="relative pr-[clamp(6rem,8.5vw,8.75rem)]">
            <DoePhoneSectionTitle
              line1="Build."
              line2="Build."
              line3="Build."
              color="text-white"
              segmentedReveal
              revealed={revealed}
            />
          </div>
        </div>

        <div className="relative z-[20] flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <div
              className={`${DESKTOP_BUILD_INSET} w-full max-w-[42rem] transition-[opacity,transform] duration-[720ms] lg:max-w-[48rem]`}
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
                    fontSize: "clamp(1.05rem, 1.35vw, 1.28rem)",
                    lineHeight: 1.48,
                    letterSpacing: "-0.018em",
                    marginTop: paragraph === BUILD_PARAGRAPHS[0] ? 0 : "clamp(0.85rem, 1.2vw, 1.15rem)",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div
            className={`absolute bottom-0 right-0 z-[30] ${DESKTOP_BUILD_INPUT_INSET} ${doePhoneSectionRevealSegmentClass("input", revealed)}`}
          >
            <div className="w-[clamp(28rem,42vw,44rem)] max-w-[calc(100vw-2rem)]">
              <DoePhoneAmbientPromptCard
                headerLabel="New Workflow"
                layout="section"
                toolIcons="workflow"
                size="desktop"
              >
                Show me which patients have been enrolled in <PromptTag label="Clinical Trial #473" /> from my EMR,
                compile results in <PromptTag label="Excel" /> and integrate data from{" "}
                <PromptTag label="OpenEvidence" /> + email to <WorkflowMentionAt />
              </DoePhoneAmbientPromptCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
