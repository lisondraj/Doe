import type { AboutStyleFeatureShaderVariant } from "@/lib/blog/about-style-feature-card";
import type { ProtoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";

/** Baked high-res about-style hero band — no live WebGL on /about + founder story. */
export const BLOG_ABOUT_HERO_BACKDROP = "/story/blog-about-hero-backdrop.png";

/** Baked high-res join-campus hero — no live WebGL on /partners. */
export const BLOG_JOIN_CAMPUS_HERO_BACKDROP = "/story/blog-join-campus-hero-backdrop.png";

/** Baked high-res dusk footer band — about-style article footers. */
export const BLOG_DUSK_FOOTER_BACKDROP = "/story/blog-dusk-footer-backdrop.png";

const BLOG_ABOUT_FEATURE_BACKDROPS: Partial<Record<AboutStyleFeatureShaderVariant, string>> = {
  "looking-ahead": "/story/blog-looking-ahead-backdrop.png",
};

const BLOG_ABOUT_CAROUSEL_BACKDROPS: Partial<Record<ProtoGrainGradientVariant, string>> = {
  integrate: "/story/blog-carousel-integrate-backdrop.png",
  "meet-proto-stack-2": "/story/blog-carousel-meet-proto-stack-2-backdrop.png",
  "looking-ahead": "/story/blog-looking-ahead-backdrop.png",
  "meet-proto": "/story/blog-carousel-meet-proto-backdrop.png",
  prototype: "/story/blog-carousel-prototype-backdrop.png",
  "meet-proto-stack-1": "/story/blog-carousel-meet-proto-stack-1-backdrop.png",
  shortlist: "/story/blog-carousel-shortlist-backdrop.png",
  "home-integrations": "/story/blog-carousel-home-integrations-backdrop.png",
};

export function blogAboutFeatureShaderBackdrop(variant: AboutStyleFeatureShaderVariant) {
  return BLOG_ABOUT_FEATURE_BACKDROPS[variant];
}

export function blogAboutCarouselShaderBackdrop(variant: ProtoGrainGradientVariant) {
  return BLOG_ABOUT_CAROUSEL_BACKDROPS[variant];
}

const BLOG_ABOUT_CAROUSEL_BACKDROP_PATHS = [
  "/story/blog-carousel-integrate-backdrop.png",
  "/story/blog-carousel-meet-proto-stack-2-backdrop.png",
  "/story/blog-carousel-meet-proto-backdrop.png",
  "/story/blog-carousel-prototype-backdrop.png",
  "/story/blog-carousel-meet-proto-stack-1-backdrop.png",
  "/story/blog-carousel-shortlist-backdrop.png",
  "/story/blog-carousel-home-integrations-backdrop.png",
] as const;

/** /about + founder story + /partners — footer carousel tile PNGs. */
export const BLOG_ABOUT_CAROUSEL_SHADER_BACKDROP_PATHS = BLOG_ABOUT_CAROUSEL_BACKDROP_PATHS;

/** /about — hero, footer, and carousel backdrops. */
export const BLOG_ABOUT_PAGE_SHADER_BACKDROP_PATHS = [
  BLOG_ABOUT_HERO_BACKDROP,
  BLOG_DUSK_FOOTER_BACKDROP,
  ...BLOG_ABOUT_CAROUSEL_BACKDROP_PATHS,
] as const;

/** /partners — join-campus hero, footer, and carousel backdrops. */
export const BLOG_PARTNERS_PAGE_SHADER_BACKDROP_PATHS = [
  BLOG_JOIN_CAMPUS_HERO_BACKDROP,
  BLOG_DUSK_FOOTER_BACKDROP,
  ...BLOG_ABOUT_CAROUSEL_BACKDROP_PATHS,
] as const;

/** Founder story — hero, inline figure, footer, and carousel backdrops. */
export const BLOG_FOUNDER_STORY_SHADER_BACKDROP_PATHS = [
  BLOG_ABOUT_HERO_BACKDROP,
  BLOG_DUSK_FOOTER_BACKDROP,
  "/story/blog-looking-ahead-backdrop.png",
  ...BLOG_ABOUT_CAROUSEL_BACKDROP_PATHS,
] as const;
