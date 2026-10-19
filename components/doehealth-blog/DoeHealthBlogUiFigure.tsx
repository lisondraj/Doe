"use client";

import { DoeHealthBlogDotField } from "@/components/doehealth-blog/DoeHealthBlogDotField";
import { articleBoxColors } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
import { DOEHEALTH_BLOG_SCENES } from "@/components/doehealth-blog/scenes";
import { SceneStage } from "@/components/doehealth-blog/scenes/kit";
import type { DoeHealthBlogDots, DoeHealthBlogPlaceholderTone, DoeHealthBlogSceneId } from "@/lib/doehealth/doehealth-blog-articles";

/** A body figure: a moving dot field in the tone's colours, with an animated product scene on top. */
export function DoeHealthBlogUiFigure({ scene, dots, tone }: { scene: DoeHealthBlogSceneId; dots: DoeHealthBlogDots; tone: DoeHealthBlogPlaceholderTone }) {
  const { bg, dot } = articleBoxColors(tone);
  return (
    <div className="doehealth-blog-placeholder doehealth-blog-placeholder--pattern doehealth-blog-article__figure-art" style={{ background: bg }}>
      <DoeHealthBlogDotField dots={dots} color={dot} />
      <SceneStage spec={DOEHEALTH_BLOG_SCENES[scene]} />
    </div>
  );
}
