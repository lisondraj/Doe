import type { AboutStyleFeatureShaderVariant } from "@/lib/blog/about-style-feature-card";

/** Distinct static shader per featured post — landing list + related carousel only (not article heroes). */
export const BLOG_LANDING_PREVIEW_SHADERS: Record<string, AboutStyleFeatureShaderVariant> = {
  "pulse-call-history": "active-agents-band",
  "pulse-ambient": "ambient",
  "introducing-pulse": "front-desk-band",
  "introducing-fabric": "customize-agents-band",
  "the-broader-doe-vision": "looking-ahead",
};

export function blogLandingPreviewShader(slug: string): AboutStyleFeatureShaderVariant {
  return BLOG_LANDING_PREVIEW_SHADERS[slug] ?? "validate";
}
