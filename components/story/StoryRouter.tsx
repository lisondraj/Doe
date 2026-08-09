"use client";

import { StoryDesktopView } from "@/components/story/StoryDesktopView";
import { StoryMeetDoeModal } from "@/components/story/StoryMeetDoeModal";
import { StoryMobileView } from "@/components/story/StoryMobileView";
import { useProductPageVariant } from "@/lib/product/use-product-page-variant";

export function StoryRouter() {
  const variant = useProductPageVariant();

  return (
    <>
      {variant === "desktop" ? <StoryDesktopView /> : <StoryMobileView />}
      <StoryMeetDoeModal />
    </>
  );
}
