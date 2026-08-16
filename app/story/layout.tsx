import type { Metadata } from "next";

import { ShaderBackdropPreloadLinks } from "@/components/shared/ShaderBackdropPreloadLinks";
import { STORY_BAKED_SHADER_BACKDROP_PATHS } from "@/lib/story/story-baked-shader-backdrops";

export const metadata: Metadata = {
  title: "Doe Story",
};

export default function StoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ShaderBackdropPreloadLinks srcs={STORY_BAKED_SHADER_BACKDROP_PATHS} />
      {children}
    </>
  );
}
