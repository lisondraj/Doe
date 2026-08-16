"use client";

import { storyAdjacentTab, type StoryTabId } from "@/lib/story/story-nav";

function PagerChevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="story-tab-pager__icon"
    >
      {direction === "prev" ? <path d="m14.5 6.5-6 5.5 6 5.5" /> : <path d="m9.5 6.5 6 5.5-6 5.5" />}
    </svg>
  );
}

/** Fixed prev/next controls — walk tabs in sidebar order. */
export function StoryTabPager({
  activeTab,
  onSelect,
}: {
  activeTab: StoryTabId;
  onSelect: (tab: StoryTabId) => void;
}) {
  const previousTab = storyAdjacentTab(activeTab, -1);
  const nextTab = storyAdjacentTab(activeTab, 1);

  return (
    <div className="story-tab-pager" aria-label="Story tab navigation">
      <button
        type="button"
        className="story-tab-pager__button"
        aria-label="Previous tab"
        disabled={previousTab == null}
        onClick={() => {
          if (previousTab) onSelect(previousTab);
        }}
      >
        <PagerChevron direction="prev" />
      </button>
      <button
        type="button"
        className="story-tab-pager__button"
        aria-label="Next tab"
        disabled={nextTab == null}
        onClick={() => {
          if (nextTab) onSelect(nextTab);
        }}
      >
        <PagerChevron direction="next" />
      </button>
    </div>
  );
}
