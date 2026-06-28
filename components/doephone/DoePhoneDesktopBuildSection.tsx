"use client";

import {
  DoePhoneAmbientPromptCard,
  PromptTag,
  WorkflowMentionAt,
} from "@/components/doephone/DoePhoneAmbientPromptCard";
import { DoePhoneDesktopFrostPlusBadge } from "@/components/doephone/DoePhoneDesktopFrostPlusBadge";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { inter } from "@/lib/home/fonts";
import {
  DESKTOP_HOME_BAND_H,
  DESKTOP_FULLSCREEN_SECTION_BADGE_INSET,
  DESKTOP_FULLSCREEN_SECTION_TITLE_PT,
  DESKTOP_FULLSCREEN_SECTION_TITLE_TW,
  DOEPHONE_DESKTOP_PAGE_INSET_RIGHT,
  DOEPHONE_DESKTOP_PAGE_INSET_X,
} from "@/lib/doephone/section-styles";
import { doephoneSectionRevealStyleVars } from "@/lib/doephone/section-reveal-timing";
import {
  doePhoneSectionRevealSegmentClass,
  useDoePhoneSectionReveal,
} from "@/lib/doephone/use-doe-phone-section-reveal";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

const BUILD_BACKDROP_SLIDE =
  DOEPHONE_COMMUNICATION_SLIDES.find((slide) => slide.id === "inbox") ??
  (() => {
    throw new Error("Missing documents communication slide");
  })();

const DESKTOP_BUILD_INSET = DOEPHONE_DESKTOP_PAGE_INSET_X;
const DESKTOP_BUILD_INPUT_INSET = `pb-10 md:pb-14 lg:pb-16 xl:pb-20 ${DOEPHONE_DESKTOP_PAGE_INSET_RIGHT}`;

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
      className={`pointer-events-none absolute inset-0 z-[12] h-full w-full backdrop-blur-[10px] ${
        closing ? "doephone-carousel-frost-out" : "doephone-carousel-frost-fill"
      }`}
      style={{
        background: "rgba(210, 119, 76, 0.48)",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.38)",
      }}
      aria-hidden
    />
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

  const backdrop = BUILD_BACKDROP_SLIDE.backdrop;

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
      className={`relative isolate z-10 w-full overflow-hidden bg-[#1E343A] ${DESKTOP_HOME_BAND_H}`}
      style={doephoneSectionRevealStyleVars() as CSSProperties}
      aria-label="Build"
    >
      <div className="pointer-events-none absolute -inset-[3%] overflow-hidden" aria-hidden>
        <WorkflowCarouselDesignBackdrop
          backdrop={backdrop}
          embedded
          gradientScale={1.18}
          grainBackgroundSize="100px 100px"
          patternScale={1}
        />
      </div>

      {panelOpen ? <BuildSectionFrostOverlay closing={isClosing} /> : null}

      <div
        ref={sectionRef}
        className={`relative z-[20] flex w-full flex-col ${DESKTOP_HOME_BAND_H}`}
      >
        <DoePhoneDesktopFrostPlusBadge
          expanded={panelOpen}
          interactive={!isClosing}
          onToggle={toggleExpanded}
          className={`absolute z-30 ${DESKTOP_FULLSCREEN_SECTION_BADGE_INSET} ${doePhoneSectionRevealSegmentClass("badge", revealed)}`}
        />

        <div className={`shrink-0 ${DESKTOP_BUILD_INSET} ${DESKTOP_FULLSCREEN_SECTION_TITLE_PT}`}>
          <div className="relative pr-[clamp(6rem,8.5vw,8.75rem)]">
            <DoePhoneSectionTitle
              line1="Build."
              line2="Build."
              line3="Build."
              color="text-white"
              copyClassName={DESKTOP_FULLSCREEN_SECTION_TITLE_TW}
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
            <div className="w-[clamp(28rem,42vw,44rem)] max-w-full">
              <DoePhoneAmbientPromptCard
                headerLabel="New Workflow"
                layout="section"
                toolIcons="workflow"
                size="desktop"
              >
                Show me which patients have been enrolled in <PromptTag label="Clinical Trial #473" /> from my EMR,
                compile results in <PromptTag label="Excel" /> and integrate data from{" "}
                <PromptTag label="OpenEvidence" /> and email to <WorkflowMentionAt />
              </DoePhoneAmbientPromptCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
