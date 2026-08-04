import type { AboutStyleFeatureShaderVariant } from "@/lib/blog/about-style-feature-card";

/** Distinct static shader per featured post — /blog list previews only (not article heroes). */
export const BLOG_LANDING_PREVIEW_SHADERS: Record<string, AboutStyleFeatureShaderVariant> = {
  "pulse-call-history": "agents",
  "pulse-ambient": "ambient-band",
  "introducing-pulse": "front-desk-band",
  "introducing-fabric": "customize-agents-band",
  "introducing-float": "active-agents-band",
  "the-broader-doe-vision": "looking-ahead",
};

export function blogLandingPreviewShader(slug: string): AboutStyleFeatureShaderVariant {
  return BLOG_LANDING_PREVIEW_SHADERS[slug] ?? "validate";
}

/** Broader Doe Vision subheading on /blog + related carousel previews only. */
export const BLOG_PREVIEW_BROADER_DOE_VISION_SUBHEADING = "Own your clinical intelligence.";
