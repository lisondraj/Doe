"use client";

import { StoryFundraiseBudgetTable } from "@/components/story/StoryFundraiseBudgetTable";
import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  STORY_FUNDRAISE_AMOUNT,
  STORY_FUNDRAISE_ROUND,
  STORY_FUNDRAISE_RUNWAY_DURATION,
  STORY_FUNDRAISE_RUNWAY_LABEL,
} from "@/lib/story/story-copy";
import type { StoryTabId } from "@/lib/story/story-nav";

function storyTabPanelBodyClass(tab: StoryTabId) {
  if (tab === "our-ask") return " story-tab-panel__body--fundraise";
  if (tab === "budget") return " story-tab-panel__body--budget";
  return "";
}

/** Blank brown workspace — tab header and optional tab-specific content. */
export function StoryBlankPanel({ tab, title }: { tab: StoryTabId; title: string }) {
  return (
    <div className="story-tab-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="product-landing-console-shell shrink-0">
        <header className={`product-landing-header flex items-center ${suisseIntl.className}`}>
          <h1 className="product-landing-header__title m-0 font-normal tracking-tight">{title}</h1>
        </header>
      </div>
      <div className={`story-tab-panel__body relative min-h-0 flex-1${storyTabPanelBodyClass(tab)}`}>
        {tab === "budget" ? <StoryFundraiseBudgetTable /> : null}

        {tab === "our-ask" ? (
          <div className={`story-fundraise-callout ${dmSans.className}`}>
            <p className="story-fundraise-round m-0">{STORY_FUNDRAISE_ROUND}</p>
            <div className="story-fundraise-amount-block">
              <p className="story-fundraise-amount m-0" aria-label="Seven hundred fifty thousand dollars">
                {STORY_FUNDRAISE_AMOUNT}
              </p>
              <div className="story-fundraise-runway">
                <p className="story-fundraise-runway-duration m-0">{STORY_FUNDRAISE_RUNWAY_DURATION}</p>
                <p className="story-fundraise-runway-label m-0">{STORY_FUNDRAISE_RUNWAY_LABEL}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
