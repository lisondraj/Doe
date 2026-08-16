"use client";

import { useState } from "react";

import { StoryBlankPanel } from "@/components/story/StoryBlankPanel";
import { StoryMobileNavDrawer } from "@/components/story/StoryMobileNavDrawer";
import { StoryTabPager } from "@/components/story/StoryTabPager";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { STORY_DEFAULT_TAB, storyTabHeaderLabel } from "@/lib/story/story-copy";
import type { StoryTabId } from "@/lib/story/story-nav";
import "@/lib/product/product-brown-mock.css";
import "@/lib/product/product-landing.css";
import "@/lib/story/story-page.css";

/** Phone /story — full-screen tab with slide-over navigation. */
export function StoryMobileView() {
  useDoePhoneLayoutViewport(true);
  const [storyTab, setStoryTab] = useState<StoryTabId>(STORY_DEFAULT_TAB);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <main className="product-page-root story-mobile-page-root h-dvh min-h-0 w-full overflow-hidden">
      <div className="product-brown-mock product-brown-story-mode product-brown-story-mode--mobile story-mobile-shell flex h-full min-h-0 flex-col">
        <StoryBlankPanel
          tab={storyTab}
          title={storyTabHeaderLabel(storyTab)}
          mobileMenu
          onOpenNav={() => setNavOpen(true)}
        />
        <StoryTabPager activeTab={storyTab} onSelect={setStoryTab} />
        <StoryMobileNavDrawer
          open={navOpen}
          activeTab={storyTab}
          onSelect={setStoryTab}
          onClose={() => setNavOpen(false)}
        />
      </div>
    </main>
  );
}
