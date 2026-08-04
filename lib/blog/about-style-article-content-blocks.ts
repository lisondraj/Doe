import type { AboutStyleFeatureShaderVariant } from "@/lib/blog/about-style-feature-card";

export type AboutStyleArticleContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | {
      type: "shader";
      id: string;
      shaderVariant: AboutStyleFeatureShaderVariant;
      caption: string;
    };
