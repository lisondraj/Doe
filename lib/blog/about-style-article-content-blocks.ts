import type { AboutStyleFeatureShaderVariant } from "@/lib/blog/about-style-feature-card";

export type AboutStyleArticleContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | {
      /** Broader Doe Vision–style gold pull quote. Wrap a phrase in `**text**` to bold it. */
      type: "quote";
      id: string;
      lead: string;
      continuation: string;
    }
  | {
      type: "shader";
      id: string;
      shaderVariant: AboutStyleFeatureShaderVariant;
      caption: string;
    };
