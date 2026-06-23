import { BlogFilterBar } from "@/components/blog/BlogFilterBar";
import { BlogLandingHeroGraphic } from "@/components/blog/BlogLandingHeroGraphic";
import {
  BLOG_LANDING_HERO_BOX_TW,
  BLOG_LANDING_HERO_CORNER_PAD,
  BLOG_LANDING_HERO_HEADLINE_TW,
  BLOG_LANDING_HERO_HEIGHT,
  BLOG_LANDING_HERO_LABEL_TW,
} from "@/lib/blog/blog-layout-styles";

export function BlogLandingHero({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden ${BLOG_LANDING_HERO_BOX_TW} ${BLOG_LANDING_HERO_HEIGHT} ${className}`.trim()}
    >
      <BlogLandingHeroGraphic />

      {/* Label — top-left */}
      <p className={BLOG_LANDING_HERO_LABEL_TW}>Blog</p>

      {/* Headline — bottom-left */}
      <p className={BLOG_LANDING_HERO_HEADLINE_TW}>
        <span className="block">Let&rsquo;s rebuild</span>
        <span className="block">healthcare.</span>
      </p>

      {/* Filter column — bottom-right, same corner padding as headline */}
      <div className={`absolute bottom-0 right-0 z-[2] ${BLOG_LANDING_HERO_CORNER_PAD}`}>
        <BlogFilterBar variant="hero" />
      </div>
    </div>
  );
}
