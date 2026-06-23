import { BlogFilterBar } from "@/components/blog/BlogFilterBar";
import { BlogLandingHeroGraphic } from "@/components/blog/BlogLandingHeroGraphic";
import {
  BLOG_LANDING_HERO_BOX_TW,
  BLOG_LANDING_HERO_FOOTER_TW,
  BLOG_LANDING_HERO_HEADLINE_TW,
  BLOG_LANDING_HERO_HEIGHT,
} from "@/lib/blog/blog-layout-styles";

export function BlogLandingHero({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden ${BLOG_LANDING_HERO_BOX_TW} ${BLOG_LANDING_HERO_HEIGHT} ${className}`.trim()}
    >
      <BlogLandingHeroGraphic />

      {/* Bottom row — flex columns prevent headline / filter overlap in in-app browsers */}
      <div className={BLOG_LANDING_HERO_FOOTER_TW}>
        <p className={BLOG_LANDING_HERO_HEADLINE_TW}>
          <span className="block">Let&rsquo;s rebuild</span>
          <span className="block">healthcare.</span>
        </p>

        <div className="shrink-0 self-end">
          <BlogFilterBar variant="hero" />
        </div>
      </div>
    </div>
  );
}
