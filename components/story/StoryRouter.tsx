"use client";

import { StoryDesktopView } from "@/components/story/StoryDesktopView";
import { StoryMeetDoeModal } from "@/components/story/StoryMeetDoeModal";
import { StoryMobileView } from "@/components/story/StoryMobileView";
import { ShaderBackdropPreloader } from "@/components/shared/ShaderBackdropPreloader";
import { useProductPageVariant } from "@/lib/product/use-product-page-variant";
import { STORY_BAKED_SHADER_BACKDROP_PATHS } from "@/lib/story/story-baked-shader-backdrops";

export function StoryRouter() {
  const variant = useProductPageVariant();

  return (
    <>
      <ShaderBackdropPreloader srcs={STORY_BAKED_SHADER_BACKDROP_PATHS} />
      {variant === "desktop" ? <StoryDesktopView /> : <StoryMobileView />}
      <StoryMeetDoeModal />
    </>
  );
}
