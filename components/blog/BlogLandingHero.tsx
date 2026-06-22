import { BlogLandingHeroGraphic } from "@/components/blog/BlogLandingHeroGraphic";
import {
  BLOG_LANDING_HERO_BOX_TW,
  BLOG_LANDING_HERO_HEADLINE_TW,
  BLOG_LANDING_HERO_HEIGHT,
} from "@/lib/blog/blog-layout-styles";

export function BlogLandingHero({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden ${BLOG_LANDING_HERO_BOX_TW} ${BLOG_LANDING_HERO_HEIGHT} ${className}`.trim()}
    >
      <BlogLandingHeroGraphic />
      <p className={BLOG_LANDING_HERO_HEADLINE_TW}>
        <span className="block">Let&rsquo;s rebuild</span>
        <span className="block">healthcare.</span>
      </p>
    </div>
  );
}
