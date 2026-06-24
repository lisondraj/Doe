import { BlogFilterBar } from "@/components/blog/BlogFilterBar";
import { BlogLandingHeroGraphic } from "@/components/blog/BlogLandingHeroGraphic";
import {
  BLOG_LANDING_HERO_BOX_TW,
  BLOG_LANDING_HERO_CORNER_PAD,
  BLOG_LANDING_HERO_HEADLINE_TW,
  BLOG_LANDING_HERO_HEIGHT,
} from "@/lib/blog/blog-layout-styles";

export function BlogLandingHero({
  className = "",
  line1 = "Let\u2019s rebuild",
  line2 = "healthcare.",
}: {
  className?: string;
  line1?: string;
  line2?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${BLOG_LANDING_HERO_BOX_TW} ${BLOG_LANDING_HERO_HEIGHT} ${className}`.trim()}
    >
      <BlogLandingHeroGraphic />

      {/* Headline — bottom-left */}
      <p className={BLOG_LANDING_HERO_HEADLINE_TW}>
        <span className="block">{line1}</span>
        <span className="block">{line2}</span>
      </p>

      {/* Filter column — bottom-right, same corner padding as headline */}
      <div className={`absolute bottom-0 right-0 z-[2] ${BLOG_LANDING_HERO_CORNER_PAD}`}>
        <BlogFilterBar variant="hero" />
      </div>
    </div>
  );
}
