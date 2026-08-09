"use client";

import { useState } from "react";

import { StoryBlankPanel } from "@/components/story/StoryBlankPanel";
import { StorySidebarFooter } from "@/components/story/StorySidebarFooter";
import { StorySidebarNav } from "@/components/story/StorySidebarNav";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { STORY_DEFAULT_TAB, storyTabHeaderLabel } from "@/lib/story/story-copy";
import type { StoryTabId } from "@/lib/story/story-nav";
import "@/lib/product/product-brown-mock.css";
import "@/lib/product/product-landing.css";
import "@/lib/story/story-page.css";

/** Phone /story — scrollable tab list + blank brown panel. */
export function StoryMobileView() {
  useDoePhoneLayoutViewport(true);
  const [storyTab, setStoryTab] = useState<StoryTabId>(STORY_DEFAULT_TAB);

  return (
    <main className="product-page-root h-dvh min-h-0 w-full overflow-hidden bg-transparent">
      <div className="product-brown-mock product-brown-story-mode product-brown-story-mode--mobile flex h-full min-h-0 flex-col">
        <div className="story-mobile-nav-shell min-h-0 max-h-[42%] shrink-0 overflow-hidden border-b">
          <StorySidebarNav activeTab={storyTab} onSelect={setStoryTab} />
        </div>
        <StoryBlankPanel tab={storyTab} title={storyTabHeaderLabel(storyTab)} />
        <StorySidebarFooter />
      </div>
    </main>
  );
}
