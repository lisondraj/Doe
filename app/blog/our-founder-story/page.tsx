import type { Metadata } from "next";

import { AboutStyleArticleRouter } from "@/components/blog/AboutStyleArticleRouter";
import { ShaderBackdropPreloadLinks } from "@/components/shared/ShaderBackdropPreloadLinks";
import { BLOG_FOUNDER_STORY_SHADER_BACKDROP_PATHS } from "@/lib/blog/blog-about-shader-backdrops";
import {
  OUR_FOUNDER_STORY_ARTICLE,
  OUR_FOUNDER_STORY_EXCERPT,
  OUR_FOUNDER_STORY_PATH,
  OUR_FOUNDER_STORY_TITLE,
} from "@/lib/blog/our-founder-story-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${OUR_FOUNDER_STORY_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: OUR_FOUNDER_STORY_EXCERPT,
  alternates: {
    canonical: `${primarySiteOrigin()}${OUR_FOUNDER_STORY_PATH}`,
  },
};

export default function OurFounderStoryPage() {
  return (
    <>
      <ShaderBackdropPreloadLinks srcs={BLOG_FOUNDER_STORY_SHADER_BACKDROP_PATHS} />
      <AboutStyleArticleRouter article={OUR_FOUNDER_STORY_ARTICLE} />
    </>
  );
}
