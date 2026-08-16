"use client";

import { StoryGoalsAtSeedPanel } from "@/components/story/StoryGoalsAtSeedPanel";
import { StoryIntroductionPanel } from "@/components/story/StoryIntroductionPanel";
import { StoryOurAskPanel } from "@/components/story/StoryOurAskPanel";
import { StoryFabricPanel } from "@/components/story/StoryFabricPanel";
import { StoryFloatPanel } from "@/components/story/StoryFloatPanel";
import { StoryGenomePanel } from "@/components/story/StoryGenomePanel";
import { StoryPulsePanel } from "@/components/story/StoryPulsePanel";
import { StoryRoadmapPanel } from "@/components/story/StoryRoadmapPanel";
import { StoryTeamPanel } from "@/components/story/StoryTeamPanel";
import { suisseIntl } from "@/lib/home/fonts";
import type { StoryTabId } from "@/lib/story/story-nav";

function storyTabPanelBodyClass(tab: StoryTabId) {
  if (tab === "introduction") return " story-tab-panel__body--introduction";
  if (tab === "our-ask") return " story-tab-panel__body--our-ask";
  if (tab === "goals-at-seed") return " story-tab-panel__body--fundraise story-tab-panel__body--goals";
  if (tab === "team") return " story-tab-panel__body--team";
  if (tab === "roadmap-gtm") return " story-tab-panel__body--roadmap";
  if (tab === "genome") return " story-tab-panel__body--genome";
  if (tab === "pulse") return " story-tab-panel__body--pulse";
  if (tab === "fabric") return " story-tab-panel__body--fabric";
  if (tab === "float") return " story-tab-panel__body--float";
  return "";
}

function StoryNavExpandButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="story-tab-panel__expand-nav"
      aria-label="Expand sidebar"
      aria-expanded={false}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden className="h-5 w-5">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
    </button>
  );
}

function StoryMobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="story-mobile-tab-bar__menu"
      aria-label="Open navigation"
      aria-expanded={false}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>
  );
}

/** Blank brown workspace — tab header and optional tab-specific content. */
export function StoryBlankPanel({
  tab,
  title,
  navCollapsed = false,
  onExpandNav,
  mobileMenu = false,
  onOpenNav,
}: {
  tab: StoryTabId;
  title: string;
  navCollapsed?: boolean;
  onExpandNav?: () => void;
  mobileMenu?: boolean;
  onOpenNav?: () => void;
}) {
  return (
    <div className={`story-tab-panel flex min-h-0 flex-1 flex-col overflow-hidden${mobileMenu ? " story-tab-panel--mobile-fullscreen" : ""}`}>
      <div className="product-landing-console-shell shrink-0">
        <header className={`product-landing-header flex items-center ${suisseIntl.className}`}>
          {mobileMenu && onOpenNav ? <StoryMobileMenuButton onClick={onOpenNav} /> : null}
          {navCollapsed && onExpandNav ? <StoryNavExpandButton onClick={onExpandNav} /> : null}
          <h1 className="product-landing-header__title m-0 font-normal tracking-tight">{title}</h1>
        </header>
      </div>
      <div className={`story-tab-panel__body relative min-h-0 flex-1${storyTabPanelBodyClass(tab)}`}>
        {tab === "introduction" ? <StoryIntroductionPanel /> : null}

        {tab === "our-ask" ? <StoryOurAskPanel /> : null}

        {tab === "goals-at-seed" ? <StoryGoalsAtSeedPanel /> : null}

        {tab === "team" ? <StoryTeamPanel /> : null}

        {tab === "genome" ? <StoryGenomePanel /> : null}

        {tab === "pulse" ? <StoryPulsePanel /> : null}

        {tab === "fabric" ? <StoryFabricPanel /> : null}

        {tab === "float" ? <StoryFloatPanel /> : null}

        {tab === "roadmap-gtm" ? <StoryRoadmapPanel /> : null}
      </div>
    </div>
  );
}
